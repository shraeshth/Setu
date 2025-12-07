import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader, Target } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useFirestore } from "../../Hooks/useFirestore";
import { useAuth } from "../../Contexts/AuthContext";
import { ALL_SKILLS } from "../../utils/skillsData";
import { where } from "firebase/firestore";

export default function ProjectFeed() {
  const { getCollection, addDocument } = useFirestore();
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [requestedProjectIds, setRequestedProjectIds] = useState([]);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Fetch projects
        const data = await getCollection("collaborations");

        // Filter out projects associated with the current user (owner or member) AND completed/archived projects
        const filteredData = data.filter(p => {
          if (p.status === 'completed' || p.status === 'archived') return false; // Hide completed/archived

          if (!currentUser) return true; // Show all if not logged in
          const isOwner = (p.createdBy === currentUser.uid) || (p.ownerId === currentUser.uid);
          const isMember = p.members?.some(m => (typeof m === 'string' ? m : m.uid) === currentUser.uid) || p.memberIds?.includes(currentUser.uid);
          return !isOwner && !isMember;
        });

        // Map to display format
        const formattedProjects = filteredData.map(p => {
          // Dynamic Status Logic
          let dynamicStatus = "In Progress";
          if (p.createdAt) {
            const created = new Date(p.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 3) dynamicStatus = "Hiring";
          }

          // Find owner name from members
          let ownerName = "Unknown";
          if (p.members && Array.isArray(p.members)) {
            const owner = p.members.find(m => (m.uid || m.id) === p.createdBy);
            if (owner) {
              ownerName = owner.name || owner.displayName || "Unknown";
            }
          }

          return {
            id: p.id,
            title: p.title,
            category: p.category || "General",
            type: p.type || "Project",
            owner: ownerName,
            ownerUid: p.createdBy || p.ownerId, // Preserve for notifications
            credibility: p.credibilityScore || "N/A",
            priority: p.priority || "Medium",
            description: p.description,
            openRoles: p.openRoles || [],
            requiredSkills: p.requiredSkills || [],
            applicants: p.applicantCount || 0,
            duration: p.duration || "Unknown",
            updated: "Recently", // Simplified
            status: dynamicStatus, // Overridden dynamic status
          };
        });

        setProjects(formattedProjects);
      } catch (err) {
        console.error("Error fetching project feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [getCollection, currentUser]);

  /* ----- Dark Mode Watcher ----- */
  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();

    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true });

    return () => obs.disconnect();
  }, []);

  /* ----- Fetch User's Existing Requests ----- */
  useEffect(() => {
    if (!currentUser) return;
    const fetchRequests = async () => {
      try {
        const reqs = await getCollection("project_requests", [
          where("requesterId", "==", currentUser.uid)
        ]);
        setRequestedProjectIds(reqs.map(r => r.projectId));
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchRequests();
  }, [currentUser, getCollection]);

  /* ----- Auto Slide Every 5 Seconds ----- */
  useEffect(() => {
    if (projects.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [projects.length]);

  const handleJoinProject = async (project) => {
    if (!currentUser) {
      alert("Please login to join projects");
      return;
    }
    if (joiningId) return;

    setJoiningId(project.id);
    try {
      // 1. Create Request
      await addDocument("project_requests", {
        projectId: project.id,
        projectTitle: project.title,
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName || currentUser.email,
        ownerId: project.ownerUid, // Fixed: Use the correctly mapped ownerUid
        status: "pending",
        createdAt: new Date().toISOString()
      });

      // 2. Create Notification for Owner
      // Use the raw fields from project object if needed, or the formatted 'project' prop? 
      // Note: 'project' passed here is from 'projects' state which has formatted fields. 
      // But 'project.owner' in state is just a name string.
      // I need the owner UID.
      // Wait, 'formattedProjects' in fetchProjects map didn't preserve ownerUid!
      // I must update the map function to preserve 'ownerUid'. 
      // FOR NOW: I'll assume I need to fix the map function first or rely on backend triggers.
      // Let's check the map function. 
      // In previous edits I filtered by `p.createdBy` or `p.ownerId`.
      // I should add `ownerUid: p.createdBy || p.ownerId` to the state object.

      // I'll update the button to pass the current project object. 
      // And I'll update the map function in a separate edit to ensure `ownerUid` is there.
      // For now, I'll access it as `project.ownerUid`.

      if (project.ownerUid) {
        await addDocument("notifications", {
          type: "project_request",
          message: `${currentUser.displayName || "Someone"} requested to join ${project.title}`,
          userUid: project.ownerUid, // Receiver
          senderId: currentUser.uid,
          projectId: project.id,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }

      // 3. Update State
      setRequestedProjectIds(prev => [...prev, project.id]);
      alert("Request sent successfully!");

    } catch (err) {
      console.error("Error joining project:", err);
      alert("Failed to send request.");
    } finally {
      setJoiningId(null);
    }
  };

  const nextCard = () =>
    setCurrentIndex((i) => (i + 1) % projects.length);

  const prevCard = () =>
    setCurrentIndex((i) => (i - 1 + projects.length) % projects.length);

  if (loading) {
    return <div className="flex justify-center p-10"><Loader className="animate-spin text-orange-500" /></div>;
  }

  if (projects.length === 0) {
    return <div className="p-5 text-center text-gray-500">No projects found.</div>;
  }

  const current = projects[currentIndex];

  return (
    <div className="flex items-center justify-center px-0">
      <div className="w-full max-w-sm">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-200">
            Find Projects
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={prevCard}
              className="w-8 h-8 flex items-center justify-center rounded-full 
              hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
            >
              <ChevronLeft className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
            </button>

            <button
              onClick={nextCard}
              className="w-8 h-8 flex items-center justify-center rounded-full 
              hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
            >
              <ChevronRight className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
            </button>
          </div>
        </div>

        {/* CARD */}
        <div
          className="relative w-full h-[380px] rounded-xl 
          bg-[#FCFCF9] dark:bg-[#2B2B2B] 
          border border-[#E2E1DB] dark:border-[#3A3A3A]
          overflow-hidden"
        >

          {/* ORANGE TOP */}
          <div
            className="relative w-full min-h-[100px] 
            bg-gradient-to-br from-[#D94F04] to-[#E86C2E] py-4 px-6 rounded-xl overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 rounded-xl outline outline-1 outline-white/20 z-10"></div>

            {/* Background Overflow Icon */}
            <div className="absolute right-3 -bottom-7 text-white/10  pointer-events-none z-0">
              <LucideIcons.Package size={100} strokeWidth={1} />
            </div>

            <div className="flex justify-between items-start relative z-10">
              <p className="text-white text-[11px] opacity-80 uppercase tracking-wide">
                {current.category}
              </p>

              <p className="text-white text-[11px] opacity-80 uppercase tracking-wide">
                {current.priority} Priority
              </p>
            </div>

            <p className="text-[12px] font-semibold text-white">{current.type}</p>
          </div>

          {/* INFO PANEL */}
          <div
            className="relative bg-[#FCFCF9] dark:bg-[#2B2B2B] 
            px-4 pt-4 pb-4 flex flex-col 
            -mt-6 rounded-xl 
            h-[calc(380px-100px)]"
          >

            {/* TITLE */}
            <h3 className="text-[#2B2B2B] dark:text-white text-base font-semibold leading-tight">
              {current.title}
            </h3>

            <p className="text-[11px] text-[#777] dark:text-gray-400 mb-1">
              {current.owner}
            </p>

            {/* DESCRIPTION */}
            <p
              className="text-[#555] dark:text-gray-400 text-xs leading-relaxed mb-3 overflow-hidden"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {current.description}
            </p>

            {/* ROLES + SKILLS */}
            <div className="grid grid-cols-2 gap-4 mb-4 flex-shrink-0">

              {/* ROLES */}
              <div>
                <p className="text-[#2B2B2B] dark:text-gray-200 text-[11px] mb-1 font-medium">
                  Open Roles
                </p>

                <div className="flex flex-col gap-1.5">
                  {current.openRoles.map((role) => (
                    <span
                      key={role}
                      className="relative px-2 py-1 text-[10px] 
                      text-[#2B2B2B] dark:text-gray-200
                      rounded-lg border border-[#E2E1DB]/40 dark:border-white/10
                      bg-white/40 dark:bg-white/5
                      backdrop-blur-sm overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/15 to-transparent dark:from-[#D94F04]/20 pointer-events-none"></span>
                      <span className="relative">{role}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* SKILLS ICONS */}
              <div>
                <p className="text-[#2B2B2B] dark:text-gray-200 text-[11px] mb-1 font-medium">
                  Skills
                </p>

                <div className="grid grid-cols-3 gap-2 justify-items-center items-center">
                  {current.requiredSkills.map((skillName) => {
                    const skill = ALL_SKILLS.find(s => s.name === skillName);
                    if (!skill) return null;

                    const IconComp =
                      skill.icon?.type === "lucide"
                        ? LucideIcons[skill.icon.name] ||
                        LucideIcons[skill.icon.fallback] ||
                        LucideIcons.Circle
                        : LucideIcons[skill.icon?.fallback] || LucideIcons.Circle;

                    return (
                      <div
                        key={skillName}
                        className="w-full h-full flex items-center justify-center"
                      >
                        <IconComp
                          size={18}
                          className="text-[#2B2B2B] dark:text-white"
                          title={skillName}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>


            </div>

            {/* PROGRESS BAR */}
            <div className="w-full h-[6px] bg-[#E2E1DB]/30 dark:bg-white/10 rounded-full overflow-hidden mt-auto shrink-0">
              <div
                className="h-full bg-gradient-to-r from-[#D94F04] to-[#E86C2E]"
                style={{ width: "30%" }}
              ></div>
            </div>

            {/* FOOTER + JOIN BUTTON */}
            <div className="flex items-center justify-between pt-3">
              <p className="text-[#2B2B2B] dark:text-white text-sm font-medium">
                {current.duration}
                <br />
                <span className="opacity-80 text-xs font-thin">Duration</span>
              </p>

              <div className="text-right">
                <p className="text-[#2B2B2B] dark:text-white text-sm font-semibold">
                  {current.status}
                </p>
                <p className="text-[#8A877C] dark:text-gray-400 text-[10px]">
                  {current.applicants} applicants
                </p>
              </div>
            </div>

            {/* JOIN PROJECT */}
            <button
              onClick={() => handleJoinProject(current)}
              disabled={requestedProjectIds.includes(current.id) || joiningId === current.id}
              className={`
                mt-2 w-full text-center 
                text-white text-xs font-medium 
                py-2 rounded-full transition
                ${requestedProjectIds.includes(current.id)
                  ? "bg-gray-400 cursor-not-allowed dark:bg-gray-700"
                  : "bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04]"}
              `}
            >
              {joiningId === current.id ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader size={14} className="animate-spin" /> Sending...
                </span>
              ) : requestedProjectIds.includes(current.id) ? (
                "Request Sent"
              ) : (
                "Join The Project"
              )}
            </button>

          </div>
        </div>

        {/* DOTS */}
        <div className="flex justify-center gap-1.5 mt-4">
          {projects.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === currentIndex
                ? "w-6 bg-[#2B2B2B] dark:bg-white"
                : "w-1.5 bg-[#E2E1DB] dark:bg-[#333]"
                }`}
            ></div>
          ))}
        </div>

      </div>
    </div>
  );
}