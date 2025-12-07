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
import PublicProjectDetails from "../Components/Workspace/PublicProjectDetails";

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

  // Guest View State
  const [isMember, setIsMember] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinStatus, setJoinStatus] = useState("none");

  // -------------------------
  // LOAD DATA
  // -------------------------
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch user projects for sidebar/header list
        const userProjects = await getCollection("collaborations", [
          where("memberIds", "array-contains", currentUser.uid)
        ]);
        setProjects(userProjects);

        // 2. Determine Target Project
        let targetId = projectId;
        if (!targetId && userProjects.length > 0) {
          // Default to last visited or first
          const lastId = localStorage.getItem("lastWorkspaceProjectId");
          targetId = (lastId && userProjects.some(p => p.id === lastId)) ? lastId : userProjects[0].id;
          navigate(`/workspace/${targetId}`, { replace: true });
          return; // Navigation triggers re-run
        }

        if (targetId) {
          let currentProject = userProjects.find(p => p.id === targetId);
          let isUserMember = true;

          // If not in user's list, fetch as public
          if (!currentProject) {
            const doc = await getDocument("collaborations", targetId);
            if (doc) {
              currentProject = doc;
              isUserMember = doc.memberIds?.includes(currentUser.uid);
            }
          }

          if (currentProject) {
            setProject(currentProject);
            setIsMember(isUserMember);
            localStorage.setItem("lastWorkspaceProjectId", targetId);

            if (isUserMember) {
              // Fetch full data for members
              const projectTasks = await getCollection("collab_tasks", [
                where("collabId", "==", targetId)
              ]);
              setTasks(projectTasks);

              const reqs = await getCollection("project_requests", [
                where("projectId", "==", targetId),
                where("status", "==", "pending")
              ]);
              setPendingRequests(reqs);
            } else {
              // Guest Logic: Check connection status
              const existingReqs = await getCollection("project_requests", [
                where("projectId", "==", targetId),
                where("requesterId", "==", currentUser.uid)
              ]);
              if (existingReqs.length > 0) {
                setJoinStatus(existingReqs[0].status);
              }
            }
          }
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
  // GUEST HANDLERS
  // -------------------------
  const handleRequestJoin = async () => {
    if (!currentUser || !project) return;
    setJoinLoading(true);
    try {
      await addDocument("project_requests", {
        projectId: project.id,
        projectTitle: project.title,
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName || currentUser.email,
        ownerId: project.ownerUid || project.createdBy,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      // Notify Owner
      const ownerId = project.ownerUid || project.createdBy;
      if (ownerId) {
        await addDocument("notifications", {
          type: "project_request",
          message: `${currentUser.displayName || "Someone"} requested to join ${project.title}`,
          userUid: ownerId,
          senderId: currentUser.uid,
          projectId: project.id,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      setJoinStatus("pending");
      alert("Request sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setJoinLoading(false);
    }
  };


  // -------------------------
  // EXISTING HANDLERS (Same as before)
  // -------------------------
  const handleAcceptRequest = async (request) => {
    if (!project) return;
    try {
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
      await updateDocument("project_requests", request.id, { status: "accepted" });
      await addDocument("notifications", {
        type: "request_accepted",
        message: `Your request to join ${project.title} was accepted!`,
        userUid: request.requesterId,
        senderId: currentUser.uid,
        projectId: project.id,
        isRead: false,
        createdAt: new Date().toISOString()
      });
      setPendingRequests(prev => prev.filter(r => r.id !== request.id));
      setProject(prev => ({
        ...prev,
        members: [...(prev.members || []), newMember],
        memberIds: [...(prev.memberIds || []), request.requesterId]
      }));
      // Auto-switch to member view
      setIsMember(true);
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

  const handleTaskMove = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await updateDocument("collab_tasks", taskId, { status: newStatus }); } catch (err) { console.error(err); }
  };

  const handleSaveTask = async (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    try {
      await updateDocument("collab_tasks", updatedTask.id, updatedTask);
      setSelectedTask(null);
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setSelectedTask(null);
    try { await deleteDocument("collab_tasks", taskId); } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (newTask) => {
    if (!projectId) return;
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
      navigate(`/workspace/${docRef.id}`);
    } catch (err) {
      console.error("Error creating project:", err);
      alert("Failed to create project.");
    }
  };

  const progress = {
    completed: tasks.filter(t => t.status === "completed").length,
    total: tasks.length,
    todo: tasks.filter(t => t.status === "todo").length,
    backlog: tasks.filter(t => t.status === "backlog").length,
    review: tasks.filter(t => t.status === "review").length
  };

  // -------------------------
  // MAIN LAYOUT
  // -------------------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9F8F3] dark:bg-[#0B0B0B]">
        <Loader className="w-12 h-12 text-[#D94F04] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-h-screen w-full bg-[#F9F8F3] dark:bg-[#0B0B0B]">
      <div className="max-w-[1400px] mx-auto h-full px-4 py-4">

        {/* Header - Always visible if we have a project OR user has projects */}
        {(project || projects.length > 0) && (
          <WorkspaceHeader
            project={project}
            projects={projects}
            onCreateTask={() => handleNewTask("backlog")}
            onCreateProject={() => setShowNewProjectForm(true)}
            isGuest={!isMember}
          />
        )}

        {/* Empty State: Only when NO project loaded and user has NO projects */}
        {!project && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center">
            <div className="bg-white dark:bg-[#1A1A1A] p-8 rounded-2xl border border-[#E2E1DB] dark:border-[#333] shadow-sm max-w-md w-full">
              <div className="w-16 h-16 bg-[#F3F2EE] dark:bg-[#222] rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-[#D94F04]" />
              </div>
              <h2 className="text-xl font-semibold text-[#2B2B2B] dark:text-white mb-2">
                No Projects Added
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                You haven't created or joined any projects yet.
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

            {/* LEFT SIDE */}
            <div className="col-span-6 flex flex-col gap-4 overflow-hidden">
              {project && !isMember ? (
                // GUEST VIEW
                <div className="h-full">
                  <PublicProjectDetails
                    project={project}
                    onJoin={handleRequestJoin}
                    isPending={joinStatus === 'pending' || joinStatus === 'accepted'}
                    isSending={joinLoading}
                  />
                </div>
              ) : (
                // MEMBER VIEW
                <>
                  <div className="w-full">
                    <ProjectOverviewCard
                      title={project?.title || "Select a Project"}
                      description={project?.description || "Select a project from the dropdown"}
                      author={project?.members?.find(m => m.uid === (project.ownerUid || project.createdBy))?.name || "Unknown Author"}
                      lastUpdated={project?.createdAt ? new Date(project.createdAt).toLocaleDateString() : ""}
                      categories={(() => {
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
                  <div className="flex-1 overflow-auto">
                    <KanbanBoard
                      tasks={tasks}
                      onTaskClick={setSelectedTask}
                      onTaskMove={handleTaskMove}
                      onNewTask={handleNewTask}
                    />
                  </div>
                </>
              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-4 h-full">
              <div className="rounded-xl bg-[#FCFCF9] dark:bg-[#2B2B2B] 
                      border border-[#E2E1DB] dark:border-[#3A3A3A] p-4 h-full overflow-hidden relative group">
                {project && !isMember ? (
                  <>
                    {/* Blurred Content Layer */}
                    <div className="absolute inset-0 filter blur-sm opacity-40 pointer-events-none p-4 overflow-hidden select-none">
                      <ActivitySidebar
                        progress={{ completed: 12, total: 45, todo: 10, backlog: 5, review: 8 }}
                        compact
                        team={project?.members || []}
                        activities={[
                          { text: "Update Documentation", time: "2h ago" },
                          { text: "Fix login bug", time: "5h ago" },
                          { text: "Deployed to production", time: "1d ago" },
                          { text: "New task created", time: "1d ago" },
                        ]}
                        allTasks={[]}
                        deadline={project?.deadline || "Dec 2025"}
                        pendingRequests={[]}
                        projectStatus={project?.status}
                        isOwner={false}
                      />
                    </div>

                    {/* Overlay Layer */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 bg-white/10 dark:bg-black/20">
                      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-full shadow-lg mb-4 border border-[#E2E1DB] dark:border-[#333]">
                        <AlertCircle className="w-6 h-6 text-[#D94F04]" />
                      </div>
                      <h3 className="text-lg font-bold text-[#2B2B2B] dark:text-white mb-2 shadow-sm">Private Activity</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs mb-4 font-medium">
                        Join the project to view team activity, tasks, and progress.
                      </p>
                      <button
                        onClick={handleRequestJoin}
                        disabled={joinStatus === 'pending'}
                        className="px-5 py-2 bg-[#D94F04] text-white text-sm font-bold rounded-lg shadow-md hover:bg-[#bf4404] transition hover:shadow-lg"
                      >
                        {joinStatus === 'pending' ? 'Request Sent' : 'Join to Access'}
                      </button>
                    </div>
                  </>
                ) : (
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
                    allTasks={tasks}
                    deadline={project?.deadline
                      ? new Date(project.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : "No Deadline"}
                    pendingRequests={pendingRequests}
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    projectStatus={project?.status}
                    isOwner={project?.ownerUid === currentUser?.uid}
                    onArchive={async () => {
                      if (!project) return;
                      if (window.confirm("Archive project?")) {
                        await updateDocument("collaborations", project.id, { status: "archived" });
                        alert("Archived");
                        navigate("/workspace");
                      }
                    }}
                    onComplete={async () => {
                      if (!project) return;
                      if (window.confirm("Complete project?")) {
                        await updateDocument("collaborations", project.id, { status: "completed" });
                        alert("Completed");
                      }
                    }}
                    onDelete={async () => {
                      if (!project) return;
                      if (window.confirm("Delete project?")) {
                        await deleteDocument("collaborations", project.id);
                        alert("Deleted");
                        navigate("/workspace");
                      }
                    }}
                    onLeave={async () => {
                      if (!project) return;
                      if (window.confirm("Leave project?")) {
                        const members = project.members.filter(m => m.uid !== currentUser.uid);
                        const ids = project.memberIds.filter(id => id !== currentUser.uid);
                        await updateDocument("collaborations", project.id, { members, memberIds: ids });
                        alert("Left project");
                        navigate("/workspace");
                      }
                    }}
                  />
                )}
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
