import React from "react";
import { Clock, X } from "lucide-react";
import { useRecentSearches } from "../../Hooks/useRecentSearches";
import { useNavigate } from "react-router-dom";

export default function RecentlySearchedStrip() {
    const { recentSearches, removeSearch } = useRecentSearches();
    const navigate = useNavigate();

    return (
        <div className="w-full flex items-center justify-between py-4 px-1">
            {/* LEFT: Title */}
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-[#2B2B2B] dark:text-white tracking-tight leading-none">
                    Explore
                </h1>
                <p className="text-[10px] text-[#8A877C] dark:text-[#A0A0A0] font-medium mt-1">
                    Discover projects, teams, and talent.
                </p>
            </div>

            {/* RIGHT: Recent Searches */}
            {recentSearches.length > 0 && (
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide max-w-[65%] justify-end pl-4">
                    <span className="text-[9px] font-bold text-[#8A877C] dark:text-[#707070] uppercase tracking-widest shrink-0 flex items-center gap-1">
                        <Clock size={10} strokeWidth={2.5} /> Recents
                    </span>

                    <div className="flex items-center gap-2">
                        {recentSearches.map((term, idx) => (
                            <div
                                key={idx}
                                onClick={() => navigate(`/explore?q=${encodeURIComponent(term)}`)}
                                className="
                                    flex items-center gap-2 px-3 py-1.5 rounded-full
                                    bg-white dark:bg-[#1A1A1A] 
                                    border border-[#E2E1DB] dark:border-[#333]
                                    text-[11px] font-medium text-[#2B2B2B] dark:text-[#EAEAEA]
                                    hover:border-[#D94F04] dark:hover:border-[#D94F04]
                                    hover:text-[#D94F04]
                                    transition-all cursor-pointer group shadow-sm whitespace-nowrap
                                "
                            >
                                <span>{term}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSearch(term);
                                    }}
                                    className="p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-[#8A877C] hover:text-red-500 transition-colors"
                                >
                                    <X className="w-2.5 h-2.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
