// ActivitySidebar.jsx
import React from "react";
import TeamStack from "./TeamStack";
import TimeInvestedCard from "./TimeInvestedCard";
import { useFirestore } from "../../Hooks/useFirestore";

import { ChevronDown, Archive, CheckCircle, Trash2, UserPlus, X, Check, UserMinus, Plus } from "lucide-react";

export default function ActivitySidebar({
  progress = {},
  compact = false,
  team = [],
  activities = [],
  onArchive,
  onComplete,
  onDelete,
  onLeave,
  isOwner,
  projectStatus,
  pendingRequests = [],
  onAcceptRequest,
  onRejectRequest,
  allTasks = [],
  deadline,
  onNewTask
}) {
  const [showDoneOptions, setShowDoneOptions] = React.useState(false);

  // Calculate Chart Data (Kanban Status Counts)
  const chartData = React.useMemo(() => {
    if (!allTasks || allTasks.length === 0) return [0, 0, 0, 0];

    // Status mapping: [Backlog, To Do, In Progress, Completed]
    const counts = [0, 0, 0, 0];

    allTasks.forEach(task => {
      const s = (task.status || '').toLowerCase();
      if (s === 'backlog') counts[0]++;
      else if (s === 'todo' || s === 'to-do') counts[1]++;
      else if (s === 'in progress' || s === 'inprogress' || s === 'review') counts[2]++;
      else if (s === 'done' || s === 'completed') counts[3]++;
      else counts[1]++; // Default to Todo
    });
    return counts;
  }, [allTasks]);

  const avgPace = React.useMemo(() => {
    const totalTasks = chartData.reduce((acc, curr) => acc + curr, 0);
    return (totalTasks / 7).toFixed(1);
  }, [chartData]);
  // You declared a mock project but weren't using it correctly
  const mockProject = {
    id: "project-1",
    name: "AI Resume Builder",
    owner: "John Doe",
    members: [
      { id: "1", name: "John Doe", avatar: "" },
      { id: "2", name: "Jane Smith", avatar: "" },
      { id: "3", name: "Alice Johnson", avatar: "" },
      { id: "4", name: "Michael Chen", avatar: "" },
      { id: "5", name: "Sarah Park", avatar: "" }
    ]
  };

  const { getCollection } = useFirestore();
  const [enrichedTeam, setEnrichedTeam] = React.useState([]);

  React.useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!team || team.length === 0) {
        setEnrichedTeam([]);
        return;
      }

      try {
        // Extract IDs. Handle both 'uid' (from project creation) and 'id' (standard)
        const memberIds = team.map(m => m.uid || m.id).filter(Boolean);

        if (memberIds.length === 0) {
          setEnrichedTeam(team);
          return;
        }

        // Fetch all users to find matches (simplest for now, or use 'in' query if < 30)
        // Using getCollection("users") might be heavy if many users, but for now it's safe.
        // Better: Fetch specific users if possible, or just rely on the fact we need to show them.
        // Let's try to fetch all users and filter client side for this fix to be robust against "in" query limits
        // In a real app with thousands of users, we'd batch fetch by ID.
        const allUsers = await getCollection("users");

        const updatedMembers = team.map(member => {
          const uid = member.uid || member.id;
          const freshUser = allUsers.find(u => u.id === uid);
          if (freshUser) {
            return {
              ...member,
              name: freshUser.displayName || freshUser.name || member.name,
              photoURL: freshUser.photoURL || member.photoURL || member.avatar,
              avatar: freshUser.photoURL || member.photoURL || member.avatar // Ensure compatibility
            };
          }
          return member;
        });

        setEnrichedTeam(updatedMembers);
      } catch (err) {
        console.error("Error fetching member details:", err);
        setEnrichedTeam(team);
      }
    };

    fetchMemberDetails();
  }, [team, getCollection]);

  // Decide whether to use enriched team or mock fallback
  const finalTeam = enrichedTeam.length > 0 ? enrichedTeam : (team.length > 0 ? team : mockProject.members);

  return (
    <div className="flex flex-col h-full ">




      <TimeInvestedCard
        completed={progress.completed || 0}
        total={progress.total || 0}
        chartData={chartData}
        deadline={deadline}
        avgTime={avgPace}
      />

      {/* Recent Activity */}
      <div className="mt-4 mb-6 rounded-xl bg-white dark:bg-[#121212] p-4 border border-[#E2E1DB] dark:border-[#2B2B2B] relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-500 dark:text-gray-400">Recent Tasks</div>
          <button
            onClick={onNewTask}
            className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 dark:bg-[#333] hover:bg-gray-200 dark:hover:bg-[#444] text-gray-600 dark:text-gray-300 transition-colors"
            title="Add Task"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 text-[13px] max-h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          {activities && activities.length > 0 ? (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between group">
                <div className="line-clamp-1 pr-2 w-full text-[#2B2B2B] dark:text-[#F9F8F3]">
                  {activity.text}
                </div>
                <div className="text-[10px] text-gray-400 whitespace-nowrap">{activity.time}</div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic">No recent activity</div>
          )}
          {/* Scroll padding at bottom */}
          <div className="h-4"></div>
        </div>

        {/* Blur Gradient Overlay */}
        <div className="absolute bottom-1 left-1 right-1 h-8 bg-gradient-to-t from-white via-white/80 to-transparent dark:from-[#121212] dark:via-[#121212]/80 pointer-events-none rounded-b-xl z-10" />
      </div>
      {/* DONE WITH PROJECT BUTTON */}
      <div className="mt-auto mb-4 relative">
        {(projectStatus === "completed" || projectStatus === "archived") ? (
          <div className="flex items-center justify-between bg-[#F3F2EE] dark:bg-[#1A1A1A] rounded-lg p-1 border border-[#E2E1DB] dark:border-[#333]">
            <div className="px-3 text-sm font-medium text-[#2B2B2B] dark:text-gray-200 capitalize">
              {projectStatus}
            </div>
            <button
              onClick={() => {
                if (projectStatus === "completed") onArchive && onArchive();
                else onComplete && onComplete();
              }}
              className="px-3 py-1.5 bg-[#2B2B2B] dark:bg-[#F9F8F3] text-white dark:text-[#2B2B2B] 
                         rounded-md text-xs font-medium hover:opacity-90 transition-opacity"
            >
              {projectStatus === "completed" ? "Archive" : "Complete"}
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowDoneOptions(!showDoneOptions)}
              className="w-full py-2 bg-[#2B2B2B] dark:bg-[#F9F8F3] text-white dark:text-[#2B2B2B] 
                         rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <span>Done with Project</span>
              <ChevronDown size={14} className={`transition-transform ${showDoneOptions ? "rotate-180" : ""}`} />
            </button>

            {showDoneOptions && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white dark:bg-[#1A1A1A] 
                              border border-[#E2E1DB] dark:border-[#333] rounded-lg shadow-lg overflow-hidden z-10">
                <button
                  onClick={() => {
                    onArchive && onArchive();
                    setShowDoneOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-[#2B2B2B] dark:text-gray-200 
                             hover:bg-[#F5F4F0] dark:hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                  <Archive size={14} />
                  Archive
                </button>
                <button
                  onClick={() => {
                    onComplete && onComplete();
                    setShowDoneOptions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-[#2B2B2B] dark:text-gray-200 
                             hover:bg-[#F5F4F0] dark:hover:bg-[#333] transition-colors flex items-center gap-2"
                >
                  <CheckCircle size={14} />
                  Complete
                </button>
                <div className="border-t border-[#E2E1DB] dark:border-[#333] my-1"></div>

                {isOwner ? (
                  <button
                    onClick={() => {
                      onDelete && onDelete();
                      setShowDoneOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
                               transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Delete Project
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLeave && onLeave();
                      setShowDoneOptions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 
                               transition-colors flex items-center gap-2"
                  >
                    <UserMinus size={14} />
                    Leave Project
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* TEAM STACK */}
      <div className="h-auto overflow-auto">

        <TeamStack members={finalTeam} />
      </div>

    </div>
  );
}
