import React from "react";
import { Plus, Trash } from "lucide-react";

export default function GenericTileDisplay({
  title,
  icon: Icon,
  data = [],
  onAdd,
  onDelete,
  max = 3,
}) {
  const items = Array.isArray(data) ? data : [];
  const canAdd = items.length < max;

  return (
    <div className="p-3 rounded-xl bg-[#FCFCF9] dark:bg-[#2B2B2B]
                    border border-[#E2E1DB] dark:border-[#3A3A3A]">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[#D94F04]" />
          <p className="font-medium text-sm">{title}</p>
        </div>

        <button
          onClick={onAdd}
          disabled={!canAdd}
          className={`inline-flex items-center gap-2 px-1 py-1 rounded-full text-xs font-medium transition
            ${canAdd ? "bg-[#D94F04] text-white" 
                     : "bg-gray-200 dark:bg-[#333] text-gray-500 cursor-not-allowed"}`}
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* TILES */}
      <div className="space-y-0">
        {items.length === 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">No entries yet</p>
        )}

        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-start
                       border-b border-[#E2E1DB] dark:border-[#2B2B2B]
                       rounded-xl px-2 py-2"
          >
            <div className="min-w-0">
              <p className="font-semibold text-sm text-[#2B2B2B] dark:text-white truncate">
                {item.title}
              </p>

              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {item.subtitle || item.description || ""}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              {item.duration && (
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {item.duration}
                </span>
              )}

              <button
                onClick={() => onDelete(i)}
                className="w-3 h-3 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900 transition"
              >
                <Trash className="w-2.5 h-2.5 text-red-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
