import React, { useEffect, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { limit } from "firebase/firestore";
import { Star, FolderGit2, Users, Trophy, Medal } from "lucide-react";

export default function Leaderboard() {
  const { getCollection } = useFirestore();
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const users = await getCollection("users", [limit(50)]);

        const rankedUsers = users.map(u => {
          const cred = Number(u.credibilityscore ?? u.credibilityScore ?? u.credibility?.score ?? 0);
          const projects = Number(u.projectCount || 0);
          const connections = Number(u.connectionCount || 0);
          const score = (cred * 20) + (projects * 5) + connections;

          return {
            name: (u.displayName || u.name || "Anonymous").split(" ")[0],
            photo: u.photoURL,
            credibility: cred,
            projects: projects,
            connections: connections,
            points: Math.round(score)
          };
        })
          .sort((a, b) => b.points - a.points)
          .slice(0, 10);

        setTopUsers(rankedUsers);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };
    fetchLeaderboard();
  }, [getCollection]);

  return (
    <div className="relative flex flex-col h-full bg-[#FCFCF9] dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-[#333] overflow-hidden transition-colors duration-300">

      {/* Header - Minimalist */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy size={20} className="text-[#D94F04]" />
          <span className="text-xl font-bold text-[#2B2B2B] dark:text-[#EAEAEA] tracking-wide uppercase">
            Leaderboard
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 pb-6 space-y-1 scrollbar-thin">
        {topUsers.map((user, idx) => {
          const rank = idx + 1;

          // Minimalist active state for top 3 (just subtle border/bg)
          const isTop3 = rank <= 3;
          const containerClass = isTop3
            ? "bg-white dark:bg-[#252525] border-[#E2E1DB] dark:border-[#3A3A3A] shadow-sm"
            : "border-transparent hover:bg-[#F0EFE9] dark:hover:bg-[#222]";

          // Elegant text colors for rank
          let rankColor = "text-[#8A877C] dark:text-[#707070]"; // Default grey
          if (rank === 1) rankColor = "text-[#D94F04]"; // Primary Accent
          if (rank === 2) rankColor = "text-[#2B2B2B] dark:text-[#EAEAEA]";
          if (rank === 3) rankColor = "text-[#6B6B6B] dark:text-[#A0A0A0]";

          return (
            <div
              key={idx}
              className={`group flex items-center gap-3 rounded-xl p-2.5 border transition-all ${containerClass}`}
            >
              {/* Minimal Rank Number */}
              <div className={`text-sm font-bold w-6 text-center shrink-0 ${rankColor}`}>
                {rank}
              </div>

              {/* Avatar */}
              <div className="shrink-0">
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover bg-gray-100"
                  />
                ) : (
                  <div
                    className="w-8 h-8 bg-gradient-to-br from-[#D94F04] to-[#FF7A33] 
                        rounded-full flex items-center justify-center 
                        text-xs font-medium text-white"
                  >
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-xs font-semibold text-[#2B2B2B] dark:text-[#EAEAEA] truncate">
                    {user.name}
                  </span>
                  {/* Only show points for Top 3 to reduce clutter, or make it subtle */}
                  <span className="text-[10px] font-medium text-[#8A877C] dark:text-[#666]">
                    {user.points} pts
                  </span>
                </div>

                {/* Micro Stats (Text only or very small icons) */}
                <div className="flex items-center gap-2.5 text-[9px] text-[#8A877C] dark:text-[#707070]">
                  <div className="flex items-center gap-1">
                    <Star size={8} className={`${isTop3 ? "text-orange-400 fill-orange-400" : "text-gray-400"}`} />
                    <span>{user.credibility.toFixed(1)}</span>
                  </div>
                  <div className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-1">
                    <span>{user.projects} Proj</span>
                  </div>
                  <div className="w-0.5 h-0.5 bg-gray-300 rounded-full" />
                  <div className="flex items-center gap-1">
                    <span>{user.connections} Conn</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Gradient Blur */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#FCFCF9] dark:from-[#1A1A1A] to-transparent pointer-events-none" />
    </div>
  );
}
