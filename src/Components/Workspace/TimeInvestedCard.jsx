import React from "react";

export default function TimeInvestedCard({
  hours = "0h",
  percentage = 0,
  monthLabel = "Total this month",
  projectDeadline = "No deadline set",
  activeProjects = 0,
  avgDailyHours = "0h",
}) {
  return (
    <div className="rounded-xl bg-white dark:bg-[#121212] p-4 border border-[#E2E1DB] dark:border-[#2B2B2B] h-auto">
      <h4 className="font-semibold text-sm mb-2 text-[#2B2B2B] dark:text-[#F9F8F3]">
        Time Invested
      </h4>

      <div className="flex items-center gap-4">
        {/* Left side numbers */}
        <div className="flex-1">
          <p className="text-2xl font-bold text-[#2B2B2B] dark:text-[#F9F8F3]">
            {hours}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {monthLabel}
          </p>
        </div>

        {/* Circular percentage */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#D94F04] to-[#E86C2E] flex items-center justify-center text-white font-semibold">
          {percentage}%
        </div>
      </div>

      {/* Additional details */}
      <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <span className="font-semibold text-[#2B2B2B] dark:text-[#F9F8F3]">
            Project Deadline:
          </span>{" "}
          {projectDeadline}
        </p>


        <p>
          <span className="font-semibold text-[#2B2B2B] dark:text-[#F9F8F3]">
            Avg Daily Hours:
          </span>{" "}
          {avgDailyHours}
        </p>
      </div>
    </div>
  );
}
