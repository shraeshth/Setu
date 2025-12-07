import React from "react";
import { Users, FolderKanban, BarChart3 } from "lucide-react";

export default function ProfileStatsDisplay({ profile }) {
  return (
    <div className="p-4 rounded-xl bg-[#FCFCF9] dark:bg-[#2B2B2B]
                    border border-[#E2E1DB] dark:border-[#3A3A3A] flex flex-col gap-4">

      <p className="font-medium text-sm">Profile Stats</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-[#D94F04]" />
          <span>{profile.projects || 0} Projects</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#D94F04]" />
          <span>{profile.connections || 0} Connections</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <BarChart3 className="w-4 h-4 text-[#D94F04]" />
        <span className="text-sm font-medium">Credibility Score: {profile.credibilityScore || profile.credibility || "—"}</span>
      </div>

    </div>
  );
}
