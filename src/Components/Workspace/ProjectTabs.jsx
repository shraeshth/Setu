// ProjectTabs.jsx
import React, { useState } from "react";

export default function ProjectTabs({ projects = [] }) {
  const [active, setActive] = useState(projects[0]?.id || null);

  return (
    <div className="flex items-center gap-2 bg-white dark:bg-[#121212] border border-[#E2E1DB] dark:border-[#2B2B2B] rounded-md p-1">
      {projects.map(p => (
        <button
          key={p.id}
          onClick={() => setActive(p.id)}
          className={`px-3 py-1 text-sm rounded-md ${active === p.id ? "bg-[#D94F04] text-white" : "text-[#2B2B2B] dark:text-gray-300"}`}
        >
          {p.name}
        </button>
      ))}
    </div>
  );
}
