import React from "react";
import { Flame, Target } from "lucide-react"

export default function StatStreak({ days = 4 }) {
  const totalDots = 20;

  // Logic: We want to show the last 20 days.
  // The streak count ('days') represents the contiguous block of active days ending today.
  // So we fill the last 'days' number of dots.
  // If streak > totalDots, all dots are filled.
  const effectiveStreak = Math.min(days, totalDots);

  return (
    <div className="bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A] 
                    rounded-xl p-4 flex flex-col justify-between 
                    text-[#2B2B2B] dark:text-[#EAEAEA]
                    transition-colors duration-300 relative overflow-hidden">

      {/* Subtle gradient overlay for visual interest */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/5 to-transparent dark:from-[#D94F04]/10 pointer-events-none"></div>

      {/* Content - positioned relative to be above gradient */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold 
                        text-[#8A877C] dark:text-[#A0A0A0] 
                        tracking-wider uppercase">
            Streak
          </p>
          <div className="flex items-center gap-1">
            {days >= totalDots && (
              <Target size={14} className="text-[#4CA772] dark:text-[#5FD89A]" />
            )}
            <Flame size={15} className={`${days > 0 ? 'text-[#D94F04]' : 'text-[#8A877C]'}`} />
          </div>
        </div>

        {/* Main Value */}
        <div className="flex items-end justify-start gap-2 mb-3">
          <p className="text-5xl font-thin text-[#D94F04] leading-none">
            {days}
          </p>
          <div className="text-sm 
                          text-[#8A877C] dark:text-[#A0A0A0] 
                          leading-tight mb-1">
            <p className="font-medium">days</p>
            <p className="text-xs">current streak</p>
          </div>
        </div>

        {/* Progress Info - Optional, maybe show "Best Streak" or just keep it clean */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-[#8A877C] dark:text-[#A0A0A0]">Last 20 Days</span>
        </div>

        {/* Dot Progress Grid - 20 dots representing history */}
        <div className="grid grid-cols-10 gap-[6px]">
          {[...Array(totalDots)].map((_, i) => {
            // Fill from the end
            // Index 19 is today. Index 18 is yesterday.
            // We fill if i >= (20 - streak)
            const isFilled = i >= (totalDots - effectiveStreak);
            const isToday = i === totalDots - 1;

            return (
              <div
                key={i}
                className={`w-3.5 h-3.5 rounded-full transition-all duration-300 
                           ${isFilled
                    ? "bg-[#D94F04] shadow-sm scale-100"
                    : "bg-[#E2E1DB] dark:bg-[#3A3A3A] scale-95"
                  }
                           ${isToday && isFilled ? 'animate-pulse' : ''}
                           hover:scale-110 cursor-pointer relative group`}
                title={isToday ? "Today" : `Day -${totalDots - 1 - i}`}
              >
                {/* Tooltip for Today */}
                {isToday && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block 
                                    bg-black text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                    Today
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}