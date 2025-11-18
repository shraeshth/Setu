import React from "react";
import { Gauge, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function PerformanceBreakdown({ title, score, change }) {
  const isPositive = change >= 0;

  return (
    <div
      className="
        w-full aspect-square
        p-4 rounded-xl 
        bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A]
        flex flex-col justify-between
      "
    >
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-[#2B2B2B] dark:text-[#F9F8F3]">
          {title || "Performance"}
        </p>
        <Gauge className="w-5 h-5 text-[#D94F04]" />
      </div>

      {/* Score */}
      <div className="flex flex-col items-start mt-2">
        <p className="text-3xl font-bold text-[#2B2B2B] dark:text-[#F9F8F3]">
          {score ?? 82}
        </p>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Overall Score
        </span>
      </div>

      {/* Change Indicator */}
      <div className="flex items-center gap-1 text-xs mt-4">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        )}
        <p className={`font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? "+" : ""}{change ?? 4.2}%
        </p>
        <span className="text-gray-500 dark:text-gray-400">vs last month</span>
      </div>

    </div>
  );
}
