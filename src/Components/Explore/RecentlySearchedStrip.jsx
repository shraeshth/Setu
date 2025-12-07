import React from "react";
import { Clock, X } from "lucide-react";
import { useRecentSearches } from "../../Hooks/useRecentSearches";
import { useNavigate } from "react-router-dom";

export default function RecentlySearchedStrip() {
    const { recentSearches, removeSearch } = useRecentSearches();
    const navigate = useNavigate();

    if (recentSearches.length === 0) return null;

    return (
        <div className="w-full flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8A877C] dark:text-[#A0A0A0] uppercase tracking-wider whitespace-nowrap">
                <Clock className="w-3 h-3" />
                Recent
            </div>

            <div className="flex items-center gap-2">
                {recentSearches.map((term, idx) => (
                    <div
                        key={idx}
                        onClick={() => navigate(`/explore?q=${encodeURIComponent(term)}`)}
                        className="
              flex items-center gap-2 px-3 py-1.5 rounded-full
              bg-[#F0EFE9] dark:bg-[#252525] 
              border border-[#E2E1DB] dark:border-[#3A3A3A]
              text-xs font-medium text-[#2B2B2B] dark:text-[#EAEAEA]
              hover:border-[#D94F04] dark:hover:border-[#D94F04]
              transition-colors cursor-pointer group whitespace-nowrap
            "
                    >
                        <span>{term}</span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeSearch(term);
                            }}
                            className="p-0.5 rounded-full hover:bg-red-500 hover:text-white text-[#8A877C] dark:text-[#707070] transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
