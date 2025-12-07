import React, { useEffect, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { useAuth } from "../../Contexts/AuthContext";
import { where, orderBy, limit } from "firebase/firestore";
import { User, Star } from "lucide-react";

export default function ConnectionsListWidget() {
  const { getCollection } = useFirestore();
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchConnections = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);

        // 1. Fetch Accepted Connections (Requester & Receiver)
        const asRequester = await getCollection("connections", [
          where("requesterId", "==", currentUser.uid),
          where("status", "==", "accepted"),
          limit(20)
        ]);
        const asReceiver = await getCollection("connections", [
          where("receiverId", "==", currentUser.uid),
          where("status", "==", "accepted"),
          limit(20)
        ]);

        // 2. Identify Unique Users to Fetch
        const userIds = new Set();
        const connectionMap = [];

        [...asRequester, ...asReceiver].forEach(c => {
          const otherId = c.requesterId === currentUser.uid ? c.receiverId : c.requesterId;
          if (otherId) {
            userIds.add(otherId);
            connectionMap.push({ cid: c.id, uid: otherId, date: c.updatedAt || c.createdAt });
          }
        });

        const uniqueIds = Array.from(userIds).slice(0, 10); // Limit to 10 for batch safety
        const userProfileMap = {};

        if (uniqueIds.length > 0) {
          const users = await getCollection("users", [
            where("uid", "in", uniqueIds)
          ]);
          users.forEach(u => {
            let score = u.credibilityscore ?? u.credibilityScore ?? u.credibility?.score ?? "N/A";
            if (typeof score === 'number') score = score.toFixed(1);

            userProfileMap[u.uid] = {
              name: u.displayName || "Unknown User",
              role: u.headline || u.role || "Member",
              photoURL: u.photoURL,
              score: score
            };
          });
        }

        // 3. Build List
        const finalList = connectionMap
          .map(c => {
            const profile = userProfileMap[c.uid] || { name: "Unknown User", role: "Member", score: "N/A" };
            return {
              id: c.cid,
              uid: c.uid, // Useful for navigation if needed
              name: profile.name,
              role: profile.role,
              photoURL: profile.photoURL,
              date: c.date,
              score: profile.score
            };
          })
          // Filter out any that didn't resolve if needed, or keep them
          .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

        if (mounted) setConnections(finalList);

      } catch (err) {
        console.error("Error fetching connections widget:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchConnections();
    return () => { mounted = false; };
  }, [currentUser, getCollection]);

  const getTimeAgo = (dateObj) => {
    if (!dateObj) return "";
    const now = new Date();
    const date = dateObj.toDate ? dateObj.toDate() : new Date(dateObj);
    const hours = Math.floor((now - date) / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) return <div className="text-xs text-gray-400 p-2">Loading connections...</div>;
  if (connections.length === 0) return <div className="text-xs text-gray-500">No connections yet.</div>;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">

      {/* Items List */}
      <div className="space-y-2 overflow-y-auto h-full pr-1 pb-4
                      scrollbar-hide relative z-10">
        {connections.map((c) => (
          <div
            key={c.id}
            className="border-b border-[#E2E1DB] dark:border-[#3A3A3A] 
                       pb-1 last:border-b-0 group cursor-pointer 
                       flex justify-between items-start"
          >
            <div className="flex-1 min-w-0">
              {/* Name (Title Style from TechNews) */}
              <h4 className="font-medium text-sm line-clamp-1 
                               text-[#722c09] dark:text-[#F9F8F3] 
                               group-hover:text-[#D94F04] dark:group-hover:text-[#FFA666]
                               transition-colors duration-200">
                {c.name}
              </h4>

              {/* Role (Metadata Style from TechNews) */}
              <p className="text-[11px] 
                              text-[#8A877C] dark:text-[#A0A0A0] 
                              mt-[1px] flex items-center gap-1 line-clamp-1">
                <User size={10} className="text-[#D94F04]" />
                <span>{c.role}</span>
              </p>
            </div>

            {/* Right Side Info */}
            <div className="flex flex-col items-end mt-0.5 ml-2">
              <span className="text-[10px] text-[#8A877C] dark:text-[#707070] whitespace-nowrap">
                {getTimeAgo(c.date)}
              </span>
              {c.score !== "N/A" && (
                <span className=" flex items-center gap-1 justify-center text-sm text-[#D94F04] whitespace-nowrap">
                  <Star size={15} className="text-[#D94F04]" /> {c.score}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Fade Overlay (from TechNews) */}
      <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#FCFCF9] dark:from-[#2B2B2B] to-transparent pointer-events-none z-20"></div>
    </div>
  );
}
