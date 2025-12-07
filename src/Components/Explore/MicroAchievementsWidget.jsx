import React, { useEffect, useState } from "react";
import { Sparkles, Eye, UserPlus, Users, Bookmark } from "lucide-react"
import { useFirestore } from "../../Hooks/useFirestore";
import { useAuth } from "../../Contexts/AuthContext";
import { where, orderBy, limit } from "firebase/firestore";

export default function MicroAchievementsWidget() {
  const { getCollection } = useFirestore();
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!currentUser) return;
      try {
        const data = await getCollection("achievements", [
          where("userId", "==", currentUser.uid),
          orderBy("createdAt", "desc"),
          limit(5)
        ]);

        setItems(data.map(a => ({
          ...a,
          icon: getIcon(a.type),
          time: getTimeAgo(a.createdAt)
        })));
      } catch (err) {
        console.error("Error fetching achievements:", err);
      }
    };
    fetchAchievements();
  }, [currentUser, getCollection]);

  const getIcon = (type) => {
    switch (type) {
      case "view": return Eye;
      case "connection": return UserPlus;
      case "match": return Users;
      default: return Sparkles;
    }
  };

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const hours = Math.floor((now - date) / 3600000);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (items.length === 0) return <div className="text-xs text-gray-500">No recent activity.</div>;

  return (
    <div className="
      h-full flex flex-col
    ">

      {/* Items */}
      <div className="space-y-2 overflow-y-auto pr-1">
        {items.map((a, i) => (
          <div
            key={i}
            className="
              flex items-start gap-2 border-b border-[#E2E1DB] dark:border-[#3A3A3A] 
                             pb-1 last:border-b-0
              transition-all cursor-pointer
            "
          >
            <a.icon className="w-4 h-4 text-[#D94F04]" />
            <div className="flex-1">
              <p className="text-xs text-[#3C3C3C] dark:text-gray-300 leading-tight">
                {a.text}
              </p>
              <span className="text-[10px] text-[#8A877C] dark:text-gray-500">
                {a.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
