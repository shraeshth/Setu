import React from "react";

export default function TeamStack({ members = [] }) {
  if (!Array.isArray(members)) members = [];

  const visible = members.slice(0, 5);
  const count = members.length;

  return (
    <div className="flex items-center justify-between w-full">
      
      {/* LEFT: Avatar Stack */}
      <div className="flex items-center -space-x-3">
        {visible.map((m, i) => {
          const firstChar = m?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

          return (
            <div
              key={m.id || i}
              className="
                w-9 h-9 rounded-full border-2 border-white dark:border-[#121212]
                bg-gray-200 dark:bg-[#2B2B2B]
                flex items-center justify-center text-sm font-medium
                text-[#2B2B2B] dark:text-[#F9F8F3]
                overflow-hidden
              "
              title={m.name || "User"}
            >
              {m.avatar ? (
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                firstChar
              )}
            </div>
          );
        })}

        {count > 5 && (
          <div
            className="
              w-9 h-9 rounded-full border-2 border-white dark:border-[#121212]
              bg-[#D94F04] text-white
              flex items-center justify-center text-xs font-semibold
            "
          >
            +{count - 5}
          </div>
        )}
      </div>

      {/* RIGHT: member count */}
      <div className="text-xs font-thin text-[#2B2B2B] dark:text-[#F9F8F3] ml-4">
        <span className="text-3xl">{count}</span> members
      </div>

    </div>
  );
}
