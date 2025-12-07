import React from "react";
import { TrendingUp } from "lucide-react"
import { Tooltip } from "react-tooltip/dist/react-tooltip";

export default function StatCredibility({
  score = 4.7,
  increase = 0.32,
  avg = 4.3,
}) {
  // Each part represents a category's weight toward the total score
  const breakdown = [
    { label: "Communication", value: 25 },
    { label: "Teamwork", value: 20 },
    { label: "Delivery", value: 30 },
    { label: "Initiative", value: 15 },
    { label: "Consistency", value: 10 },
  ];

  const colors = [
    "#FFFFFF",  // pure white (start)
    "#FBEAE0",  // very light accent tint
    "#F4BDA3",  // pale orange tint
    "#EB7A40",  // medium orange tone
    "#D94F04",  // Setu brand accent (strong end)
  ];

  const darkColors = [
    "#FDF4EE",  // very soft warm white highlight (glow edge)
    "#FAD6C3",  // gentle peach tint (feather glow)
    "#F4A774",  // warm orange highlight
    "#E86C2E",  // bright accent orange
    "#D94F04",  // Setu brand accent (anchor)
  ];



  return (
    <div className="relative bg-[#FCFCF9] dark:bg-[#2B2B2B]
                border border-[#E2E1DB] dark:border-[#3A3A3A]
                rounded-xl p-4 flex flex-col justify-between
                text-[#2B2B2B] dark:text-[#EAEAEA]
                overflow-hidden transition-colors duration-300">

      {/* GLASS GRADIENT OVERLAY */}
      <div className="absolute inset-0 pointer-events-none 
                  bg-gradient-to-br from-[#D94F04]/5 to-transparent dark:from-[#D94F04]/10
                  rounded-xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">

        <p className="text-xs font-medium 
                      text-[#8A877C] dark:text-[#A0A0A0] 
                      tracking-wide">
          CREDIBILITY
        </p>
        <TrendingUp size={14} className="text-[#D94F04]" />
      </div>

      {/* Main Score */}
      <div className="mb-3">
        <div className="flex items-end gap-2">
          {/* Main credibility score */}
          <p className="text-5xl font-thin text-[#D94F04] leading-none">
            {score.toFixed(1)}
          </p>

          {/* Increase info */}
          <div className="text-sm leading-tight mb-1">
            <p className="text-[#2E7BE4] dark:text-[#5B9FFF] font-medium">
              +{increase.toFixed(2)}
            </p>
            <p className="text-[#8A877C] dark:text-[#f9f8f3]">this week</p>
          </div>
        </div>
      </div>

      {/* Segmented Bar */}
      <div className="relative w-full h-5 rounded-full overflow-hidden flex mb-3 
                      border border-[#E2E1DB] dark:border-[#3A3A3A]">
        {breakdown.map((part, i) => (
          <div
            key={part.label}
            data-tooltip-id={`tooltip-${i}`}
            data-tooltip-content={`${part.label}: ${part.value}%`}
            style={{
              width: `${part.value}%`,
              backgroundColor: colors[i],
            }}
            className="h-full cursor-pointer transition-transform hover:scale-y-105 
                       dark:[background:var(--dark-color)]"
            // Using CSS variable for dark mode color
            {...(typeof window !== 'undefined' &&
              document.documentElement.classList.contains('dark') && {
              style: {
                width: `${part.value}%`,
                backgroundColor: darkColors[i],
              }
            })}
          ></div>
        ))}
      </div>

      {/* Tooltip elements (one per section) */}
      {breakdown.map((_, i) => (
        <Tooltip
          key={i}
          id={`tooltip-${i}`}
          place="top"
          style={{
            backgroundColor: "#2B2B2B",
            color: "#FCFCF9",
            fontSize: "0.75rem",
            borderRadius: "6px",
            padding: "4px 8px",
          }}
        />
      ))}

      {/* Bar Labels */}
      <div className="flex justify-between text-xs 
                      text-[#8A877C] dark:text-[#A0A0A0]">
        <span>Avg: {avg.toFixed(1)}</span>
      </div>
    </div>
  );
}