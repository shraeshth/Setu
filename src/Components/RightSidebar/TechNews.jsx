import React from "react";
import useHackerNews from "../../Hooks/useHackerNews";
import { ArrowUpFromDot } from "lucide-react";

export default function TechNews() {
  const { items, loading, error } = useHackerNews({ feed: "top", count: 3 });

  // Helper: format "time ago"
  const getTimeAgo = (unixTime) => {
    const diffInSec = Math.floor(Date.now() / 1000 - unixTime);
    const hours = Math.floor(diffInSec / 3600);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="p-0">
      {/* ===== News List ===== */}
      {loading && (
        <p className="text-xs text-[#8A877C] dark:text-[#A0A0A0]">
          Loading latest stories...
        </p>
      )}
      {error && (
        <p className="text-xs text-red-400 dark:text-red-500">
          Error fetching news.
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="space-y-2 overflow-hidden mb-0">
            {items.map((n) => {
              const host = n.url
                ? new URL(n.url).hostname.replace("www.", "")
                : "news.ycombinator.com";
              const timeAgo = getTimeAgo(n.time);
              return (
                <div
                  key={n.id}
                  className="border-b border-[#E2E1DB] dark:border-[#3A3A3A] 
                             pb-1 last:border-b-0"
                >
                  <a
                    href={n.url || `https://news.ycombinator.com/item?id=${n.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h4 className="font-medium cursor-pointer text-sm line-clamp-1 
                                   text-[#722c09] dark:text-[#F9F8F3] 
                                   hover:text-[#D94F04] dark:hover:text-[#FFA666]
                                   transition-colors duration-200">
                      {n.title}
                    </h4>
                  </a>

                  {/* ===== Metadata Line ===== */}
                  <p className="text-[11px] 
                                text-[#8A877C] dark:text-[#A0A0A0] 
                                mt-[1px] flex items-center gap-1">
                    {/* Buzz Score with Lucide icon */}
                    <span className="flex items-center gap-0.5 
                                     text-[#D94F04] font-medium">
                      <ArrowUpFromDot size={12} strokeWidth={2} />
                      {n.score ?? 0}
                    </span>
                    <span className="text-[#8A877C] dark:text-[#707070]">·</span>
                    {/* Author */}
                    {n.by && (
                      <>
                        <span className="text-[#3C3C3C] dark:text-[#D0D0D0] 
                                       font-medium">
                          {n.by}
                        </span>
                        <span className="text-[#8A877C] dark:text-[#707070]">·</span>
                      </>
                    )}
                    {/* Time */}
                    <span>{timeAgo}</span>
                    <span className="text-[#8A877C] dark:text-[#707070]">·</span>
                    {/* Host */}
                    <span className="text-[#D94F04]">{host}</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* ===== Show More Link ===== */}
          <div className="text-right mt-0">
            <a
              href="https://news.ycombinator.com/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium hover:underline text-[#D94F04]"
            >
              Show more
            </a>
          </div>
        </>
      )}
    </div>
  );
}