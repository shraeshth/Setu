import React from "react";
import { Code } from "lucide-react/dist/lucide-react";

export default function ExploreBySkillsIcons() {
  const skills = [
    "React", "Next.js", "Python", "UI/UX", "ML", "Tailwind",
    "TypeScript", "Backend", "DevOps", "Flutter", "Node.js", "PostgreSQL",
    "AWS", "Figma", "Docker", "GraphQL"
  ];

  return (
    <div className="
      h-full bg-neutral-900/50 backdrop-blur-xl 
      rounded-xl border border-neutral-800 
      p-3 flex flex-col
    ">
      {/* Header */}
      <h3 className="text-sm font-semibold mb-2 text-neutral-100">
        Explore by Skills
      </h3>

      {/* Compact skills grid */}
      <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto pr-1">
        {skills.map((skill, idx) => (
          <div
            key={idx}
            className="
              aspect-square 
              bg-neutral-950/40 
              rounded-lg border border-neutral-700/60
              hover:border-orange-400 transition-all
              cursor-pointer flex flex-col items-center 
              justify-center gap-1 hover:scale-105
            "
          >
            <Code className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] text-neutral-300 text-center leading-tight">
              {skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
