// WorkspaceHeader.jsx
import React from "react";
import ProjectTabs from "./ProjectTabs";
import TeamStack from "./TeamStack";

export default function WorkspaceHeader({ project, projects, onCreateTask }) {
  return (
    <header className="flex items-center justify-between rounded-full w-full gap-4 bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                    border border-[#E2E1DB] dark:border-[#3A3A3A]">

      <div className="flex items-center gap-3">
        <ProjectTabs projects={projects} />
        
      </div>
      <div className="p-1">
      <button onClick={onCreateTask} className="px-2 py-1 bg-[#D94F04] text-white rounded-full text-sm">+ New Task</button>
      </div>
    </header>
  );
}
