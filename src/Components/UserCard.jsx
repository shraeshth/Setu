import React from "react";

export default function UserCard({ user, onConnect }) {
  return (
    <div className="p-3 bg-gray-900 border border-gray-700 rounded">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm text-gray-200">
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <div className="font-semibold">{user.displayName || user.email}</div>
          <div className="text-xs text-gray-400">{user.skills?.join(", ")}</div>
        </div>
      </div>
      <p className="text-gray-300 text-sm mb-2">{user.bio || "No bio yet."}</p>
      <button
        onClick={onConnect}
        className="bg-blue-600 hover:bg-blue-500 w-full py-1 rounded text-sm"
      >
        Connect
      </button>
    </div>
  );
}
