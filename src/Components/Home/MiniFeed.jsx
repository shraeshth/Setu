import React, { useEffect, useRef, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { orderBy, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function MiniFeed() {
  const { getCollection } = useFirestore();
  const [posts, setPosts] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch recent completed or in-progress tasks
        const tasks = await getCollection("collab_tasks", [
          orderBy("createdAt", "desc"),
          limit(10)
        ]);

        const formattedPosts = await Promise.all(tasks.map(async (t) => {
          let authorName = t.createdBy?.name || t.assignee?.name || "Contributor";
          let authorPhoto = t.createdBy?.photoURL || t.assignee?.avatar || null;
          let uidToFetch = null;

          if (!t.createdBy?.name && t.createdByUid) {
            uidToFetch = t.createdByUid;
          } else if (!t.createdBy?.name && t.assignee?.id) {
            uidToFetch = t.assignee.id;
          }

          if (uidToFetch && (authorName === "Contributor" || !authorPhoto)) {
            try {
              const userRef = doc(db, "users", uidToFetch);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const data = userSnap.data();
                authorName = data.displayName || data.name || authorName;
                authorPhoto = data.photoURL || authorPhoto;
              }
            } catch (e) {
              console.error("Error fetching user", e);
            }
          }

          return {
            author: authorName,
            photo: authorPhoto,
            role: "Member",
            content: t.title,
            time: getTimeAgo(t.createdAt)
          };
        }));

        setPosts(formattedPosts);
      } catch (err) {
        console.error("Error fetching mini feed:", err);
      }
    };

    fetchPosts();
  }, [getCollection]);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";

    let date;
    // Handle Firestore Timestamp vs regular Date/String
    if (timestamp?.toDate) {
      date = timestamp.toDate();
    } else if (timestamp?.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return "";

    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || posts.length === 0) return;

    let scrollAmount = 0;
    let animationId;

    const scroll = () => {
      scrollAmount += 0.3;
      container.scrollLeft = scrollAmount;

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

  if (posts.length === 0) return null;

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
                  {p.author.charAt(0)}
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
