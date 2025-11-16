import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectFeed() {
  const projects = [
    {
      title: "E-Commerce Dashboard",
      category: "Frontend • Web App",
      type: "Startup MVP",
      owner: "Ananya Mehta",
      credibility: "4.7",
      priority: "High",
      description:
        "A modern dashboard with real-time analytics, revenue monitoring, and admin controls for scalable commerce.",
      openRoles: ["Frontend Dev", "UI Designer"],
      requiredSkills: ["React", "TypeScript", "Tailwind"],
      applicants: 14,
      duration: "3–4 Weeks",
      updated: "2 days ago",
      status: "Open",
    },
    {
      title: "AI Resume Builder",
      category: "AI • SaaS",
      type: "Portfolio Project",
      owner: "Rishi Kumar",
      credibility: "4.5",
      priority: "Medium",
      description:
        "Build an AI-powered resume generator using profile analysis and scoring models.",
      openRoles: ["Backend Dev", "Designer", "Model Engineer"],
      requiredSkills: ["Next.js", "OpenAI API", "PostgreSQL"],
      applicants: 7,
      duration: "4–6 Weeks",
      updated: "5 hours ago",
      status: "Hiring",
    },
    {
      title: "Team Matching Engine",
      category: "Algorithms • Backend",
      type: "Platform Core System",
      owner: "Arjun Patel",
      credibility: "4.9",
      priority: "Critical",
      description:
        "A recommendation system that matches students based on skills, goals, and credibility scores.",
      openRoles: ["ML Engineer"],
      requiredSkills: ["Python", "ML", "Flask"],
      applicants: 22,
      duration: "5 Weeks",
      updated: "Today",
      status: "In Progress",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);

  /* ----- Dark Mode Watcher ----- */
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();

    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });

    return () => obs.disconnect();
  }, []);

  /* ----- Auto Slide Every 5 Seconds ----- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const nextCard = () =>
    setCurrentIndex((i) => (i + 1) % projects.length);

  const prevCard = () =>
    setCurrentIndex((i) => (i - 1 + projects.length) % projects.length);

  const current = projects[currentIndex];

  return (
    <div className="flex items-center justify-center px-0">
      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-200">
            Find Projects
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={prevCard}
              className="w-8 h-8 flex items-center justify-center rounded-full 
              hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
            >
              <ChevronLeft className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
            </button>

            <button
              onClick={nextCard}
              className="w-8 h-8 flex items-center justify-center rounded-full 
              hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
            >
              <ChevronRight className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
            </button>
          </div>
        </div>

        {/* CARD */}
        <div
          className="relative w-full h-[380px] rounded-xl 
          bg-[#FCFCF9] dark:bg-[#2B2B2B] 
          border border-[#E2E1DB] dark:border-[#3A3A3A]
          overflow-hidden"
        >

          {/* ORANGE TOP */}
          <div
            className="relative w-full min-h-[100px] 
            bg-gradient-to-br from-[#D94F04] to-[#E86C2E] py-4 px-6 rounded-xl"
          >
            <div className="pointer-events-none absolute inset-0 rounded-xl outline outline-1 outline-white/20"></div>

            <div className="flex justify-between items-start">
              <p className="text-white text-[11px] opacity-80 uppercase tracking-wide">
                {current.category}
              </p>

              <p className="text-white text-[11px] opacity-80 uppercase tracking-wide">
                {current.priority} Priority
              </p>
            </div>

            <p className="text-[12px] font-semibold text-white">{current.type}</p>
          </div>

          {/* INFO PANEL */}
          <div
            className="relative bg-[#FCFCF9] dark:bg-[#2B2B2B] 
            px-4 pt-4 pb-4 flex flex-col 
            -mt-6 rounded-xl 
            h-[calc(380px-100px)]"
          >

            {/* TITLE */}
            <h3 className="text-[#2B2B2B] dark:text-white text-base font-semibold leading-tight">
              {current.title}
            </h3>

            <p className="text-[11px] text-[#777] dark:text-gray-400 mb-1">
              {current.owner}
            </p>

            {/* DESCRIPTION */}
            <p
              className="text-[#555] dark:text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {current.description}
            </p>

            {/* ROLES + SKILLS */}
            <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">

              {/* ROLES */}
              <div>
                <p className="text-[#2B2B2B] dark:text-gray-200 text-[11px] mb-1 font-medium">
                  Open Roles
                </p>

                <div className="flex flex-col gap-1.5">
                  {current.openRoles.map((role) => (
                    <span
                      key={role}
                      className="relative px-2 py-1 text-[10px] 
                      text-[#2B2B2B] dark:text-gray-200
                      rounded-lg border border-[#E2E1DB]/40 dark:border-white/10
                      bg-white/40 dark:bg-white/5
                      backdrop-blur-sm overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/15 to-transparent dark:from-[#D94F04]/20 pointer-events-none"></span>
                      <span className="relative">{role}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* SKILLS ICONS */}
              <div>
                <p className="text-[#2B2B2B] dark:text-gray-200 text-[11px] mb-1 font-medium">
                  Skills
                </p>

                <div className="grid grid-cols-4 gap-2 justify-items-end">
                  {current.requiredSkills.map((skill) => (
                    <i
                      key={skill}
                      className={`
                        text-[#2B2B2B] dark:text-white 
                        text-[22px]
                        ${
                          {
                            React: "ri-reactjs-line",
                            TypeScript: "ri-code-s-slash-line",
                            Tailwind: "ri-windy-line",
                            "Next.js": "ri-box-3-line",
                            "OpenAI API": "ri-brain-line",
                            PostgreSQL: "ri-database-2-line",
                            Python: "ri-python-line",
                            ML: "ri-ai-generate",
                            Flask: "ri-flask-line",
                          }[skill] || "ri-flashlight-line"
                        }
                      `}
                    ></i>
                  ))}
                </div>
              </div>

            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-[6px] bg-[#E2E1DB]/30 dark:bg-white/10 rounded-full overflow-hidden mt-auto shrink-0">
              <div
                className="h-full bg-gradient-to-r from-[#D94F04] to-[#E86C2E]"
                style={{ width: "30%" }}
              ></div>
            </div>

            {/* FOOTER + JOIN BUTTON */}
            <div className="flex items-center justify-between pt-3">
              <p className="text-[#2B2B2B] dark:text-white text-sm font-medium">
                {current.duration}
                <br />
                <span className="opacity-80 text-xs font-thin">Duration</span>
              </p>

              <div className="text-right">
                <p className="text-[#2B2B2B] dark:text-white text-sm font-semibold">
                  {current.status}
                </p>
                <p className="text-[#8A877C] dark:text-gray-400 text-[10px]">
                  {current.applicants} applicants
                </p>
              </div>
            </div>

            {/* JOIN PROJECT */}
            <button
              className="
                mt-2 w-full text-center 
                bg-[#D94F04] hover:bg-[#bf4404]
                dark:bg-[#E86C2E] dark:hover:bg-[#D94F04]
                text-white text-xs font-medium 
                py-2 rounded-full transition
              "
            >
              Join The Project
            </button>

          </div>
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-1.5 mt-4">
          {projects.map((_, i) => (
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

      </div>
    </div>
  );
}