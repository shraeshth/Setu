// src/pages/Workspace.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useParams } from "react-router-dom";
import { Loader, AlertCircle } from "lucide-react";

import WorkspaceHeader from "../Components/Workspace/WorkspaceHeader";
import KanbanBoard from "../Components/Workspace/KanbanBoard";
import TaskModal from "../Components/Workspace/TaskModal";
import NewTaskForm from "../Components/Workspace/NewTaskForm";
import ActivitySidebar from "../Components/Workspace/ActivitySidebar";
import ProjectOverviewCard from "../Components/Workspace/ProjectOverviewCard";

export default function Workspace() {
  const { currentUser } = useAuth();
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState("backlog");

  // -------------------------
  // MOCK DATA
  // -------------------------
  const mockProjects = [
    { id: "project-1", name: "AI Resume Builder" },
    { id: "project-2", name: "Lovvale UI Revamp" },
    { id: "project-3", name: "PeerMatch Pilot" }
  ];

  const mockProject = {
    id: "project-1",
    name: "AI Resume Builder",
    owner: "John Doe",
    members: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Alice Johnson" },
      { id: "4", name: "Michael Chen" },
      { id: "5", name: "Sarah Park" }
    ]
  };

  const mockTasks = [
    { id: "task-1", title: "Design landing page mockup", status: "backlog", priority: "high", assignee: { id: "1", name: "John" }, dueDate: "2024-12-20" },
    { id: "task-2", title: "Implement authentication flow", status: "in-progress", priority: "high", assignee: { id: "2", name: "Jane" }, dueDate: "2024-12-15" },
    { id: "task-3", title: "Write API documentation", status: "in-progress", priority: "medium", assignee: { id: "3", name: "Alice" }, dueDate: "2024-12-18" },
    { id: "task-4", title: "Fix mobile responsive issues", status: "review", priority: "high", assignee: { id: "1", name: "John" }, dueDate: "2024-12-10" },
    { id: "task-5", title: "Set up CI/CD pipeline", status: "completed", priority: "medium", assignee: { id: "4", name: "Michael" }, dueDate: "2024-12-05" },
    { id: "task-6", title: "Create user onboarding flow", status: "backlog", priority: "low", assignee: { id: "5", name: "Sarah" }, dueDate: "2024-12-25" }
  ];

  // -------------------------
  // LOAD MOCK DATA (for now)
  // -------------------------
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProjects(mockProjects);
      setProject(mockProject);
      setTasks(mockTasks);
      setLoading(false);
    }, 400);
  }, [projectId, currentUser]);

  // -------------------------
  // TASK HANDLERS
  // -------------------------
  const handleTaskMove = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleSaveTask = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleCreateTask = (newTask) => {
    const taskWithId = { ...newTask, id: `task-${Date.now()}`, createdAt: new Date().toISOString() };
    setTasks(prev => [taskWithId, ...prev]);
  };

  const handleNewTask = (status = "backlog") => {
    setNewTaskStatus(status);
    setShowNewTaskForm(true);
  };

  // -------------------------
  // PROGRESS CALC
  // -------------------------
  const progress = {
    completed: tasks.filter(t => t.status === "completed").length,
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    backlog: tasks.filter(t => t.status === "backlog").length,
    review: tasks.filter(t => t.status === "review").length
  };

  // -------------------------
  // AUTH GUARDS
  // -------------------------
  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center text-center">
        <AlertCircle className="w-12 h-12 text-[#D94F04] mx-auto" />
        <h3 className="mt-4">Please log in to access workspace</h3>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9F8F3] dark:bg-[#0B0B0B]">
        <Loader className="w-12 h-12 text-[#D94F04] animate-spin" />
      </div>
    );
  }

// -------------------------
// MAIN LAYOUT
// -------------------------
return (
  <div className="max-h-screen w-full bg-[#F9F8F3] dark:bg-[#0B0B0B]">
    <div className="max-w-[1400px] mx-auto h-full px-4 py-4">

      <WorkspaceHeader
        project={project}
        projects={projects}
        onCreateTask={() => handleNewTask("backlog")}
      />

      {/* Two column layout */}
      <div className="grid grid-cols-10 gap-4 h-[calc(100vh-140px)] mt-4">
        
        {/* LEFT SIDE: overview + kanban */}
        <div className="col-span-6 flex flex-col gap-4 overflow-hidden">

          {/* Overview card */}
          <div className="w-full">
            <ProjectOverviewCard
              title="Project Alpha"
              description="A collaborative initiative to build the student skill exchange system with seamless matching and credibility workflows."
              progress={{ completed: 18, total: 30 }}
              categories={[
                { name: "Backend", count: 12, color: "#2E86C1" },
                { name: "UI/UX", count: 5, color: "#E94A4A" },
                { name: "Matching", count: 3, color: "#6C5CE7" },
                { name: "Credibility", count: 1, color: "#00B894" },
                { name: "Content", count: 9, color: "#F39C12" },
              ]}
            />
          </div>

          {/* Kanban */}
          <div className="flex-1 overflow-auto">
            <KanbanBoard
              tasks={tasks}
              onTaskClick={setSelectedTask}
              onTaskMove={handleTaskMove}
              onNewTask={handleNewTask}
            />
          </div>
        </div>

        {/* RIGHT SIDE: activity sidebar */}
        <div className="col-span-4 h-full">
          <div className="rounded-xl bg-white dark:bg-[#121212] p-4 border border-[#E2E1DB] dark:border-[#2B2B2B] h-full overflow-auto">
            <ActivitySidebar progress={progress} compact />
          </div>
        </div>

      </div>
    </div>

    {/* Modals */}
    {selectedTask && (
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    )}

    {showNewTaskForm && (
      <NewTaskForm
        onClose={() => setShowNewTaskForm(false)}
        onSubmit={handleCreateTask}
        defaultStatus={newTaskStatus}
      />
    )}
  </div>
);

}
