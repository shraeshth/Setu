// WorkspaceHeader.jsx
import React from "react";
import ProjectTabs from "./ProjectTabs";
import TeamStack from "./TeamStack";

export default function WorkspaceHeader({ project, projects, onCreateTask }) {
  return (
    <header className="flex items-center justify-between w-full gap-4">

      <div className="flex items-center gap-3">
        <ProjectTabs projects={projects} />
        
      </div>
      <button onClick={onCreateTask} className="px-3 py-2 bg-[#D94F04] text-white rounded-md text-sm">New Task</button>
    </header>
  );
}
