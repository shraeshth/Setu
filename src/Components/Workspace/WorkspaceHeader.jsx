// WorkspaceHeader.jsx
import React from "react";
import { Plus } from "lucide-react";
import ProjectTabs from "./ProjectTabs";

export default function WorkspaceHeader({ project, projects, onCreateTask, onCreateProject }) {
  return (
    <header className="flex items-center justify-between p-2 rounded-2xl w-full gap-4 bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A]">

      <div className="flex items-center gap-3">
        <ProjectTabs projects={projects} />
      </div>

      <div className="p-1 flex gap-2">
        <button
          onClick={onCreateProject}
          className="px-3 py-1 bg-[#D94F04] text-white rounded-lg text-sm hover:bg-[#c34603] 
                     flex items-center gap-1 transition-colors"
        >
          <Plus size={16} />
          New Project
        </button>
      </div>
    </header>
  );
}
