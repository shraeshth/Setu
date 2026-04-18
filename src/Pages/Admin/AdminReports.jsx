import React, { useState } from "react";
import { useAdmin } from "../../Contexts/AdminContext";
import {
  FileBarChart, Download, Loader, Users, TrendingUp,
  BarChart3, CheckCircle2
} from "lucide-react";

const REPORT_TYPES = [
  {
    id: "top_students",
    label: "Top Students by Credibility",
    description: "Export ranked list of students with credibility scores, skills, and connection data.",
    icon: Users,
    roles: ["placement_cell", "super_admin", "teacher"],
    color: "#3B82F6"
  },
  {
    id: "skill_gap",
    label: "Department Skill Gap Analysis",
    description: "Compare skill supply vs demand across the student network.",
    icon: TrendingUp,
    roles: ["placement_cell", "super_admin", "teacher"],
    color: "#10B981"
  },
  {
    id: "collaboration_health",
    label: "Collaboration Health Report",
    description: "Active/completed collaborations, team sizes, and completion rates.",
    icon: BarChart3,
    roles: ["super_admin", "teacher"],
    color: "#D94F04"
  }
];

export default function AdminReports() {
  const { fetchStudents, exportStudentsCSV, role, fetchPlatformStats, platformStats } = useAdmin();
  const [generating, setGenerating] = useState(null);
  const [generated, setGenerated] = useState([]);

  const visibleReports = REPORT_TYPES.filter(r => r.roles.includes(role));

  const handleGenerate = async (reportId) => {
    setGenerating(reportId);
    try {
      if (reportId === "top_students") {
        const students = await fetchStudents({ sortBy: "credibilityScore", sortOrder: "desc" });
        await exportStudentsCSV(students);
      } else if (reportId === "skill_gap") {
        await fetchPlatformStats();
        if (platformStats) {
          const users = platformStats.users || [];
          const supplyMap = {};
          const demandMap = {};
          users.forEach(u => {
            (u.skills || []).forEach(s => { supplyMap[s] = (supplyMap[s] || 0) + 1; });
            (u.wantToLearn || []).forEach(s => { demandMap[s] = (demandMap[s] || 0) + 1; });
          });
          const allSkills = new Set([...Object.keys(supplyMap), ...Object.keys(demandMap)]);
          const headers = ["Skill", "Supply (Students with skill)", "Demand (Students wanting skill)", "Gap"];
          const rows = [...allSkills].map(sk => [
            sk, supplyMap[sk] || 0, demandMap[sk] || 0, (demandMap[sk] || 0) - (supplyMap[sk] || 0)
          ]);
          rows.sort((a, b) => b[3] - a[3]);
          const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `setu_skill_gap_${new Date().toISOString().split("T")[0]}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        }
      } else if (reportId === "collaboration_health") {
        await fetchPlatformStats();
        if (platformStats) {
          const headers = ["Metric", "Value"];
          const rows = [
            ["Total Collaborations", platformStats.totalCollaborations],
            ["Active Collaborations", platformStats.activeCollaborations],
            ["Completed Collaborations", platformStats.completedCollaborations],
            ["Total Tasks", platformStats.totalTasks],
            ["Completed Tasks", platformStats.completedTasks],
            ["Task Completion Rate", `${platformStats.taskCompletionRate}%`],
            ["Total Users", platformStats.totalUsers],
            ["Active Users (7d)", platformStats.activeUsersLast7Days],
          ];
          const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
          const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `setu_collab_health_${new Date().toISOString().split("T")[0]}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }
      setGenerated(prev => [...prev, reportId]);
    } catch (err) {
      console.error("Report generation error:", err);
      alert("Failed to generate report");
    } finally {
      setGenerating(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Reports</h1>
        <p className="text-sm text-[#666] mt-1">Generate and export placement-ready data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {visibleReports.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          const isGenerated = generated.includes(report.id);

          return (
            <div
              key={report.id}
              className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-6 hover:border-[#2A2A2A] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{ background: `${report.color}12` }}>
                  <Icon size={20} style={{ color: report.color }} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-bold text-white mb-1">{report.label}</h3>
                  <p className="text-[12px] text-[#666] leading-relaxed">{report.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleGenerate(report.id)}
                disabled={isGenerating}
                className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[12px] font-semibold transition-all
                  ${isGenerated
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-[#1E1E1E] text-white hover:bg-[#252525] border border-[#2A2A2A]"
                  }
                  ${isGenerating ? "opacity-60 cursor-wait" : ""}`}
              >
                {isGenerating ? (
                  <><Loader size={14} className="animate-spin" /> Generating...</>
                ) : isGenerated ? (
                  <><CheckCircle2 size={14} /> Downloaded</>
                ) : (
                  <><Download size={14} /> Generate & Export</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {visibleReports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileBarChart size={40} className="text-[#222] mb-4" />
          <p className="text-sm text-[#555]">No reports available for your role</p>
        </div>
      )}
    </div>
  );
}
