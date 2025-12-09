import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../Hooks/useFirestore";
import { orderBy, limit } from "firebase/firestore";
import * as LucideIcons from "lucide-react";
import { ALL_SKILLS } from "../../utils/skillsData";

export default function NewProjectsThisWeek() {
  const { getCollection } = useFirestore();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Date formatter (e.g., 12th May)
  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    // Suffix logic
    const suffix = ["th", "st", "nd", "rd"];
    const v = day % 100;
    const s = suffix[(v - 20) % 10] || suffix[v] || suffix[0] || "th";

    return `${day}${s} ${month}`;
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getCollection("collaborations", [
          orderBy("createdAt", "desc"),
          limit(5)
        ]);

        setProjects(
          data.map(p => ({
            id: p.id,
            title: p.title,
            date: formatDate(p.createdAt),
            gradient: getRandomAccentGradient(),
            skills: p.requiredSkills || []
          }))
        );
      } catch (err) {
        console.error("Error fetching new projects:", err);
      }
    };

    fetchProjects();
  }, [getCollection]);


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
        border border-[#E2E1DB] dark:border-[#333] p-2 flex flex-col
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
              className="inline-block overflow-visible"
              onClick={() => navigate(`/workspace/${proj.id}`)}
            >
              <div
                className={`
    min-w-[160px] h-full bg-gradient-to-br ${proj.gradient}
    rounded-xl p-4 cursor-pointer transition-transform hover:scale-[1.02]
    flex flex-col justify-between shadow-sm
  `}
              >

                <div>
                  <div className="font-bold mb-1 text-sm line-clamp-2 text-white">
                    {proj.title}
                  </div>
                  <div className="text-xs text-white/80">{proj.date}</div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.skills.slice(0, 3).map((skillName, i) => {
                    const skill = ALL_SKILLS.find(s => s.name === skillName);
                    if (!skill) {
                      // Text fallback for unknown skills
                      return (
                        <span key={i} className="text-[9px] bg-black/20 text-white px-2 py-0.5 rounded backdrop-blur-sm">
                          {skillName}
                        </span>
                      );
                    }

                    // Resolve Icon: Use fallback for brands, or direct name for lucide
                    const iconKey = skill.icon.type === "brand" ? skill.icon.fallback : skill.icon.name;
                    const IconComp = LucideIcons[iconKey] || LucideIcons.Circle;

                    return (
                      <div key={i} className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/10" title={skillName}>
                        <IconComp size={12} className="text-white" />
                      </div>
                    );
                  })}
                  {proj.skills.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[9px] text-white font-medium backdrop-blur-sm border border-white/10">
                      +{proj.skills.length - 3}
                    </div>
                  )}
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
