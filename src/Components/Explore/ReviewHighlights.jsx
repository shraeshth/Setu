import React from "react";

export default function ReviewHighlights() {
  const highlights = [
    { type: "Highest Rated", icon: "🏆", title: "AI Resume Builder", rating: 4.9, count: 52, badge: "bg-yellow-500" },
    { type: "Most Reviewed", icon: "📊", title: "Task Management Pro", rating: 4.7, count: 127, badge: "bg-blue-500" },
    { type: "Editor’s Pick", icon: "✨", title: "Social Analytics Dashboard", rating: 4.8, count: 38, badge: "bg-purple-500" }
  ];

  return (
    <div className="h-full bg-neutral-900/50 backdrop-blur-xl rounded-xl border border-neutral-800 p-3 flex flex-col gap-2">

      <h3 className="text-sm font-semibold mb-1 text-neutral-100">Review Highlights</h3>

      <div className="flex flex-col gap-2 overflow-y-auto">
        {highlights.map((item, idx) => (
          <div
            key={idx}
            className="
              bg-neutral-950/40 rounded-lg border border-orange-500/10 
              p-2 hover:border-orange-400/30 transition-all cursor-pointer group
            "
          >
            <div className="flex items-center gap-2">

              {/* Small Icon */}
              <div className={`p-1.5 rounded-md text-lg ${item.badge}/20`}>
                {item.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-neutral-400 leading-tight">
                  {item.type}
                </div>

                <div className="text-sm font-medium truncate group-hover:text-orange-400">
                  {item.title}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-neutral-400">
                  <span className="text-yellow-500 font-medium">★ {item.rating}</span>
                  <span className="opacity-40">•</span>
                  <span>{item.count} reviews</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
