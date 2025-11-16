import React from "react";
import { Link } from "react-router-dom";

export default function WelcomeSection({ username }) {
  return (
    <div className="flex items-center justify-between mb-2 border-b border-[#E2E1DB] dark:border-[#333] pb-4">
      <div>
        <h1 className="text-3xl font-semibold">
          Welcome back,{" "}
          <Link
            to="/profile"
            className="text-[#2E7BE4] dark:text-[#5B9FFF] hover:underline cursor-pointer"
          >
            {username}.
          </Link>
        </h1>

        <p className="text-sm text-[#6B6A63] dark:text-gray-400">
          Let’s continue where you left off.
        </p>
      </div>
    </div>
  );
}
