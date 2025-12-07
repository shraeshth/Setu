import React, { useState } from "react";

const UserAvatar = ({ member }) => {
  const [imgError, setImgError] = useState(false);
  const firstChar = member?.name?.trim()?.charAt(0)?.toUpperCase() || "?";
  const imgSrc = member.avatar || member.photoURL;

  if (imgSrc && !imgError) {
    return (
      <img
        src={imgSrc}
        alt={member.name}
        className="w-full h-full rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span className="text-sm font-medium text-[#2B2B2B] dark:text-[#F9F8F3]">
      {firstChar}
    </span>
  );
};

export default function TeamStack({ members = [] }) {
  if (!Array.isArray(members)) members = [];

  const visible = members.slice(0, 5);
  const count = members.length;

  return (
    <div className="flex items-center justify-between w-full">

      {/* LEFT: Avatar Stack */}
      <div className="flex items-center -space-x-3">
        {visible.map((m, i) => {
          return (
            <div
              key={m.id || m.uid || i}
              className="
                w-9 h-9 rounded-full border-2 border-white dark:border-[#121212]
                bg-gray-200 dark:bg-[#2B2B2B]
                flex items-center justify-center
                overflow-hidden
              "
              title={m.name || "User"}
            >
              <UserAvatar member={m} />
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
