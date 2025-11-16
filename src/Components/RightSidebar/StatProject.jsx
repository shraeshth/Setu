import React from "react";
import { useNavigate } from "react-router-dom";
import { Folder } from "lucide-react";

export default function StatProject({
  count = 8,
  completed = 3,
  active = 4,
  pending = 1,
  projects = [
    { id: 1, name: "UI Overhaul for Setu", status: "active" },
    { id: 2, name: "Backend Revamp", status: "pending" },
    { id: 3, name: "AI Resume Builder", status: "completed" },
    { id: 4, name: "Internship Portal", status: "active" },
    { id: 5, name: "Team Matching System", status: "completed" },
  ],
}) {
  const navigate = useNavigate();

  const getDotColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-[#5A8FD6] dark:bg-[#6BA3FF]";
      case "active":
        return "bg-[#4CA772] dark:bg-[#5FD89A]";
      case "pending":
        return "bg-[#D94F04]";
      default:
        return "bg-[#8A877C] dark:bg-[#A0A0A0]";
    }
  };

  return (
    <div className="bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A] 
                    rounded-xl px-4 py-3 h-fit flex justify-between items-stretch
                    transition-colors duration-300 relative overflow-hidden">
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/5 to-transparent dark:from-[#D94F04]/10 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex justify-between items-stretch w-full">
        {/* ===== LEFT: Stat Summary ===== */}
        <div className="flex flex-col justify-between w-[30%]">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium 
                          text-[#8A877C] dark:text-[#A0A0A0] 
                          uppercase tracking-wide">
              Projects
            </p>
            <Folder size={14} className="text-[#D94F04]" />
          </div>

          {/* Main Value (streak-style layout) */}
          <div className="flex items-end justify-start gap-1 mb-3">
            <p className="text-6xl font-thin text-[#D94F04] leading-none">
              {count}
            </p>
            <div className="text-sm 
                            text-[#8A877C] dark:text-[#A0A0A0] 
                            leading-tight mb-2">
              <p>Total</p>
              <p>Projects</p>
            </div>
          </div>

          {/* Column Stats */}
          <div className="flex flex-col gap-1 text-xs mt-0 
                          text-[#2B2B2B] dark:text-[#EAEAEA]">
            <div className="flex justify-between 
                            border-b border-[#E2E1DB]/60 dark:border-[#3A3A3A]/60 
                            pb-0.5">
              <span className="text-[#8A877C] dark:text-[#A0A0A0]">
                Completed
              </span>
              <span className="font-semibold 
                             text-[#5A8FD6] dark:text-[#6BA3FF]">
                {completed}
              </span>
            </div>
            <div className="flex justify-between 
                            border-b border-[#E2E1DB]/60 dark:border-[#3A3A3A]/60 
                            pb-0.5">
              <span className="text-[#8A877C] dark:text-[#A0A0A0]">
                Active
              </span>
              <span className="font-semibold 
                             text-[#4CA772] dark:text-[#5FD89A]">
                {active}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A877C] dark:text-[#A0A0A0]">
                Pending
              </span>
              <span className="font-semibold text-[#D94F04]">
                {pending}
              </span>
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Project List ===== */}
        <div className="w-[65%] 
                        border-l border-[#E2E1DB] dark:border-[#3A3A3A] 
                        pl-3 overflow-y-auto max-h-48 
                        scrollbar-thin 
                        scrollbar-thumb-[#D3D2C9] dark:scrollbar-thumb-[#4A4A4A]
                        scrollbar-track-transparent">
          {projects.length > 0 ? (
            projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate(`/workspace/${proj.id}`)}
                className="flex items-center justify-between py-1.5 px-3 
                           border-b border-[#E2E1DB] dark:border-[#3A3A3A] 
                           last:border-none cursor-pointer 
                           hover:bg-[#F9F8F3] dark:hover:bg-[#3A3A3A] 
                           transition-colors"
              >
                {/* Project name */}
                <p className="text-xs font-thin 
                              text-[#2B2B2B] dark:text-[#EAEAEA] 
                              truncate 
                              hover:text-[#D94F04] 
                              transition-colors">
                  {proj.name}
                </p>

                {/* Tiny colored dot indicator */}
                <div
                  className={`w-1.5 h-1.5 rounded-full ${getDotColor(
                    proj.status
                  )}`}
                ></div>
              </div>
            ))
          ) : (
            <p className="text-xs 
                          text-[#8A877C] dark:text-[#A0A0A0] 
                          italic">
              No projects yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}