import React from "react";

export default function NetworkCredibilityStats() {

  const topUsers = [
    { name: 'Alice Chen', points: 1247, credibility: 95 },
    { name: 'Bob Kumar', points: 1198, credibility: 92 },
    { name: 'Carol Zhang', points: 1156, credibility: 90 },
    { name: 'David Lee', points: 1089, credibility: 88 },
    { name: 'Eva Martinez', points: 1024, credibility: 86 }
  ];

  return (
    <div className="h-full bg-neutral-900/50 backdrop-blur-xl rounded-2xl 
      border border-neutral-800 p-4">

      <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 
          bg-clip-text text-transparent">
        6,135
      </div>
      <div className="text-sm text-neutral-400 mt-2">
        Community Collaboration Points
        <br />
        Earned This Week
      </div>
    </div>
  );
}
