import React from "react";
import WelcomeSection from "../Components/Home/WelcomeSection";
import TeamFeed from "../Components/Home/TeamFeed";
import MiniFeed from "../Components/Home/MiniFeed";
import ProjectFeed from "../Components/Home/ProjectFeed";
import ReviewFeed from "../Components/Home/ReviewFeed";

export default function Home() {
  return (
    <div className="max-h-screen w-full flex flex-col font-gilroy text-[#2B2B2B] dark:text-gray-100 px-6 py-0 overflow-hidden">

      {/* Welcome Section (fixed height) */}
      <div className="h-[100px] w-full">
        <WelcomeSection username="Shreshth" />
      </div>

      {/* Mini Community Feed (fixed height) */}
      <div className="h-[170px] shrink-0 mt-0">
        <h2 className="text-lg font-semibold mb-3">Community Feed</h2>
        <MiniFeed />
      </div>

      {/* 3 Column Dashboard (flexes to full remaining height) */}
      <div className="flex-1 flex gap-4 min-h-0">

        {/* TEAM FEED */}
        <div className="flex-1 bg-transparent rounded-xl overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin">
            <TeamFeed />
          </div>
        </div>

        {/* PROJECT FEED */}
        <div className="flex-1 bg-transparent rounded-xl overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin">
            <ProjectFeed />
          </div>
        </div>

        {/* REVIEW FEED */}
        <div className="flex-1 bg-transparent rounded-xl overflow-hidden">
          <div className="h-full overflow-y-auto pr-2 scrollbar-thin">
            <ReviewFeed />
          </div>
        </div>

      </div>
    </div>
  );
}
