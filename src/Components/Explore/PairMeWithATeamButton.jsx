// components/Explore/PairMeWithATeamButton.jsx
import React, { useState } from "react";
import { Users } from "lucide-react"

export default function PairMeWithATeamButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div
      onClick={handleClick}
      className="
        h-full rounded-2xl border border-[#D94F04]/30 
        bg-gradient-to-br from-[#D94F04]/10 to-[#D94F04]/5 
        dark:from-[#D94F04]/20 dark:to-[#D94F04]/10
        p-6 flex flex-col justify-center items-center 
        hover:scale-[1.02] transition-all duration-300 cursor-pointer 
        group relative overflow-hidden
      "
    >
      {/* Subtle animated wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#D94F04]/0 via-[#D94F04]/10 to-[#D94F04]/0 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center">
        <div className="p-4 bg-[#D94F04]/20 rounded-2xl group-hover:scale-110 transition-transform">
          <Users className="w-10 h-10 text-[#D94F04]" />
        </div>

        <h3 className="text-2xl font-bold text-[#2B2B2B] dark:text-[#EAEAEA]">Pair Me With A Team</h3>
        <p className="text-sm text-[#8A877C] dark:text-[#A0A0A0]">AI-powered matching in 30 seconds</p>

        {isLoading && (
          <div className="flex gap-1 mt-2">
            <div className="w-2 h-2 bg-[#D94F04] rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-[#D94F04] rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[#D94F04] rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
