// components/Sidebar/NoticeBoard.jsx
import React from "react";

export default function NoticeBoard({ notices = [] }) {
  return (
    <>
      <div className="space-y-2 overflow-hidden mb-0">
        {notices.map((n) => (
          <div
            key={n.title}
            className="border-b border-[#E2E1DB] dark:border-[#3A3A3A] pb-1 last:border-b-0"
          >
            <h4
              className="font-medium cursor-pointer text-sm line-clamp-1 
              transition-colors duration-200 
              text-[#1E3E88] dark:text-[#5B9FFF] 
              hover:text-[#2E7BE4] dark:hover:text-[#7AB8FF]"
            >
              {n.title}
            </h4>
            <p className="text-xs font-medium text-[#2E7BE4] dark:text-[#5B9FFF]">
              {n.time} — {n.day}
            </p>
          </div>
        ))}
      </div>

      <div className="text-right mt-0">
        <button className="text-xs font-medium hover:underline text-[#2E7BE4] dark:text-[#5B9FFF]">
          Show more
        </button>
      </div>
    </>
  );
}
