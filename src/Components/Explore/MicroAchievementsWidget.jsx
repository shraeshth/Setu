import React, { useEffect, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { useAuth } from "../../Contexts/AuthContext";
import { where, orderBy, limit, documentId } from "firebase/firestore";

export default function MicroAchievementsWidget() {
  const { getCollection } = useFirestore();
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchActivity = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);

        // 1. Fetch Connections
        const connectionsAsRequester = await getCollection("connections", [
          where("requesterId", "==", currentUser.uid),
          where("status", "==", "accepted"),
          limit(10)
        ]);
        const connectionsAsReceiver = await getCollection("connections", [
          where("receiverId", "==", currentUser.uid),
          where("status", "==", "accepted"),
          limit(10)
        ]);

        // 2. Fetch Projects
        const projects = await getCollection("collaborations", [
          where("memberIds", "array-contains", currentUser.uid),
          limit(10)
        ]);

        // 3. User Name Resolution
        // Collect UIDs to fetch
        const userIdsToFetch = new Set();
        [...connectionsAsRequester, ...connectionsAsReceiver].forEach(c => {
          const otherId = c.requesterId === currentUser.uid ? c.receiverId : c.requesterId;
          if (otherId) userIdsToFetch.add(otherId);
        });

        const userMap = {};
        if (userIdsToFetch.size > 0) {
          // Firestore 'in' limit is 10. Split if needed.
          const ids = Array.from(userIdsToFetch).slice(0, 10); // Limit to 10 for safety
          if (ids.length > 0) {
            const users = await getCollection("users", [
              where("uid", "in", ids)
            ]);
            users.forEach(u => userMap[u.uid] = u.displayName || "Unknown User");
          }
        }

        const activityList = [];

        [...connectionsAsRequester, ...connectionsAsReceiver].forEach(c => {
          const isRequester = c.requesterId === currentUser.uid;
          const otherId = isRequester ? c.receiverId : c.requesterId;
          const name = userMap[otherId] || (isRequester ? c.receiverName : c.requesterName) || "User";

          activityList.push({
            id: c.id,
            type: 'connection',
            main: `You connected with ${name} `,
            sub: "Expanded your network",
            date: new Date(c.updatedAt || c.createdAt || Date.now())
          });
        });

        projects.forEach(p => {
          const isOwner = p.ownerUid === currentUser.uid;
          activityList.push({
            id: p.id,
            type: 'project',
            main: isOwner ? `Created "${p.title}"` : `Joined "${p.title}"`,
            sub: p.category || "New Project",
            date: new Date(p.createdAt || Date.now())
          });
        });

        // 4. Sort & Limit
        const uniqueActivity = Array.from(new Map(activityList.map(item => [item.id, item])).values());
        const sorted = uniqueActivity
          .sort((a, b) => b.date - a.date)
          .slice(0, 6);

        if (mounted) setItems(sorted.map(a => ({
          ...a,
          time: getTimeAgo(a.date)
        })));

      } catch (err) {
        console.error("Error fetching activity:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchActivity();
    return () => { mounted = false; };
  }, [currentUser, getCollection]);

  const getTimeAgo = (dateObj) => {
    if (!dateObj) return "";
    const now = new Date();
    const hours = Math.floor((now - dateObj) / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) return <div className="text-xs text-gray-400 p-2">Loading...</div>;
  if (items.length === 0) return <div className="text-xs text-gray-500">No recent activity.</div>;

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="space-y-1 overflow-y-auto h-full pb-4 scrollbar-hide relative z-10">
        {items.map((a) => (
          <div
            key={a.id}
            className="
              border-b border-[#E2E1DB]/50 dark:border-[#3A3A3A] 
              p-1 last:border-b-0
              hover:bg-[#F0F0F0] dark:hover:bg-black/20 transition-all cursor-pointer
            "
          >
            <h4
              className="font-medium text-sm line-clamp-1
                        text-[#1E3E88] dark:text-[#ffffff]"
            >
              {a.main}
            </h4>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-xs font-medium text-[#2E7BE4] dark:text-[#5B9FFF]">
                {a.sub}
              </span>
              <span className="text-[10px] text-gray-400">
                {a.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#FCFCF9] dark:from-[#2B2B2B] via-[#FCFCF9]/80 dark:via-[#2B2B2B]/80 to-transparent pointer-events-none z-20" />
    </div>
  );
}
