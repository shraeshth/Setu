import React, { useEffect, useState } from "react";
import { useAdmin } from "../../Contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  Users, GitBranch, Star, CheckCircle2, Activity,
  TrendingUp, TrendingDown, Loader, Flag, Zap, BarChart3
} from "lucide-react";

function StatCard({ icon: Icon, label, value, sub, trend, color = "#D94F04", onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative bg-[#141414] border border-[#1E1E1E] rounded-xl p-5 text-left
                 hover:border-[#2A2A2A] hover:bg-[#181818] transition-all duration-200 cursor-pointer
                 overflow-hidden"
    >
      {/* Subtle glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
        style={{ background: color }} />

      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} strokeWidth={1.8} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${trend >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      <p className="text-[11px] text-[#666] mt-0.5 font-medium">{label}</p>
      {sub && <p className="text-[10px] text-[#444] mt-1">{sub}</p>}
    </button>
  );
}

function SkillBar({ skill, count, maxCount }) {
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] text-[#999] w-24 truncate font-medium">{skill}</span>
      <div className="flex-1 h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#D94F04] to-[#FF7A33] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[11px] text-[#555] w-8 text-right font-mono">{count}</span>
    </div>
  );
}

export default function AdminOverview() {
  const { fetchPlatformStats, platformStats, statsLoading, role, fetchFlags, flags } = useAdmin();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchPlatformStats();
      fetchFlags({ status: "open" });
      setLoaded(true);
    }
  }, [loaded, fetchPlatformStats, fetchFlags]);

  if (statsLoading || !platformStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-[#D94F04] animate-spin" />
      </div>
    );
  }

  const s = platformStats;
  const maxSkillCount = s.topSkills.length > 0 ? s.topSkills[0].count : 1;

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
        <p className="text-sm text-[#666] mt-1">Real-time intelligence from the Setu peer exchange network</p>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Users} label="Total Students" value={s.totalUsers}
          sub={`${s.activeUsersLast7Days} active this week`}
          color="#3B82F6"
          onClick={() => navigate("/admin/students")}
        />
        <StatCard
          icon={GitBranch} label="Active Collaborations" value={s.activeCollaborations}
          sub={`${s.completedCollaborations} completed`}
          color="#10B981"
        />
        <StatCard
          icon={CheckCircle2} label="Task Completion" value={`${s.taskCompletionRate}%`}
          sub={`${s.completedTasks} of ${s.totalTasks} tasks`}
          color="#D94F04"
        />
        <StatCard
          icon={Star} label="Total Reviews" value={s.totalReviews}
          sub={`${s.totalConnections} peer connections`}
          color="#F59E0B"
        />
      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Skills */}
        <div className="lg:col-span-2 bg-[#141414] border border-[#1E1E1E] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={16} className="text-[#D94F04]" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Skill Distribution</h2>
          </div>
          <div className="space-y-3">
            {s.topSkills.map((sk) => (
              <SkillBar key={sk.skill} skill={sk.skill} count={sk.count} maxCount={maxSkillCount} />
            ))}
            {s.topSkills.length === 0 && (
              <p className="text-xs text-[#555]">No skill data available</p>
            )}
          </div>
        </div>

        {/* Quick Actions / Open Flags */}
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Flag size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Open Flags</h2>
            {flags.length > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                {flags.length}
              </span>
            )}
          </div>

          {flags.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 size={32} className="text-emerald-500/40 mb-3" />
              <p className="text-xs text-[#555]">No open flags</p>
              <p className="text-[10px] text-[#444] mt-1">The network is healthy</p>
            </div>
          ) : (
            <div className="space-y-2">
              {flags.slice(0, 5).map((f) => (
                <button
                  key={f.id}
                  onClick={() => navigate("/admin/flags")}
                  className="w-full text-left p-3 rounded-lg bg-[#1A1A1A] border border-[#222] hover:border-[#333] transition-all"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${f.severity === "high" || f.severity === "critical" ? "bg-red-400" : "bg-amber-400"}`} />
                    <span className="text-[11px] font-semibold text-white truncate">{f.type}</span>
                  </div>
                  <p className="text-[10px] text-[#555] truncate">{f.description}</p>
                </button>
              ))}
              {flags.length > 5 && (
                <button onClick={() => navigate("/admin/flags")} className="text-[11px] text-[#D94F04] hover:underline w-full text-center py-1">
                  View all {flags.length} flags →
                </button>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-5 pt-4 border-t border-[#1E1E1E] space-y-2">
            <h3 className="text-[10px] font-bold text-[#555] uppercase tracking-wider mb-2">Quick Actions</h3>
            {(role === "teacher" || role === "super_admin") && (
              <button
                onClick={() => navigate("/admin/students")}
                className="w-full flex items-center gap-2 text-[12px] text-[#999] hover:text-white p-2 rounded-lg hover:bg-white/[0.03] transition-all"
              >
                <Users size={14} /> View Student Analytics
              </button>
            )}
            {(role === "placement_cell" || role === "super_admin") && (
              <button
                onClick={() => navigate("/admin/reports")}
                className="w-full flex items-center gap-2 text-[12px] text-[#999] hover:text-white p-2 rounded-lg hover:bg-white/[0.03] transition-all"
              >
                <Zap size={14} /> Generate Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
