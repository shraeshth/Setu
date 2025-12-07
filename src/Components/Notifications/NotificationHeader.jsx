import React from "react";
import { CheckCheck } from "lucide-react"

export default function NotificationHeader({ onMarkAllRead, unreadCount }) {
  return (
    <div className="">
      <div className="flex flex-row items-center justify-between gap-4">
        {/* Title and Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#2B2B2B] dark:text-gray-100">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 bg-[#D94F04] dark:bg-[#E86C2E] text-white text-xs font-semibold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mark All Read Button */}
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm whitespace-nowrap
              ${unreadCount > 0
                ? "bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white hover:shadow-md"
                : "bg-gray-100 dark:bg-[#2B2B2B] text-gray-400 dark:text-gray-600 cursor-not-allowed"}
            `}
          >
            <CheckCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Mark all as read</span>
            <span className="sm:inline lg:hidden">Read all</span>
          </button>
        </div>
      </div>
    </div>
  );
}