import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TimeInvestedCard({
  completed = 0,
  total = 0,
  chartData = [],
  deadline = "No Deadline",
  avgTime = "0"
}) {
  const labels = ['Backlog', 'To Do', 'In Progress', 'Done'];
  const safeData = chartData.length === 4 ? chartData : [0, 0, 0, 0];

  // Muted, modern palette — keeps harmony across the card
  const palette = [
    '#9CA3AF', // backlog (gray)
    '#60A5FA', // todo (soft blue)
    '#F59E0B', // in-progress (amber)
    '#34D399'  // done (soft green)
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Tasks',
        data: safeData,
        backgroundColor: palette,
        borderRadius: 8,
        // keep a baseline thickness but allow options to cap it
        barThickness: 12,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        titleColor: '#fff',
        bodyColor: '#e6e6e6',
        padding: 8,
        displayColors: true,
        yAlign: 'center',
        titleFont: { size: 0 }, // remove title space
        bodyFont: { size: 12 },
        callbacks: {
          title: () => null,
          label: (ctx) => ` ${ctx.raw} task${ctx.raw === 1 ? '' : 's'}`
        }
      },
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { display: false },
        border: { display: false },
        beginAtZero: true,
        // optional safe-max so chart doesn't compress oddly on small values
        max: Math.max(...safeData, 5) + 2
      },
      y: {
        grid: { display: false, drawBorder: false },
        ticks: {
          color: '#6B7280',
          font: { size: 11, weight: '500' },
          padding: 6,
        },
        border: { display: false }
      },
    },
    // Bar sizing controls to avoid overflow and huge bars
    datasets: {
      bar: {
        maxBarThickness: 14,
        // these control how much of the category the bar uses
        categoryPercentage: 0.85,
        barPercentage: 0.9,
      }
    }
  };

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl bg-white dark:bg-[#0b0b0b] p-3 border border-[#E8E6E0] dark:border-[#222] h-auto flex flex-col gap-3">
      {/* Header (compact) */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-semibold uppercase text-[#8A877C] dark:text-gray-400 tracking-wider">
            Task Status
          </h4>
          <p className="mt-1 text-sm font-bold text-[#222] dark:text-[#F9F8F3]">
            {percentage}% <span className="text-xs font-medium text-gray-400 ml-2">complete</span>
          </p>
        </div>

        {/* compact badge */}
        <div className="flex items-center gap-2">
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'linear-gradient(90deg,#FDD7B0 0%, #FECF8C 100%)',
              color: '#422006'
            }}
          >
            {completed}/{total || 0}
          </div>
        </div>
      </div>

      {/* Chart row: left chart, right mini legend */}
      <div className="flex items-start gap-3">
        {/* Chart container must be allowed to shrink: min-w-0 */}
        <div className="flex-1 min-w-0 h-24">
          <Bar data={data} options={options} />
        </div>
      </div>

      {/* Footer: compact stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-dashed border-[#EDEBE7] dark:border-[#222]">
        <div className="truncate">
          <div className="text-[11px]">Deadline</div>
          <div className="text-sm font-semibold text-[#111827] dark:text-[#F9F8F3] truncate">{deadline}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px]">Avg. Pace</div>
          <div className="text-sm font-semibold text-[#111827] dark:text-[#F9F8F3]">{avgTime} / day</div>
        </div>
      </div>
    </div>
  );
}
