// components/Explore/NewProjectsThisWeek.jsx
import React from "react";

export default function NewProjectsThisWeek() {
  const projects = [
    { title: "Crypto Tracker", time: "2d ago", gradient: "from-blue-600 to-cyan-600", stack: ["React", "Node", "Web3"] },
    { title: "Fitness App", time: "3d ago", gradient: "from-green-600 to-emerald-600", stack: ["Flutter", "Firebase"] },
    { title: "Recipe Finder", time: "4d ago", gradient: "from-orange-600 to-red-600", stack: ["Next.js", "API"] },
    { title: "Music Player", time: "5d ago", gradient: "from-purple-600 to-pink-600", stack: ["React", "Tone.js"] },
  ];

  return (
    <div className="h-full bg-neutral-900/50 backdrop-blur-xl rounded-2xl 
        border border-neutral-800 p-4 flex flex-col">

      <h3 className="text-sm font-bold mb-3">New Projects This Week</h3>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className={`
              min-w-[180px] h-full 
              bg-gradient-to-br ${proj.gradient}
              rounded-xl p-4 cursor-pointer 
              hover:scale-105 transition-transform 
              flex flex-col justify-between
            `}
          >
            <div>
              <div className="font-bold mb-1">{proj.title}</div>
              <div className="text-xs text-white/70">{proj.time}</div>
            </div>

            <div className="flex gap-1 mt-2">
              {proj.stack.map((tech, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-black/30 px-2 py-0.5 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
