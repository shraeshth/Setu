import React from "react";
import TaskCard from "./TaskCard";

export default function TaskColumn({
  title,
  section,                // NEW: pass the column key
  tasks = [],
  onTaskClick,
  onDone,
  onDelete,
  onRate,
  onNew,
}) {
  return (
    <div className="flex-1 bg-white dark:bg-[#0f0f0f] border border-[#E2E1DB] dark:border-[#2B2B2B] rounded-xl p-3 flex flex-col">
      {/* Task List */}
      <div className="flex-1 space-y-3 overflow-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">No tasks</div>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              section={section}               // NEW
              onClick={() => onTaskClick(t)}
              onDone={() => onDone(t.id)}     // NEW
              onDelete={() => onDelete(t.id)} // NEW
              onRate={(id, value) => onRate(id, value)} // NEW
            />
          ))
        )}
      </div>
    </div>
  );
}
