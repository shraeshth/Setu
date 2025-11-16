// components/Explore/PairMeWithATeamButton.jsx
import React, { useState } from "react";
import { Users } from "lucide-react";

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
        h-full rounded-2xl border border-orange-500/30 
        bg-gradient-to-br from-orange-600/20 to-orange-700/20 
        backdrop-blur-xl p-6 flex flex-col justify-center items-center 
        hover:scale-[1.02] transition-all duration-300 cursor-pointer 
        group relative overflow-hidden
      "
    >
      {/* Subtle animated wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600/0 via-orange-500/10 to-orange-600/0 animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="p-3 bg-orange-600/30 rounded-xl group-hover:scale-110 transition-transform">
          <Users className="w-8 h-8 text-orange-400" />
        </div>

        <h3 className="text-2xl font-bold text-white">Pair Me With A Team</h3>
        <p className="text-sm text-neutral-400">AI-powered matching in 30 seconds</p>

        {isLoading && (
          <div className="flex gap-1 mt-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
