import React, { useEffect, useState } from "react";

import { useFirestore } from "../../Hooks/useFirestore";
import { orderBy, limit } from "firebase/firestore";

export default function NewProjectsThisWeek() {
  const { getCollection } = useFirestore();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getCollection("collaborations", [
          orderBy("createdAt", "desc"),
          limit(5)
        ]);

        setProjects(
          data.map(p => ({
            title: p.title,
            time: getTimeAgo(p.createdAt),
            gradient: getRandomAccentGradient(),
            stack: p.techStack || ["React", "Firebase"]
          }))
        );
      } catch (err) {
        console.error("Error fetching new projects:", err);
      }
    };

    fetchProjects();
  }, [getCollection]);

  const getTimeAgo = timestamp => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    return `${diff}d ago`;
  };

  // Accent color gradient generator
  const getRandomAccentGradient = () => {
    const shades = [
      "from-[#D94F04] to-[#F28B3C]",   // orange strong
      "from-[#D94F04] to-[#C2410C]",   // dark rich
      "from-[#E35A0E] to-[#D94F04]",   // reverse flow
      "from-[#F07A3A] to-[#D94F04]",   // warm deep
      "from-[#B93F02] to-[#D94F04]"    // very deep
    ];
    return shades[Math.floor(Math.random() * shades.length)];
  };

  return (
    <div
      className="h-full bg-[#FCFCF9] dark:bg-[#1A1A1A] rounded-2xl 
        border border-[#E2E1DB] dark:border-[#333] p-4 flex flex-col
        transition-colors duration-300"
    >
      <h3 className="text-sm font-bold mb-3 text-[#2B2B2B] dark:text-[#EAEAEA]">
        New Projects This Week
      </h3>

      <div
        className="flex gap-3 overflow-x-auto h-full items-center pb-1 scrollbar-thin"
        style={{ scrollbarWidth: "auto" }}
      >

        {projects.length > 0 ? (
          projects.map((proj, idx) => (
            <div
              key={idx}
              className="inline-block overflow-visible">
              <div
                className={`
    min-w-[160px] h-full bg-gradient-to-br ${proj.gradient}
    rounded-xl p-4 cursor-pointer transition-transform
    flex flex-col justify-between shadow-sm
  `}
              >

                <div>
                  <div className="font-bold mb-1 text-sm line-clamp-2 text-white">
                    {proj.title}
                  </div>
                  <div className="text-xs text-white/80">{proj.time}</div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.stack.slice(0, 2).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[9px] bg-black/20 text-white px-2 py-0.5 rounded backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-[#8A877C] dark:text-[#A0A0A0]">
            No new projects yet.
          </div>
        )}
      </div>
    </div>
  );
}
