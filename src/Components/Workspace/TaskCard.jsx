import React from "react";
import {
  Clock,
  Tag,
  Play,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  UserPlus,
  UserCheck,
} from "lucide-react";

export default function TaskCard({
  task,
  onClick = () => { },
  onMove = () => { },
}) {
  const status = task.status;

  const getActionConfig = () => {
    switch (status) {
      case "backlog":
        return {
          label: "Let's Do",
          icon: Play,
          nextStatus: "todo",
          color: "bg-blue-500 hover:bg-blue-600",
        };
      case "todo":
        return {
          label: "Done",
          icon: CheckCircle,
          nextStatus: "review",
          color: "bg-green-500 hover:bg-green-600",
        };
      case "review":
        return { type: "dual" };
      case "completed":
        return null;
      default:
        return null;
    }
  };

  const action = getActionConfig();

  return (
    <div className="cursor-pointer mb-0" onClick={onClick} >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h6 className="text-sm font-semibold">{task.title}</h6>
          <p className="text-xs mt-1">{task.description?.slice(0, 80)}</p>

          <div className="mt-2 flex items-center gap-1 text-xs">
            <Tag className="w-3 h-3" />
            {task.category || "General"}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs">
            <Clock className="inline-block w-3 h-3 mr-1" />
            {task.dueDate}
          </div>

          <div className="mt-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-medium
                ${task.priority === "high"
                  ? "bg-red-100 text-red-700 dark:bg-[#D94F04]/20 dark:text-[#D94F04]"
                  : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400"
                    : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                }`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-col text-xs gap-1">
          <span className="flex items-center gap-1">
            <UserPlus className="w-3 h-3" />
            {task.creator?.name || "Unknown"}
          </span>

          <span className="flex items-center gap-1">
            <UserCheck className="w-3 h-3" />
            {task.assignee?.name || "Unassigned"}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-10">
          {action?.type === "dual" ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task.id, "completed");
                }}
                className="text-xs text-white bg-green-500 px-2 py-1 rounded-md"
              >
                <ThumbsUp className="w-3 h-3" /> Pass
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(task.id, "todo");
                }}
                className="text-xs text-white bg-red-500 px-2 py-1 rounded-md"
              >
                <ThumbsDown className="w-3 h-3" /> Fail
              </button>
            </div>
          ) : action ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMove(task.id, action.nextStatus);
              }}
              className={`text-xs text-white px-2 py-1 rounded-md flex items-center gap-1 ${action.color}`}
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </button>
          ) : status === "completed" ? (
            <span className="text-xs text-green-600 font-medium">
              ✓ Completed
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
