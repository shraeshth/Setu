// src/pages/Workspace.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom"
import { Loader, AlertCircle } from "lucide-react"
import { useFirestore } from "../Hooks/useFirestore";
import { where, orderBy, arrayUnion } from "firebase/firestore";

import WorkspaceHeader from "../Components/Workspace/WorkspaceHeader";
import KanbanBoard from "../Components/Workspace/KanbanBoard";
import TaskModal from "../Components/Workspace/TaskModal";
import NewTaskForm from "../Components/Workspace/NewTaskForm";
import NewProjectForm from "../Components/Workspace/NewProjectForm";
import ActivitySidebar from "../Components/Workspace/ActivitySidebar";
import ProjectOverviewCard from "../Components/Workspace/ProjectOverviewCard";

export default function Workspace() {
  const { currentUser } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { getCollection, getDocument, addDocument, updateDocument, deleteDocument, loading: firestoreLoading } = useFirestore();

  const [project, setProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState("backlog");
  const [pendingRequests, setPendingRequests] = useState([]);

  // -------------------------
  // LOAD DATA
  // -------------------------
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all projects where user is a member
        const userProjects = await getCollection("collaborations", [
          where("memberIds", "array-contains", currentUser.uid)
        ]);
        setProjects(userProjects);

        // 2. Handle Project Selection Logic
        if (userProjects.length > 0) {
          let targetId = projectId;

          // If no project selected in URL, try to find a default
          if (!targetId) {
            const lastId = localStorage.getItem("lastWorkspaceProjectId");
            if (lastId && userProjects.some(p => p.id === lastId)) {
              targetId = lastId;
            } else {
              targetId = userProjects[0].id;
            }
            // Redirect to the selected project
            navigate(`/workspace/${targetId}`, { replace: true });
            return; // Stop here, the navigation will trigger a re-run
          }

          // We have a projectId (either from URL or we just redirected)
          // Verify it exists in userProjects (or fetch if not found but accessible)
          const currentProject = userProjects.find(p => p.id === targetId);

          if (currentProject) {
            setProject(currentProject);
            localStorage.setItem("lastWorkspaceProjectId", targetId); // Persist selection

            // Fetch tasks
            const projectTasks = await getCollection("collab_tasks", [
              where("collabId", "==", targetId)
            ]);
            setTasks(projectTasks);

            // Fetch Pending Requests (NEW)
            try {
              const reqs = await getCollection("project_requests", [
                where("projectId", "==", targetId),
                where("status", "==", "pending")
              ]);
              setPendingRequests(reqs);
            } catch (err) {
              console.error("Error fetching requests:", err);
            }

          } else {
            // Project ID in URL but not in user's list (maybe direct link or just joined)
            const doc = await getDocument("collaborations", targetId);
            if (doc && doc.memberIds?.includes(currentUser.uid)) {
              setProject(doc);
              localStorage.setItem("lastWorkspaceProjectId", targetId);

              const projectTasks = await getCollection("collab_tasks", [
                where("collabId", "==", targetId)
              ]);
              setTasks(projectTasks);

              // Fetch Requests (Also here for redundancy if helpful, or keep it simple)
              try {
                const reqs = await getCollection("project_requests", [
                  where("projectId", "==", targetId),
                  where("status", "==", "pending")
                ]);
                setPendingRequests(reqs);
              } catch (err) { console.error(err); }

            } else {
              // ... existing else block ...
            }
          }
        } else {
          // ... existing else block ...
        }

      } catch (err) {
        console.error("Error loading workspace data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [projectId, currentUser, getCollection, getDocument, navigate]);

  // -------------------------
  // REQUEST HANDLERS (NEW)
  // -------------------------
  const handleAcceptRequest = async (request) => {
    if (!project) return;
    try {
      // 1. Add member to project
      const newMember = {
        uid: request.requesterId,
        name: request.requesterName || "New Member",
        role: "member",
        joinedAt: new Date().toISOString()
      };

      await updateDocument("collaborations", project.id, {
        members: arrayUnion(newMember),
        memberIds: arrayUnion(request.requesterId)
      });

      // 2. Update Request Status
      await updateDocument("project_requests", request.id, { status: "accepted" });

      // 3. Notify Requester
      await addDocument("notifications", {
        type: "request_accepted",
        message: `Your request to join ${project.title} was accepted!`,
        userUid: request.requesterId,
        senderId: currentUser.uid,
        projectId: project.id,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // 4. Update Local State
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      setProject(prev => ({
        ...prev,
        members: [...(prev.members || []), newMember],
        memberIds: [...(prev.memberIds || []), request.requesterId]
      }));

      alert("Request accepted!");
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      await updateDocument("project_requests", request.id, { status: "rejected" });
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      alert("Request rejected.");
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  // -------------------------
  // TASK HANDLERS
  // -------------------------
  const handleTaskMove = async (taskId, newStatus) => {
    // ... existing handleTaskMove ...
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      await updateDocument("collab_tasks", taskId, { status: newStatus });
    } catch (err) {
      console.error("Error moving task:", err);
      // Revert on error (could be improved)
    }
  };

  const handleSaveTask = async (updatedTask) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));

    try {
      await updateDocument("collab_tasks", updatedTask.id, updatedTask);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);

    try {
      await deleteDocument("collab_tasks", taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleCreateTask = async (newTask) => {
    if (!projectId) {
      alert("Please select a project first");
      return;
    }

    try {
      const taskData = {
        ...newTask,
        collabId: projectId,
        createdBy: {
          uid: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          photoURL: currentUser.photoURL || "",
        },
        createdByUid: currentUser.uid,
        assignee: newTask.assignee || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        orderIndex: tasks.length,
      };

      const docRef = await addDocument("collab_tasks", taskData);

      setTasks(prev => [{ ...taskData, id: docRef.id }, ...prev]);
      setShowNewTaskForm(false);
    } catch (err) {
      console.error("Error creating task:", err);
      alert(`Failed to create task: ${err.message}`);
    }
  };

  const handleNewTask = (status = "backlog") => {
    setNewTaskStatus(status);
    setShowNewTaskForm(true);
  };

  const handleCreateProject = async (projectData) => {
    try {
      const docRef = await addDocument("collaborations", projectData);
      const newProject = { ...projectData, id: docRef.id };
      setProjects(prev => [...prev, newProject]);
      // Navigate to the new project
      navigate(`/workspace/${docRef.id}`);
    } catch (err) {
      console.error("Error creating project:", err);
    }
  };

  // -------------------------
  // PROGRESS CALC
  // -------------------------
  const progress = {
    completed: tasks.filter(t => t.status === "completed").length,
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
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

        {projects.length > 0 && (
          <WorkspaceHeader
            project={project}
            projects={projects}
            onCreateTask={() => handleNewTask("backlog")}
            onCreateProject={() => setShowNewProjectForm(true)}
          />
        )}

        {/* Main Content */}
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-2xl border border-[#E2E1DB] dark:border-[#333] shadow-sm max-w-md w-full">
              <div className="w-16 h-16 bg-[#F3F2EE] dark:bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#D94F04]" />
              </div>
              <h2 className="text-xl font-semibold text-[#2B2B2B] dark:text-white mb-2">
                No Projects Added
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                You haven't created or joined any projects yet. Create your first project to get started with task management.
              </p>
              <button
                onClick={() => setShowNewProjectForm(true)}
                className="w-full py-2.5 bg-[#D94F04] hover:bg-[#bf4404] text-white rounded-lg font-medium transition-colors"
              >
                Create New Project
              </button>
            </div>
          </div>
        ) : (
          /* Two column layout */
          <div className="grid grid-cols-10 gap-4 h-[calc(100vh-140px)] mt-4">

            {/* LEFT SIDE: overview + kanban */}
            <div className="col-span-6 flex flex-col gap-4 overflow-hidden">

              {/* Overview card */}
              <div className="w-full">
                <ProjectOverviewCard
                  title={project?.title || "Select a Project"}
                  description={project?.description || "Select a project from the dropdown"}
                  progress={progress}
                  categories={(() => {
                    // Calculate categories from tasks
                    const categoryMap = {};
                    const colors = ["#D94F04", "#E86C2E", "#F3A46B", "#B83D02", "#FFB77A", "#FF9A5A"];

                    tasks.forEach(task => {
                      const cat = task.category || "General";
                      if (!categoryMap[cat]) {
                        categoryMap[cat] = { name: cat, count: 0, color: colors[Object.keys(categoryMap).length % colors.length] };
                      }
                      categoryMap[cat].count++;
                    });

                    return Object.values(categoryMap);
                  })()}

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
              <div className="rounded-xl bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                      border border-[#E2E1DB] dark:border-[#3A3A3A] p-4 h-full overflow-auto">
                <ActivitySidebar
                  progress={progress}
                  compact
                  team={project?.members || []}
                  activities={tasks
                    .filter(t => t.createdAt)
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5)
                    .map(t => ({
                      text: `${t.title} (${t.status})`,
                      time: new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                    }))
                  }
                  pendingRequests={pendingRequests}
                  onAcceptRequest={handleAcceptRequest}
                  onRejectRequest={handleRejectRequest}
                  projectStatus={project?.status}
                  onArchive={async () => {
                    // ... existing archive logic ...
                    if (!project) return;
                    if (window.confirm("Are you sure you want to archive this project?")) {
                      try {
                        await updateDocument("collaborations", project.id, { status: "archived" });
                        alert("Project archived");
                        navigate("/workspace"); // Go to workspace root to trigger auto-selection
                      } catch (err) {
                        console.error("Error archiving project:", err);
                      }
                    }
                  }}
                  onComplete={async () => {
                    if (!project) return;
                    if (window.confirm("Are you sure you want to mark this project as complete?")) {
                      try {
                        await updateDocument("collaborations", project.id, { status: "completed" });
                        alert("Project marked as complete");
                        // Optional: celebrate or redirect
                      } catch (err) {
                        console.error("Error completing project:", err);
                      }
                    }
                  }}
                  onDelete={async () => {
                    if (!project) return;
                    if (window.confirm("Are you sure you want to DELETE this project? This action cannot be undone.")) {
                      try {
                        await deleteDocument("collaborations", project.id);
                        alert("Project deleted");
                        navigate("/workspace");
                      } catch (err) {
                        console.error("Error deleting project:", err);
                      }
                    }
                  }}
                />
              </div>
            </div>

          </div>
        )}
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
          projectMembers={project?.members || []}
        />
      )}

      {showNewProjectForm && (
        <NewProjectForm
          onClose={() => setShowNewProjectForm(false)}
          onSubmit={handleCreateProject}
        />
      )}
    </div>
  );
}
