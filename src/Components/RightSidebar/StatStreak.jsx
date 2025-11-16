import React from "react";
import { Flame, Target } from "lucide-react";

export default function StatStreak({ days = 4, goal = 7 }) {
  const totalDots = 20;
  const progressRatio = Math.min(days / goal, 1);
  const filledDots = Math.round(totalDots * progressRatio);
  const percentComplete = Math.round((days / goal) * 100);
  const daysRemaining = Math.max(goal - days, 0);

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
            {days >= goal && (
              <Target size={14} className="text-[#4CA772] dark:text-[#5FD89A]" />
            )}
            <Flame size={15} className={`${days >= goal ? 'text-[#4CA772] dark:text-[#5FD89A]' : 'text-[#D94F04]'}`} />
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
            <p className="text-xs">in a row</p>
          </div>
        </div>

        {/* Progress Info */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#2E7BE4] dark:text-[#5B9FFF]">{percentComplete}%</span>
            <span className="text-[#8A877C] dark:text-[#A0A0A0]">complete</span>
          </div>
        </div>

        {/* Dot Progress Grid */}
        <div className="grid grid-cols-10 gap-[6px]">
          {[...Array(totalDots)].map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 
                         ${i < filledDots 
                           ? "bg-[#D94F04] shadow-sm scale-100" 
                           : "bg-[#E2E1DB] dark:bg-[#3A3A3A] scale-95"
                         }
                         ${i === filledDots - 1 && filledDots < totalDots ? 'animate-pulse' : ''}
                         hover:scale-110 cursor-pointer`}
              title={`Day ${i + 1}`}
              role="presentation"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}