import React, { useEffect, useRef } from "react";

export default function MiniFeed() {
  const posts = [
    {
      author: "Ananya Mehta",
      role: "UI Designer",
      content: "Finished the new onboarding flow — cleaner and easier.",
      time: "2h ago",
    },
    {
      author: "Rahul Singh",
      role: "Backend Engineer",
      content: "Optimized Firestore queries by 30 percent.",
      time: "5h ago",
    },
    {
      author: "Alice Johnson",
      role: "Frontend Dev",
      content: "Dark mode toggle shipped for all pages.",
      time: "8h ago",
    },
    {
      author: "Arjun Patel",
      role: "DevOps Lead",
      content: "CI/CD pipeline now runs in under 50 seconds.",
      time: "12h ago",
    },
  ];

  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollAmount = 0;
    let animationId;

    const scroll = () => {
      if (!container) return;

      scrollAmount += 0.3; // Slower speed
      container.scrollLeft = scrollAmount;

      // Reset when halfway through (since we duplicated content)
      const maxScroll = container.scrollWidth / 2;
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0;
        container.scrollLeft = 0;
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className="flex gap-5 overflow-x-scroll select-none pb-2 scrollbar-hide"
      style={{
        scrollBehavior: "auto",
      }}
    >

      {/* Duplicate posts for seamless infinite loop */}
      {[...posts, ...posts].map((p, i) => (
        <div
          key={i}
          className="
            flex-shrink-0 
            w-52
            bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A]
            px-3 py-2.5
            rounded-xl
            transition
          "
        >
          {/* Header Row */}
          <div className="flex items-center gap-2 mb-1.5">
            <div className="
              w-7 h-7 rounded-lg 
              bg-gradient-to-br from-[#D94F04] to-[#E86C2E]
              text-white text-xs font-semibold 
              flex items-center justify-center
              flex-shrink-0
            ">
              {p.author.charAt(0)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[#2B2B2B] dark:text-gray-100 truncate">
                {p.author}
              </p>
              <p className="text-[10px] text-[#8A877C] dark:text-gray-400 truncate">
                {p.role}
              </p>
            </div>
          </div>

          {/* Content */}
          <p className="text-[11px] text-[#3C3C3C] dark:text-gray-300 mb-1 line-clamp-2 leading-relaxed">
            {p.content}
          </p>

          {/* Timestamp */}
          <p className="text-[9px] text-[#8A877C] dark:text-gray-500">
            {p.time}
          </p>
        </div>
      ))}
    </div>
  );
}