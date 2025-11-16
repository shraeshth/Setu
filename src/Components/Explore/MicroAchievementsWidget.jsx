// components/Explore/MicroAchievementsWidget.jsx
import React from "react";
import { Sparkles, Eye, UserPlus, Users, Bookmark } from "lucide-react";

export default function MicroAchievementsWidget() {
  const items = [
    { icon: Eye, text: "You viewed 12 projects this week", time: "2h ago" },
    { icon: UserPlus, text: "3 people visited your profile", time: "5h ago" },
    { icon: Users, text: "Matched with 2 teams this week", time: "1d ago" },
  ];

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
