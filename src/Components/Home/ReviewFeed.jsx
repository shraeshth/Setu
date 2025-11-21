import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Github,
  ExternalLink,
  MessageSquare,
} from "lucide-react/dist/lucide-react";

export default function ReviewFeed() {
  const reviews = [
    {
      project: "AI Chatbot for Productivity",
      author: "Ananya Mehta",
      role: "Frontend Dev",
      credibility: 4.8,
      totalReviews: 31,
      summary: "Fast responses, clean UI, excellent onboarding flow.",
      positives: ["UI/UX", "Response Time", "Documentation"],
      negatives: ["Limited customization"],
      links: { repo: "#", demo: "#", discussions: "#" },
      score: 85,
      updated: "2 days ago",
    },
    {
      project: "Freelancer Portfolio CMS",
      author: "John Smith",
      role: "Backend Engineer",
      credibility: 4.6,
      totalReviews: 22,
      summary: "Robust API, smooth workflows, slightly outdated design.",
      positives: ["API Stability", "Team Communication"],
      negatives: ["UI styling"],
      links: { repo: "#", demo: "#", discussions: "#" },
      score: 78,
      updated: "1 week ago",
    },
    {
      project: "E-Learning Dashboard",
      author: "Rahul Singh",
      role: "Fullstack Dev",
      credibility: 4.9,
      totalReviews: 37,
      summary: "Excellent dashboards, scalable structure, great mentorship.",
      positives: ["Scalability", "Dashboards", "Architecture"],
      negatives: [],
      links: { repo: "#", demo: "#", discussions: "#" },
      score: 92,
      updated: "Today",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % reviews.length);
  const prev = () =>
    setCurrentIndex((i) => (i - 1 + reviews.length) % reviews.length);

  const current = reviews[currentIndex];

  /* ---------------- AUTO SLIDE EVERY 5 SECONDS ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);
  /* ------------------------------------------------------------ */

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 pr-2">
        <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-200">
          Review Projects
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full flex items-center justify-center 
            hover:bg-[#F5F4F0] dark:hover:bg-[#333] transition"
          >
            <ChevronLeft className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
          </button>

          <button
            onClick={next}
            className="w-8 h-8 rounded-full flex items-center justify-center 
            hover:bg-[#F5F4F0] dark:hover:bg-[#333] transition"
          >
            <ChevronRight className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
          </button>
        </div>
      </div>

      {/* CARD */}
      <div
        className="
        relative w-64 h-[380px] 
        bg-[#FCFCF9] dark:bg-[#2B2B2B] 
        border border-[#E2E1DB] dark:border-[#3A3A3A]
        rounded-xl p-5 flex flex-col
      "
      >
        {/* TITLE */}
        <h3 className="text-base font-semibold text-[#2B2B2B] dark:text-white leading-tight">
          {current.project}
        </h3>

        {/* AUTHOR */}
        <p className="text-[11px] text-[#7d7b73] dark:text-gray-400 mb-2">
          Reviewed by {current.author} • {current.role}
        </p>

        {/* RATING */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-4xl font-light text-[#D94F04] dark:text-[#E86C2E] leading-none">
            {current.credibility}
          </span>
          <Star className="w-4 h-4 text-[#D94F04] dark:text-[#E86C2E] fill-current" />
        </div>

        {/* SUMMARY */}
        <p
          className="text-[#3C3C3C] dark:text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {current.summary}
        </p>

        {/* POSITIVES & NEGATIVES */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* POSITIVES */}
          <div>
            <p className="text-[10px] text-[#2B2B2B] dark:text-gray-200 mb-1 font-medium">
              Positives
            </p>
            {current.positives.map((p) => (
              <span
                key={p}
                className="
                  block text-[10px] 
                  text-[#2B2B2B] dark:text-gray-200
                  bg-white/60 dark:bg-white/10
                  border border-[#E2E1DB]/60 dark:border-white/10
                  backdrop-blur-sm px-2 py-1 rounded mb-1
                "
              >
                {p}
              </span>
            ))}
          </div>

          {/* NEGATIVES */}
          <div>
            <p className="text-[10px] text-[#2B2B2B] dark:text-gray-200 mb-1 font-medium">
              Negatives
            </p>
            {current.negatives.length ? (
              current.negatives.map((n) => (
                <span
                  key={n}
                  className="
                    block text-[10px] 
                    text-[#2B2B2B] dark:text-gray-200
                    bg-white/60 dark:bg-white/10
                    border border-[#E2E1DB]/60 dark:border-white/10
                    backdrop-blur-sm px-2 py-1 rounded mb-1
                  "
                >
                  {n}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-gray-500 dark:text-gray-500">
                None
              </span>
            )}
          </div>
        </div>

        {/* SCORE BAR */}
        <div className="w-full h-1.5 bg-[#E2E1DB]/50 dark:bg-white/10 rounded-full overflow-hidden mt-auto mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#D94F04] to-[#E86C2E]"
            style={{ width: `${current.score}%` }}
          ></div>
        </div>

        {/* FOOTER LINKS */}
        <div className="flex items-center justify-between text-[11px]">
          <a
            href={current.links.repo}
            className="flex items-center gap-1 text-[#2B2B2B] dark:text-gray-300 hover:text-black dark:hover:text-white transition"
          >
            <Github size={14} /> Repo
          </a>

          <a
            href={current.links.demo}
            className="flex items-center gap-1 text-[#2B2B2B] dark:text-gray-300 hover:text-black dark:hover:text-white transition"
          >
            <ExternalLink size={14} /> Demo
          </a>

          <a
            href={current.links.discussions}
            className="flex items-center gap-1 text-[#2B2B2B] dark:text-gray-300 hover:text-black dark:hover:text-white transition"
          >
            <MessageSquare size={14} /> Reviews
          </a>
        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-1.5 mt-4">
        {reviews.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex
                ? "w-6 bg-[#2B2B2B] dark:bg-white"
                : "w-1.5 bg-[#E2E1DB] dark:bg-[#333]"
            }`}
          ></div>
        ))}
      </div>
    </>
  );
}
