import React from "react";

import ReviewHighlights from "./ReviewHighlights.jsx";
import NewProjectsThisWeek from "./NewProjectsThisWeek.jsx";
import ExploreBySkillsIcons from "./ExploreBySkillsIcons.jsx";
import PairMeWithATeamButton from "./PairMeWithATeamButton.jsx";
import NetworkCredibilityStats from "./NetworkCredibilityStats.jsx";
import Leaderboard from "./LeaderBoardsStats.jsx";

export default function LayoutBento() {
  const topUsers = [
    { name: "Alice Chen", points: 1247, credibility: 95 },
    { name: "Bob Kumar", points: 1198, credibility: 92 },
    { name: "Carol Zhang", points: 1156, credibility: 90 }
  ];

  return (
    <div className="w-full max-h-screen overflow-hidden grid grid-cols-2 grid-rows-2 gap-4">

      {/* ============================
          TOP LEFT (complex block)
      ============================= */}
      <div className="grid grid-cols-1 grid-rows-2 gap-4 h-full">

        {/* RIGHT TOP: Credibility */}
        <div className="col-span-2 row-span-1 rounded-xl overflow-hidden">
          <NetworkCredibilityStats />
        </div>

        {/* RIGHT BOTTOM: Recent Projects */}
        <div className="col-span-2 row-span-1 rounded-xl overflow-hidden">
          <NewProjectsThisWeek />
        </div>
      </div>

      {/* ============================
          TOP RIGHT — Skills (big)
      ============================= */}
      <div className="rounded-xl overflow-hidden h-full">
        <ExploreBySkillsIcons />
      </div>

      {/* ============================
          BOTTOM LEFT — Pair Me
      ============================= */}
      <div className="rounded-xl overflow-hidden h-full">
        <PairMeWithATeamButton />
      </div>

      {/* ============================
          BOTTOM RIGHT — Leaderboard
      ============================= */}
      <div className="rounded-xl overflow-hidden h-full">
        <Leaderboard topUsers={topUsers} />
      </div>

    </div>
  );
}
