// components/Explore/TeamDiscoveryMap.jsx
import React from "react";

export default function TeamDiscoveryMap() {
  const teams = [
    { id: 1, name: 'AI Innovators', size: 8, expertise: 'AI', x: 20, y: 30, credibility: 95, availability: 'high' },
    { id: 2, name: 'Design Studio', size: 5, expertise: 'Design', x: 60, y: 20, credibility: 88, availability: 'medium' },
    { id: 3, name: 'Backend Crew', size: 6, expertise: 'Backend', x: 40, y: 60, credibility: 92, availability: 'high' },
    { id: 4, name: 'Frontend Masters', size: 7, expertise: 'Frontend', x: 70, y: 70, credibility: 90, availability: 'low' },
    { id: 5, name: 'Full Stack Force', size: 4, expertise: 'FullStack', x: 30, y: 80, credibility: 85, availability: 'high' },
  ];

  const colorMap = {
    Frontend: 'bg-blue-500',
    Backend: 'bg-orange-500',
    AI: 'bg-purple-500',
    Design: 'bg-green-500',
    FullStack: 'bg-pink-500'
  };

  return (
    <div className="h-full bg-neutral-900/50 backdrop-blur-xl rounded-2xl border border-neutral-800 p-6 flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Team Discovery Map</h3>

        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Frontend</span>
          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">Backend</span>
          <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded">AI</span>
        </div>
      </div>

      {/* Map Panel */}
      <div className="flex-1 relative bg-neutral-950/50 rounded-xl border border-neutral-800">
        {teams.map((team) => (
          <div
            key={team.id}
            className="absolute group cursor-pointer"
            style={{
              left: `${team.x}%`,
              top: `${team.y}%`,
              width: `${team.size * 8}px`,
              height: `${team.size * 8}px`,
              transform: "translate(-50%, -50%)"
            }}
          >
            <div
              className={`
                w-full h-full rounded-full opacity-60 group-hover:opacity-90 
                transition-all group-hover:scale-110
                ${colorMap[team.expertise]}
              `}
              style={{
                border: team.availability === 'high' ? '3px solid white' : '1px solid white'
              }}
            ></div>

            {/* Tooltip */}
            <div className="
              absolute top-full left-1/2 -translate-x-1/2 mt-2 
              opacity-0 group-hover:opacity-100 transition-opacity 
              bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap
            ">
              <div className="font-bold">{team.name}</div>
              <div>{team.size} members • {team.expertise}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
