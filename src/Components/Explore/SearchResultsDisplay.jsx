import React, { useState } from "react";
import { X } from "lucide-react"

export default function SearchResultsDisplay({ query, results, onClose }) {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 rounded-2xl border border-neutral-800 max-w-4xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Search Results</h2>
            <p className="text-sm text-neutral-400 mt-1">for "{query}"</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 flex gap-2">
          {["projects", "members", "teams"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab
                  ? "bg-orange-600 text-white"
                  : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 text-xs opacity-70">
                ({results[tab].length})
              </span>
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-12rem)]">
          {/* Projects */}
          {activeTab === "projects" && (
            <div className="space-y-3">
              {results.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-neutral-950/50 backdrop-blur-sm rounded-xl border border-neutral-800 hover:border-orange-500/50 p-4 cursor-pointer transition-all hover:translate-x-1 group"
                >
                  <h3 className="font-bold mb-2 group-hover:text-orange-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-neutral-400 mb-3">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {project.stack.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">
                      {project.teamSize} members
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Members */}
          {activeTab === "members" && (
            <div className="space-y-3">
              {results.members.map((member) => (
                <div
                  key={member.id}
                  className="bg-neutral-950/50 backdrop-blur-sm rounded-xl border border-neutral-800 hover:border-orange-500/50 p-4 cursor-pointer transition-all hover:translate-x-1 group flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-lg font-bold">
                    {member.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-orange-400 transition-colors">
                      {member.name}
                    </h3>

                    <div className="flex gap-2 mt-2">
                      {member.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-xs bg-neutral-800 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-neutral-400">Credibility</div>
                    <div className="text-xl font-bold text-orange-400">
                      {member.credibility}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teams */}
          {activeTab === "teams" && (
            <div className="space-y-3">
              {results.teams.map((team) => (
                <div
                  key={team.id}
                  className="bg-neutral-950/50 backdrop-blur-sm rounded-xl border border-neutral-800 hover:border-orange-500/50 p-4 cursor-pointer transition-all hover:translate-x-1 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg group-hover:text-orange-400 transition-colors">
                      {team.name}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        team.availability === "high"
                          ? "bg-green-500/20 text-green-400"
                          : team.availability === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {team.availability === "high"
                        ? "Hiring"
                        : team.availability === "medium"
                        ? "Limited"
                        : "Full"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {team.expertise.map((exp, i) => (
                        <span
                          key={i}
                          className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs text-neutral-500">
                      {team.members} members
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
