import React from "react";

import ReviewHighlights from "./ReviewHighlights.jsx";
import NewProjectsThisWeek from "./NewProjectsThisWeek.jsx";
import ExploreBySkillsIcons from "./ExploreBySkillsIcons.jsx";
import PairMeWithATeamButton from "./PairMeWithATeamButton.jsx";
import NetworkCredibilityStats from "./NetworkCredibilityStats.jsx";
import Leaderboard from "./LeaderBoardsStats.jsx";


export default function LayoutBento() {
  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4 overflow-hidden">

      {/* ============================
          BLOCK 1 (Top Left): Stats & Projects
      ============================= */}
      <div className="flex flex-col gap-4 h-full overflow-hidden min-h-0">
        {/* Top: Credibility */}
        <div className="flex-1 rounded-xl overflow-hidden min-h-0">
          <NetworkCredibilityStats />
        </div>
        {/* Bottom: Recent Projects */}
        <div className="flex-[1.5] rounded-xl overflow-hidden min-h-0">
          <NewProjectsThisWeek />
        </div>
      </div>

      {/* ============================
          BLOCK 2 (Top Right): Skills
      ============================= */}
      <div className="rounded-xl overflow-hidden h-full min-h-0">
        <ExploreBySkillsIcons />
      </div>

      {/* ============================
          BLOCK 3 (Bottom Left): Pair Me
      ============================= */}
      <div className="rounded-xl overflow-hidden h-full min-h-0">
        <PairMeWithATeamButton />
      </div>

      {/* ============================
          BLOCK 4 (Bottom Right): Leaderboard
      ============================= */}
      <div className="rounded-xl overflow-hidden h-full min-h-0">
        <Leaderboard />
      </div>

    </div>
  );
}
