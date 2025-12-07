import React from "react";
import * as LucideIcons from "lucide-react";
import { ALL_SKILLS } from "../../utils/skillsData";
import { Users, Briefcase, Calendar, Target, CheckCircle2, Loader } from "lucide-react";
import TeamStack from "./TeamStack";

export default function PublicProjectDetails({
    project,
    onJoin,
    isPending,
    isSending
}) {
    if (!project) return null;

    // Resolve Author Name
    const ownerId = project.ownerUid || project.createdBy;
    const authorName = project.ownerName ||
        project.members?.find(m => m.uid === ownerId)?.name ||
        "Unknown Author";

    return (
        <div className="flex flex-col h-full bg-[#FCFCF9] dark:bg-[#1A1A1A] rounded-xl border border-[#E2E1DB] dark:border-[#333] overflow-hidden shadow-sm">

            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-[#D94F04] to-[#E86C2E] relative p-5 flex flex-col justify-end shrink-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <h1 className="text-2xl font-bold text-white relative z-10 line-clamp-1">{project.title}</h1>
                <p className="text-white/80 text-xs relative z-10 mt-1">Managed by {authorName}</p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">

                {/* Description */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-white mb-2 uppercase tracking-wide opacity-80">About</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                    {/* Roles */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-white mb-3 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#D94F04]" /> Open Roles
                        </h3>
                        <div className="space-y-2">
                            {project.openRoles && project.openRoles.length > 0 ? (
                                project.openRoles.map((role, i) => (
                                    <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-[#222] rounded-lg border border-[#E2E1DB] dark:border-[#333]">
                                        <span className="text-sm font-medium text-[#2B2B2B] dark:text-gray-200">{role}</span>
                                        <span className="text-[10px] text-[#D94F04] bg-[#FFF4EC] dark:bg-[#331105] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Open</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-xs italic">No specific roles listed.</p>
                            )}
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-white mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-[#D94F04]" /> Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.requiredSkills && project.requiredSkills.map((skillName, i) => {
                                const skill = ALL_SKILLS.find(s => s.name.toLowerCase() === skillName.toLowerCase());

                                let IconComp = LucideIcons.Circle;
                                if (skill && skill.icon) {
                                    if (LucideIcons[skill.icon.name]) {
                                        IconComp = LucideIcons[skill.icon.name];
                                    } else if (skill.icon.fallback && LucideIcons[skill.icon.fallback]) {
                                        IconComp = LucideIcons[skill.icon.fallback];
                                    }
                                }

                                return (
                                    <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-[#222] rounded-full border border-[#E2E1DB] dark:border-[#333]">
                                        <IconComp size={12} className="text-[#D94F04]" />
                                        <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{skillName}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Applicants", value: project.applicantCount || 0 },
                        { label: "Priority", value: project.priority || "Medium" },
                        { label: "Duration", value: project.duration || "Ongoing" }
                    ].map((stat, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-[#222] border border-[#E2E1DB] dark:border-[#333] rounded-lg text-center">
                            <div className="text-lg font-bold text-[#2B2B2B] dark:text-white">{stat.value}</div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-[#E2E1DB] dark:border-[#333] bg-white dark:bg-[#1A1A1A] flex items-center justify-between shrink-0 gap-4">
                <div className="max-w-[50%]">
                    <TeamStack members={project.members || []} />
                </div>

                <button
                    onClick={onJoin}
                    disabled={isPending || isSending}
                    className={`
                        px-5 py-2 rounded-lg font-medium text-xs transition-all flex items-center gap-2 shrink-0
                        ${isPending
                            ? "bg-gray-100 dark:bg-[#333] text-gray-500 cursor-not-allowed"
                            : "bg-[#D94F04] hover:bg-[#bf4404] text-white shadow-sm hover:shadow-md"}
                    `}
                >
                    {isSending ? (
                        <> <Loader className="w-3 h-3 animate-spin" /> Sending... </>
                    ) : isPending ? (
                        <> <CheckCircle2 className="w-3 h-3" /> Sent </>
                    ) : (
                        "Join Project"
                    )}
                </button>
            </div>
        </div>
    );
}
