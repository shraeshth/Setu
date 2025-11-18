// components/Explore/ConnectionsListWidget.jsx
import React from "react";
import { User, UserCheck, Users } from "lucide-react";

export default function ConnectionsListWidget() {
  const connections = [
    { icon: User, name: "Riya Sharma", status: "Recently connected", time: "1h ago" },
    { icon: UserCheck, name: "Aditya Verma", status: "Accepted your request", time: "3h ago" },
    { icon: Users, name: "Team Phoenix", status: "You collaborated last week", time: "2d ago" },
  ];

  return (
    <div className="h-full flex flex-col">

      {/* Items */}
      <div className="space-y-2 overflow-y-auto pr-1">
        {connections.map((c, i) => (
          <div
            key={i}
            className="
              flex items-start gap-2
              EducationDisplay.jsx
              pb-1 last:border-b-0
              transition-all cursor-pointer
            "
          >
            <c.icon className="w-4 h-4 text-[#D94F04]" />

            <div className="flex-1">
              <p className="text-xs text-[#3C3C3C] dark:text-gray-300 leading-tight font-medium">
                {c.name}
              </p>

              <p className="text-[11px] text-[#6A6A6A] dark:text-gray-400 leading-tight">
                {c.status}
              </p>

              <span className="text-[10px] text-[#8A877C] dark:text-gray-500">
                {c.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
