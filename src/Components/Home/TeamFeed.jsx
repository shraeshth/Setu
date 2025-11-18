import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TeamFeed() {
  const members = [
    {
      name: "Alice Johnson",
      role: "Frontend Developer",
      credibility: "Top 5% coder",
      projects: "12+",
      connections: "230+",
    },
    {
      name: "Rahul Singh",
      role: "Backend Engineer",
      credibility: "Scalable systems expert",
      projects: "9",
      connections: "310+",
    },
    {
      name: "Fatima Noor",
      role: "UI/UX Designer",
      credibility: "Worked with 20+ startups",
      projects: "35",
      connections: "500+",
    },
    {
      name: "Arjun Patel",
      role: "DevOps Lead",
      credibility: "CI/CD specialist",
      projects: "15",
      connections: "180+",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((i) => (i + 1) % members.length);
  const prev = () =>
    setCurrentIndex((i) => (i - 1 + members.length) % members.length);

  /* ---------------- AUTO SLIDE EVERY 5 SEC ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % members.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [members.length]);

  const current = members[currentIndex];

  return (
    <div className="w-full">

      {/* HEADER WITH ARROWS */}
      <div className="flex items-center justify-between mb-2 pr-1">
        <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-white">
          Find Your Team
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full 
            flex items-center justify-center 
            hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
          >
            <ChevronLeft className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
          </button>

          <button
            onClick={next}
            className="w-8 h-8 rounded-full 
            flex items-center justify-center 
            hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
          >
            <ChevronRight className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
          </button>
        </div>
      </div>

      {/* CARD */}
      <div
        className="
          relative w-full max-w-sm mx-auto 
          rounded-2xl bg-[#FCFCF9] dark:bg-[#2B2B2B] 
          border border-[#E2E1DB] dark:border-[#3A3A3A]
          p-5 h-[380px]
        "
      >
        <div className="flex flex-col h-full">

          {/* HEADER SECTION */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E1DB] dark:border-[#3A3A3A]">

            {/* LEFT */}
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-base text-[#1f1f1f] dark:text-white leading-tight truncate">
                {current.name}
              </h3>

              <button
                className="
                  mt-2 bg-[#D94F04] dark:bg-[#E86C2E]
                  hover:bg-[#bf4404] dark:hover:bg-[#D94F04]
                  text-white font-medium text-xs 
                  px-4 py-1.5 rounded-full transition w-fit
                "
              >
                Connect
              </button>
            </div>

            {/* RIGHT — AVATAR */}
            <div
              className="
                w-16 h-16 rounded-xl flex items-center justify-center
                text-white text-2xl font-light
                bg-gradient-to-br from-[#D94F04] to-[#E86C2E]
                flex-shrink-0
              "
            >
              {current.name.charAt(0)}
            </div>
          </div>

          {/* 2×2 STATS */}
          <div className="grid grid-cols-2 gap-3 mt-3">

            {/* CREDIBILITY */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/15 to-transparent dark:from-[#D94F04]/20" />
              <p className="text-[10px] text-[#8A877C]">Credibility</p>
              <p className="text-xl font-light text-[#D94F04] mt-1">
                {current.credibility}
              </p>
            </div>

            {/* PROJECTS */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E86C2E]/15 to-transparent dark:from-[#E86C2E]/20" />
              <p className="text-[10px] text-[#8A877C]">Projects</p>
              <p className="text-5xl font-light text-[#2B2B2B] dark:text-gray-200 mt-1">
                {current.projects}
              </p>
            </div>

            {/* CONNECTIONS */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/12 to-transparent dark:from-[#D94F04]/18" />
              <p className="text-[10px] text-[#8A877C]">Connections</p>
              <p className="text-3xl font-light text-[#2B2B2B] dark:text-gray-200 mt-1">
                {current.connections}
              </p>
            </div>

            {/* ROLE */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E86C2E]/15 to-transparent dark:from-[#E86C2E]/20" />
              <p className="text-[10px] text-[#8A877C]">Role</p>
              <p className="text-sm font-bold text-[#E36324] mt-1">
                {current.role}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-1.5 mt-4">
        {members.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === currentIndex
                ? "w-6 bg-[#2B2B2B] dark:bg-white"
                : "w-1.5 bg-[#E2E1DB] dark:bg-[#333]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
