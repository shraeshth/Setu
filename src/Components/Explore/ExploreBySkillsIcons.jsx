import React, { useEffect, useState } from "react";
import { Folder, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useFirestore } from "../../Hooks/useFirestore";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { ALL_SKILLS } from "../../utils/skillsData";

// Get project dot color like StatProject
const getDotColor = (status) => {
  switch (status) {
    case "active":
    case "in-progress":
    case "hiring":
      return "bg-[#D94F04]";
    case "completed":
      return "bg-[#A03C05]";
    case "pending":
    case "planning":
    case "archived":
      return "bg-[#E6B8A2]";
    default:
      return "bg-[#E6B8A2]";
  }
};

// Dynamic Icon Component
const DynamicIcon = ({ skill, isActive }) => {
  const IconComponent = LucideIcons[skill.icon.name || skill.icon.fallback] || LucideIcons[skill.icon.fallback] || LucideIcons.Circle;

  return (
    <IconComponent
      className={`w-5 h-5 ${isActive ? "text-[#D94F04]" : "text-[#8A877C] dark:text-[#707070]"}`}
    />
  );
};

export default function ExploreBySkillsIcons() {
  const { getCollection } = useFirestore();
  const navigate = useNavigate();

  const [skills, setSkills] = useState(ALL_SKILLS);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Filter skills based on search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSkills(ALL_SKILLS);
    } else {
      const lower = searchTerm.toLowerCase();
      setSkills(ALL_SKILLS.filter(s => s.name.toLowerCase().includes(lower)));
    }
  }, [searchTerm]);

  // Select first skill on load
  useEffect(() => {
    if (!selectedSkill && ALL_SKILLS.length > 0) {
      setSelectedSkill(ALL_SKILLS[0]);
    }
  }, []);

  /* ----------------------------------------
     FETCH PROJECTS FOR SELECTED SKILL
  -----------------------------------------*/
  useEffect(() => {
    if (!selectedSkill) return;

    const loadProjects = async () => {
      setLoadingProjects(true);

      try {
        // Fetch ALL projects for client-side filtering (Better for MVP/Small Scale)
        // This avoids index issues and capitalisation mismatches
        const collRef = collection(db, "collaborations");
        const snapshot = await getDocs(collRef);

        const allProjects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        const searchSkill = selectedSkill.name.toLowerCase();

        console.log(`[Explore] Fetching for skill: '${searchSkill}'`);
        console.log(`[Explore] Total projects fetched: ${allProjects.length}`);

        const filtered = allProjects.filter(p => {
          // 1. Check Arrays (skills, techStack)
          const pSkills = (p.skills || []).map(s => String(s).toLowerCase());
          const pStack = (p.techStack || []).map(s => String(s).toLowerCase());

          const inSkills = pSkills.includes(searchSkill);
          const inStack = pStack.includes(searchSkill);

          // 2. Check Text Fields (Title, Description)
          const text = `${p.title || ""} ${p.description || ""}`.toLowerCase();
          const inText = text.includes(searchSkill);

          const isMatch = inSkills || inStack || inText;

          if (isMatch) {
            console.log(`[Explore] MATCH found: ${p.title} (ID: ${p.id})`);
          } else {
            // Optional: Log non-match reasons if needed for deep debug
            // console.log(`[Explore] No match for: ${p.title} | Skills: ${pSkills} | Stack: ${pStack}`);
          }

          return isMatch;
        });

        console.log(`[Explore] Final filtered count: ${filtered.length}`);
        setProjects(filtered);
      } catch (err) {
        console.error("Error loading skill projects:", err);
      }

      setLoadingProjects(false);
    };

    loadProjects();
  }, [selectedSkill]);

  return (
    <div className="h-full flex gap-4">

      {/* LEFT — SKILL ICON GRID */}
      <div className="
        w-[35%] bg-[#FCFCF9] dark:bg-[#1A1A1A]
        rounded-2xl border border-[#E2E1DB] dark:border-[#333]
        p-4 flex flex-col relative overflow-hidden
      ">
        <h3 className="text-sm font-bold mb-3 text-[#2B2B2B] dark:text-[#EAEAEA]">
          Explore by Skills
        </h3>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A877C] dark:text-[#707070]" />
          <input
            type="text"
            placeholder="Skills"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#F0EFE9] dark:bg-[#252525] rounded-lg
                     text-[#3C3C3C] dark:text-[#EAEAEA] placeholder-[#8A877C] dark:placeholder-[#707070]
                     focus:outline-none focus:ring-1 focus:ring-[#D94F04]"
          />
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[60vh] scrollbar-thin pr-1 pb-6">
          {skills.map((skill, i) => {
            const active = selectedSkill?.slug === skill.slug;
            return (
              <div
                key={skill.slug}
                onClick={() => setSelectedSkill(skill)}
                className={`
                    w-full px-3 py-2 rounded-lg cursor-pointer flex items-center gap-3
                    border transition-all
                    ${active
                    ? "border-[#D94F04] bg-[#FFF4EC]"
                    : "border-[#E2E1DB] dark:border-[#3A3A3A] bg-[#F0EFE9] dark:bg-[#252525] hover:border-[#D94F04]/50"
                  }
                  `}
              >
                <DynamicIcon skill={skill} isActive={active} />
                <span
                  className={`text-[11px] font-medium truncate ${active ? "text-[#D94F04]" : "text-[#3C3C3C] dark:text-[#B0B0B0]"
                    }`}
                >
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Blur Gradient Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#FCFCF9] dark:from-[#1A1A1A] to-transparent pointer-events-none rounded-b-2xl"></div>
      </div>

      {/* RIGHT — PROJECT LIST LIKE StatProject */}
      <div className="
        w-[65%] bg-[#FCFCF9] dark:bg-[#2B2B2B]
        rounded-xl border border-[#E2E1DB] dark:border-[#3A3A3A]
        p-4 flex flex-col
      ">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#2B2B2B] dark:text-white">
            {selectedSkill ? `Projects for ${selectedSkill.name}` : "Select a skill"}
          </h3>
          <Folder size={16} className="text-[#D94F04]" />
        </div>

        <div className="border-t border-[#E2E1DB] dark:border-[#3A3A3A] pt-3 overflow-y-auto max-h-[60vh] scrollbar-thin">
          {loadingProjects ? (
            <p className="text-xs text-gray-500">Loading projects…</p>
          ) : projects.length === 0 ? (
            <p className="text-xs text-gray-500">No matching projects.</p>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/workspace/${p.id}`)}
                className="flex items-center justify-between py-2 px-2 border-b border-[#E2E1DB] dark:border-[#3A3A3A] cursor-pointer hover:bg-[#F9F8F3] dark:hover:bg-[#3A3A3A] transition"
              >
                <div className="flex flex-col max-w-[80%]">
                  <span className="text-xs font-medium text-[#2B2B2B] dark:text-white truncate">
                    {p.title}
                  </span>
                  <span className="text-[10px] text-[#8A877C] truncate">
                    {p.description}
                  </span>
                </div>

                <div className={`w-2 h-2 rounded-full ${getDotColor(p.status)} shrink-0`} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
