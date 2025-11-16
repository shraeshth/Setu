import React, { useState } from "react";
import LayoutBento from "../Components/Explore/LayoutBento";
import SearchResultsDisplay from "../Components/Explore/SearchResultsDisplay";

export default function Explore() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    members: [],
    projects: [],
    teams: []
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchActive(true);

    setSearchResults({
      members: [
        { id: 1, name: "Alex Chen", skills: ["React", "TypeScript", "Node.js"], credibility: 92 },
        { id: 2, name: "Sarah Kumar", skills: ["UI/UX", "Figma", "Tailwind"], credibility: 88 }
      ],
      projects: [
        { id: 1, title: "AI Dashboard Platform", description: "Analytics dashboard", stack: ["React","Python"], teamSize: 4 },
        { id: 2, title: "EdTech App", description: "Gamified learning", stack: ["Flutter","Firebase"], teamSize: 3 }
      ],
      teams: [
        { id: 1, name: "Innovation Lab", members: 8, expertise: ["AI","ML"], availability: "high" },
        { id: 2, name: "Design Studio", members: 5, expertise: ["UI/UX","Branding"], availability: "medium" }
      ]
    });
  };

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden px-6 font-gilroy">
 {/* MAIN AREA (scrollable Bento layout just like Team/Project/Review Feed columns) */}
      <div className="flex-1 min-h-0 rounded-xl overflow-hidden">
        <div className="h-full overflow-y-auto pr-2 scrollbar-thin">
          <LayoutBento />
        </div>
      </div>

      {/* SEARCH OVERLAY */}
      {searchActive && (
        <SearchResultsDisplay
          query={searchQuery}
          results={searchResults}
          onClose={() => setSearchActive(false)}
        />
      )}
    </div>
  );
}
