import React, { useState, useRef, useEffect } from "react";
import TaskColumn from "./TaskColumn";

const columns = [
  { key: "backlog", title: "Backlog" },
  { key: "todo", title: "To Do" },
  { key: "review", title: "Review" },
  { key: "completed", title: "Completed" },
];

function KanbanSection({ col, tasks = [], openKey, setOpenKey, onTaskClick, onTaskMove, onNewTask }) {
  const isOpen = openKey === col.key;
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2); // 2px buffer
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkScroll();
      // Slight delay to allow render and layout to settle
      setTimeout(checkScroll, 100);
    }
  }, [tasks, isOpen]);

  return (
    <div
      className="bg-[#FCFCF9] dark:bg-[#2B2B2B] 
      border border-[#E2E1DB] dark:border-[#3A3A3A] 
      rounded-xl overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setOpenKey(isOpen ? null : col.key)}
        className="w-full flex justify-between items-center px-4 py-3 text-left"
      >
        <h3 className="font-semibold text-sm text-[#2B2B2B] dark:text-[#F9F8F3]">
          {col.title}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {tasks.length} tasks
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="relative px-4 pb-4 group">
          {/* Left Gradient */}
          <div
            className={`absolute left-0 top-0 bottom-4 w-12 bg-gradient-to-r from-[#FCFCF9] dark:from-[#2B2B2B] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Right Gradient */}
          <div
            className={`absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#FCFCF9] dark:from-[#2B2B2B] to-transparent z-10 pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`}
          />

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="overflow-x-auto whitespace-nowrap flex gap-3 pb-2 scrollbar-hide"
          >
            {tasks.map((task) => (
              <div key={task.id} className="inline-block align-top">
                <TaskColumn
                  title=""
                  section={col.key}
                  tasks={[task]}
                  onTaskClick={onTaskClick}
                  onMove={(taskId, newStatus) => onTaskMove(taskId, newStatus)}
                  onNew={() => onNewTask(col.key)}
                  isCardOnly
                />
              </div>
            ))}

            <button
              className="
                inline-flex items-center justify-center 
                w-24 h-24 rounded-lg border border-dashed 
                border-gray-400 dark:border-gray-600 
                text-gray-500 dark:text-gray-400 text-sm
                flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/5 transition
              "
              onClick={() => onNewTask(col.key)}
            >
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KanbanBoard({
  tasks = [],
  onTaskClick = () => { },
  onTaskMove = () => { },
  onNewTask = () => { },
}) {
  const [openKey, setOpenKey] = useState("backlog");

  const grouped = columns.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key || t.status === col.title); // Normalize status check
    return acc;
  }, {});

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {columns.map((col) => (
        <KanbanSection
          key={col.key}
          col={col}
          tasks={grouped[col.key] || []}
          openKey={openKey}
          setOpenKey={setOpenKey}
          onTaskClick={onTaskClick}
          onTaskMove={onTaskMove}
          onNewTask={onNewTask}
        />
      ))}
    </div>
  );
}
