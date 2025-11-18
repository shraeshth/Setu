import React, { useState } from "react";
import TaskColumn from "./TaskColumn";

const columns = [
  { key: "backlog", title: "Backlog" },
  { key: "in-progress", title: "To Do" },
  { key: "review", title: "Review" },
  { key: "completed", title: "Completed" },
];

export default function KanbanBoard({
  tasks = [],
  onTaskClick = () => {},
  onTaskMove = () => {},
  onNewTask = () => {},
}) {
  const [open, setOpen] = useState("backlog"); // default open section

  const grouped = columns.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {});

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {columns.map((col) => {
        const isOpen = open === col.key;

        return (
          <div
            key={col.key}
            className="bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A] rounded-xl overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setOpen(isOpen ? null : col.key)}
              className="w-full flex justify-between items-center px-4 py-3 text-left"
            >
              <h3 className="font-semibold text-sm text-[#2B2B2B] dark:text-[#F9F8F3]">
                {col.title}
              </h3>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {grouped[col.key]?.length || 0} tasks
              </span>
            </button>

            {/* Content */}
            {isOpen && (
              <div className="px-4 pb-4">
                {/* Horizontal scroll container */}
                <div className="overflow-x-auto whitespace-nowrap flex gap-3 pb-2">
                  {grouped[col.key].map((task) => (
                    <div
                      key={task.id}
                      className="inline-block"
                    >
                      <TaskColumn
                        title=""
                        tasks={[task]}
                        onTaskClick={onTaskClick}
                        onMove={(taskId) => onTaskMove(taskId, col.key)}
                        onNew={() => onNewTask(col.key)}
                        isCardOnly
                      />
                    </div>
                  ))}

                  {/* New task button */}
                  <button
                    className="
                      inline-flex items-center justify-center 
                      w-32 h-20 rounded-lg border border-dashed 
                      border-gray-400 dark:border-gray-600 
                      text-gray-500 dark:text-gray-400 text-sm
                    "
                    onClick={() => onNewTask(col.key)}
                  >
                    + Add Task
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
