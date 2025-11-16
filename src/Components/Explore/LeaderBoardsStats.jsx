// components/Explore/Leaderboard.jsx
import React from "react";

export default function Leaderboard({ topUsers = [] }) {
  return (
    <div className="flex flex-col justify-center gap-2 h-auto">

      <div className="text-xs font-bold text-neutral-400 mb-1">
        TOP COLLABORATORS
      </div>

      {topUsers.map((user, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 
          bg-neutral-950/50 rounded-lg p-2 
          border border-neutral-800"
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 
            rounded-full flex items-center justify-center 
            text-xs font-bold text-white"
          >
            {user.name.charAt(0)}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="text-xs font-medium text-neutral-200">
              {user.name}
            </div>

            {/* Credibility Bar */}
            <div className="w-full bg-neutral-800 rounded-full h-1.5 mt-1">
              <div
                className="h-1.5 rounded-full 
                bg-gradient-to-r from-orange-500 to-orange-600"
                style={{ width: `${user.credibility}%` }}
              ></div>
            </div>
          </div>

          {/* Points */}
          <div className="text-xs text-orange-400 font-bold">
            {user.points}
          </div>
        </div>
      ))}

    </div>
  );
}
