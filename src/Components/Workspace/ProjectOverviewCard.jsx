import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ProjectOverviewCard({
  title = "Project Overview",
  description = "",
  author = "Unknown",
  lastUpdated = "",
  categories = [],
}) {

  const chartData = {
    labels: categories.map(c => c.name),
    datasets: [
      {
        data: categories.map(c => c.count),
        backgroundColor: categories.map(c => c.color || '#555'),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1F2937',
        padding: 10,
        bodyFont: { size: 12 },
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} tasks`
        }
      }
    },
  };

  return (
    <div className="rounded-xl bg-[#FCFCF9] dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-[#333] p-6 h-full flex flex-col sm:flex-row gap-6 items-center shadow-sm">

      {/* LEFT: Info & Legends */}
      <div className="flex-1 w-full flex flex-col justify-between h-full">
        <div>
          <h2 className="text-2xl font-bold text-[#2B2B2B] dark:text-[#F9F8F3] leading-tight mb-1">
            {title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span className="font-medium">By {author}</span>
            {lastUpdated && <><span>•</span><span>{lastUpdated}</span></>}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 number-lg mb-4">
            {description}
          </p>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {categories.map((cat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></span>
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                {cat.name} ({cat.count})
              </span>
            </div>
          ))}
          {categories.length === 0 && (
            <span className="text-xs text-gray-400">No tasks categorized yet</span>
          )}
        </div>
      </div>

      {/* RIGHT: Chart */}
      <div className="w-40 h-40 shrink-0 relative flex items-center justify-center">
        {categories.length > 0 ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#2B2B2B] dark:text-[#F9F8F3]">
                {categories.reduce((acc, c) => acc + c.count, 0)}
              </span>
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                Tasks
              </span>
            </div>
          </>
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-gray-200 dark:border-gray-800 border-dashed flex items-center justify-center text-xs text-gray-400">
            No Data
          </div>
        )}
      </div>
    </div>
  );
}
