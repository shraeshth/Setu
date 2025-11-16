import React, { useState } from "react";
import { Clock, Tag, Trash2, Star } from "lucide-react";

export default function TaskCard({
  task,
  section = "",
  onClick = () => {},
  onDone = () => {},
  onDelete = () => {},
  onRate = () => {},
}) {
  const [rating, setRating] = useState(task.rating || 0);

  const handleRating = (value) => {
    setRating(value);
    onRate(task.id, value);
  };

  return (
    <div className="cursor-pointer">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h6
            className="text-sm font-semibold text-[#2B2B2B] dark:text-[#F9F8F3]"
            onClick={onClick}
          >
            {task.title}
          </h6>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {task.description?.slice(0, 80)}
          </p>

          {/* Category */}
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
            <Tag className="w-3 h-3" />
            {task.category || "General"}
          </div>
        </div>

        <div className="text-right">
          {/* Due Date */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <Clock className="inline-block w-3 h-3 mr-1" />
            {task.dueDate}
          </div>

          {/* Priority */}
          <div className="mt-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] ${
                task.priority === "high"
                  ? "bg-red-100 text-red-700"
                  : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400">
          {/* Creator */}
          <span>
            Added by:{" "}
            <span className="font-medium text-[#2B2B2B] dark:text-[#F9F8F3]">
              {task.creator?.name || "Unknown"}
            </span>
          </span>

          {/* Assignee */}
          <span>
            Assigned to:{" "}
            <span className="font-medium text-[#2B2B2B] dark:text-[#F9F8F3]">
              {task.assignee?.name || "Unassigned"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Section-specific action */}
          {section === "review" ? (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`w-4 h-4 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-400"
                  }`}
                />
              ))}
            </div>
          ) : (
            <button
              onClick={() => onDone(task.id)}
              className="text-xs text-[#2B2B2B] dark:text-gray-200 bg-[#F3F3F3] dark:bg-[#1A1A1A] px-2 py-1 rounded-md"
            >
              Done
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded-md bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
