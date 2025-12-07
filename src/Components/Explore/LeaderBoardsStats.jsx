import React, { useEffect, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { orderBy, limit } from "firebase/firestore";

export default function Leaderboard() {
  const { getCollection } = useFirestore();
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const users = await getCollection("users", [
          orderBy("credibilityScore", "desc"),
          limit(10)
        ]);

        setTopUsers(users.map(u => ({
          name: u.displayName || "Anonymous",
          points: (u.credibilityScore || 0) * 10,
          credibility: u.credibilityScore || 0
        })));
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [getCollection]);

  return (
    <div className="flex flex-col gap-2 h-full bg-[#FCFCF9] dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-[#333] p-4 overflow-hidden transition-colors duration-300">

      <div className="text-xs font-bold text-[#8A877C] dark:text-[#A0A0A0] mb-1 flex-none uppercase tracking-wider">
        Top Collaborators
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
        {topUsers.map((user, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 
            bg-[#F0EFE9] dark:bg-[#252525] rounded-xl p-2.5 
            border border-[#E2E1DB] dark:border-[#3A3A3A]"
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 bg-gradient-to-br from-[#D94F04] to-[#FF7A33] 
              rounded-full flex items-center justify-center 
              text-xs font-bold text-white flex-none shadow-sm"
            >
              {user.name.charAt(0)}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#2B2B2B] dark:text-[#EAEAEA] truncate">
                {user.name}
              </div>

              {/* Credibility Bar */}
              <div className="w-full bg-[#E2E1DB] dark:bg-[#333] rounded-full h-1.5 mt-1.5">
                <div
                  className="h-1.5 rounded-full 
                  bg-gradient-to-r from-[#D94F04] to-[#FF7A33]"
                  style={{ width: `${Math.min(user.credibility, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Points */}
            <div className="text-xs text-[#D94F04] font-bold flex-none">
              {user.points}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
