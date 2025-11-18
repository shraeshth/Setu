// ActivitySidebar.jsx
import React from "react";
import TeamStack from "./TeamStack";
import TimeInvestedCard from "./TimeInvestedCard";

export default function ActivitySidebar({
  progress = {},
  compact = false,
  team = [],
}) {
  // You declared a mock project but weren't using it correctly
  const mockProject = {
    id: "project-1",
    name: "AI Resume Builder",
    owner: "John Doe",
    members: [
      { id: "1", name: "John Doe", avatar: "" },
      { id: "2", name: "Jane Smith", avatar: "" },
      { id: "3", name: "Alice Johnson", avatar: "" },
      { id: "4", name: "Michael Chen", avatar: "" },
      { id: "5", name: "Sarah Park", avatar: "" }
    ]
  };

  // Decide whether to use parent team or mock fallback
  const finalTeam = team.length > 0 ? team : mockProject.members;

  return (
    <div className="flex flex-col h-full ">

      {/* Stats Section */}
      <div className="space-x-3 flex flex-row justify-between rounded-xl bg-white dark:bg-[#121212] p-4 border border-[#E2E1DB] dark:border-[#2B2B2B]">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          <div className="text-lg font-semibold">
            {progress.completed}/{progress.total}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">In progress</div>
          <div className="text-lg font-semibold">{progress.inProgress}</div>
        </div>

        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Backlog</div>
          <div className="text-lg font-semibold">{progress.backlog}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-4 mb-6 rounded-xl bg-white dark:bg-[#121212] p-4 border border-[#E2E1DB] dark:border-[#2B2B2B]">
        <div className="text-xs text-gray-500 dark:text-gray-400">Recent activity</div>

        <div className="mt-2 space-y-2 text-[13px]">
          <div className="flex items-center justify-between">
            <div>John moved a task</div>
            <div className="text-xs text-gray-400">2h</div>
          </div>

          <div className="flex items-center justify-between">
            <div>Jane created a task</div>
            <div className="text-xs text-gray-400">6h</div>
          </div>

          <div className="flex items-center justify-between">
            <div>Alice completed review</div>
            <div className="text-xs text-gray-400">1d</div>
          </div>
        </div>
      </div>
<TimeInvestedCard
  hours="34h"
  percentage={68}
  monthLabel="Total this month"
  projectDeadline="12 Dec 2025"
  activeProjects={3}
  avgDailyHours="2.1h"
/>
      {/* TEAM STACK */}
      <div className="mt-6 h-auto overflow-auto">

        <TeamStack members={finalTeam} />
      </div>

    </div>
  );
}
