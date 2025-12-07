// ProjectTabs.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectTabs({ projects = [] }) {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const handleTabClick = (id) => {
    navigate(`/workspace/${id}`);
  };

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#121212] rounded-xl p-1">
      {projects.map(p => (
        <button
          key={p.id}
          onClick={() => handleTabClick(p.id)}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${projectId === p.id
            ? "bg-[#D94F04] text-white font-semibold"
            : "text-[#2B2B2B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2B2B2B]"
            }`}
        >
          {p.title || p.name || "Untitled"}
        </button>
      ))}
    </div>
  );
}
