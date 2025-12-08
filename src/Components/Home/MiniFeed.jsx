import React, { useEffect, useRef, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { orderBy, limit, where } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";



export default function MiniFeed() {
  const { getCollection } = useFirestore();
  const [posts, setPosts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const [recentTasks, recentUsers, recentConnections] = await Promise.all([
          // 1. Tasks
          getCollection("collab_tasks", [orderBy("createdAt", "desc"), limit(6)]),
          // 2. New Users
          getCollection("users", [orderBy("createdAt", "desc"), limit(5)]),
          // 3. Recent Connections
          // 3. Recent Connections
          getCollection("connections", [where("status", "==", "accepted"), limit(20)])
        ]);

        // Normalize Data
        let feedItems = [];

        // Tasks
        recentTasks.forEach(t => {
          feedItems.push({
            type: 'task',
            data: t,
            createdAt: t.createdAt
          });
        });

        // Users
        recentUsers.forEach(u => {
          feedItems.push({
            type: 'user_join',
            data: u,
            createdAt: u.createdAt
          });
        });

        // Connections
        recentConnections.forEach(c => {
          feedItems.push({
            type: 'connection',
            data: c,
            createdAt: c.createdAt // or updatedAt
          });
        });

        // Sort Mixed Feed
        feedItems.sort((a, b) => {
          const getTime = (d) => {
            if (!d) return 0;
            if (d.toDate) return d.toDate().getTime();
            if (d.seconds) return d.seconds * 1000;
            return new Date(d).getTime();
          };
          return getTime(b.createdAt) - getTime(a.createdAt);
        });

        // Collect all distinct UIDs to fetch profiles
        const uidSet = new Set();
        feedItems.forEach(item => {
          if (item.type === 'task') {
            const t = item.data;
            const uid = t.createdByUid || t.createdBy?.uid || t.assignee?.id;
            if (uid) uidSet.add(uid);
          } else if (item.type === 'user_join') {
            uidSet.add(item.data.id || item.data.uid);
          } else if (item.type === 'connection') {
            uidSet.add(item.data.requesterId);
          }
        });

        // Batch Fetch Users
        const usersMap = new Map();
        const uidArray = Array.from(uidSet);
        if (uidArray.length > 0) {
          await Promise.all(uidArray.map(async (uid) => {
            try {
              const snap = await getDoc(doc(db, "users", uid));
              if (snap.exists()) usersMap.set(uid, snap.data());
            } catch (e) { }
          }));
        }

        // Format for View
        const formatted = feedItems.map(item => {
          let authorName = "Someone";
          let authorPhoto = null;
          let authorRole = "Member";
          let content = "";
          let uid = null;

          if (item.type === 'task') {
            const t = item.data;
            uid = t.createdByUid || t.createdBy?.uid || t.assignee?.id;

            content = t.title ? `Working on: "${t.title}"` : "Updated a task";
            if (t.status === 'completed') content = `Completed: "${t.title}"`;
            else if (t.createdByUid === uid) content = `Created: "${t.title}"`;
          }
          else if (item.type === 'user_join') {
            const u = item.data;
            uid = u.id || u.uid;
            content = "Just joined the platform!";
          }
          else if (item.type === 'connection') {
            const c = item.data;
            uid = c.requesterId;
            content = "Made a new connection!";
          }

          // Hydrate from Map
          if (uid && usersMap.has(uid)) {
            const u = usersMap.get(uid);
            authorName = u.displayName || u.name || authorName;
            authorPhoto = u.photoURL || authorPhoto;
            authorRole = u.headline || u.role || authorRole;
          } else if (item.type === 'task') {
            // Fallbacks
            authorName = item.data.createdBy?.name || authorName;
          }

          return {
            author: authorName,
            photo: authorPhoto,
            role: authorRole,
            content: content,
            time: getTimeAgo(item.createdAt)
          }
        });

        setPosts(formatted);

      } catch (err) {
        console.error("Multi-feed error:", err);
      }
    };

    fetchPosts();
  }, [getCollection]);

  // Robust time-ago handling (Firestore timestamp or JS Date/string)
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";

    let date;
    if (timestamp?.toDate && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      // object with seconds (sometimes seen)
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  // Auto horizontal scroll (keeps your original behavior)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || posts.length === 0) return;

    let scrollAmount = 0;
    let animationId;

    const scroll = () => {
      scrollAmount += 0.3;
      container.scrollLeft = scrollAmount;

      // allow a safe reset when duplicated content scrolls out
      const maxScroll = container.scrollWidth / 2;
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0;
        container.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [posts]);

  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative w-full h-full z-0">
      {/* LEFT FADE GRADIENT */}
      <div
        className="
          absolute left-0 top-0 h-full w-12
          bg-gradient-to-r 
          from-[#F9F8F3] dark:from-[#0B0B0B] 
          to-transparent
          z-10
        "
      ></div>

      {/* RIGHT FADE GRADIENT */}
      <div
        className="
          pointer-events-none absolute right-0 top-0 h-full w-12
          bg-gradient-to-l 
          from-[#F9F8F3] dark:from-[#0B0B0B] 
          to-transparent
          z-10
        "
      ></div>

      {/* SCROLL CONTENT */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-scroll select-none pb-2 scrollbar-hide"
        style={{ scrollBehavior: "auto" }}
      >
        {[...posts, ...posts].map((p, i) => (
          <div
            key={i}
            className="
              flex-shrink-0 w-52
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A]
              px-3 py-2.5 rounded-xl transition
            "
          >
            <div className="flex items-center gap-2 mb-1.5">
              {p.photo ? (
                <img
                  src={p.photo}
                  alt={p.author}
                  className="w-7 h-7 rounded-lg object-cover bg-gray-200"
                />
              ) : (
                <div
                  className="
                    w-7 h-7 rounded-lg bg-gradient-to-br 
                    from-[#D94F04] to-[#E86C2E]
                    text-white text-xs font-semibold flex items-center justify-center
                  "
                >
                  {p.author?.charAt(0) || "C"}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-[#2B2B2B] dark:text-gray-100 truncate">
                  {p.author}
                </p>
                <p className="text-[10px] text-[#8A877C] dark:text-gray-400 truncate">
                  {p.role}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#3C3C3C] dark:text-gray-300 mb-1 line-clamp-2 leading-relaxed">
              {p.content}
            </p>

            <p className="text-[9px] text-[#8A877C] dark:text-gray-500">
              {p.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
