import React from "react";

export default function ProjectOverviewCard({
  title = "Project Overview",
  description = "",
  progress = { completed: 0, total: 0 },
  categories = [], // [{ name: "Design", count: 12, color: "#E94A4A" }, ...]
}) {
  const progressPercent =
    (progress.completed / Math.max(progress.total, 1)) * 100;

  // Find scaling baseline
  const maxCount = Math.max(...categories.map((c) => c.count), 1);

  return (
    <div className="rounded-xl bg-white dark:bg-[#121212] p-4 border border-[#E2E1DB] dark:border-[#2B2B2B] h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h4 className="font-thin text-2xl text-[#2B2B2B] dark:text-[#F9F8F3]">
          Project Overview
        </h4>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      )}

      {/* Bubble Chart */}
      <div className="flex-1 flex items-center justify-center mt-4">
        <div className="relative w-full h-auto flex flex-wrap justify-center items-center gap-3">
          {categories.map((cat, i) => {
            const size = 40 + (cat.count / maxCount) * 80; // 40–120px range

            return (
              <div
                key={i}
                className="rounded-full flex items-center justify-center text-[10px] font-medium text-white shadow-sm"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: cat.color || "#555",
                }}
                title={`${cat.name}: ${cat.count} tasks`}
              >
                <span className="text-center px-1">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
