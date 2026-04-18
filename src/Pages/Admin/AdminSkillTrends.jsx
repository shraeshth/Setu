import React, { useEffect, useState } from "react";
import { useAdmin } from "../../Contexts/AdminContext";
import { TrendingUp, Loader, BarChart3, Users, Zap } from "lucide-react";

export default function AdminSkillTrends() {
  const { fetchPlatformStats, platformStats, statsLoading } = useAdmin();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchPlatformStats();
      setLoaded(true);
    }
  }, [loaded, fetchPlatformStats]);

  if (statsLoading || !platformStats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-[#D94F04] animate-spin" />
      </div>
    );
  }

  const skills = platformStats.topSkills || [];
  const maxCount = skills.length > 0 ? skills[0].count : 1;
  const totalStudents = platformStats.totalUsers || 1;

  // Compute demand (wantToLearn)
  const demandMap = {};
  (platformStats.users || []).forEach(u => {
    (u.wantToLearn || []).forEach(s => {
      demandMap[s] = (demandMap[s] || 0) + 1;
    });
  });

  // Build extended skill data
  const skillData = skills.map(sk => ({
    ...sk,
    demand: demandMap[sk.skill] || 0,
    penetration: Math.round((sk.count / totalStudents) * 100),
    supplyDemandRatio: demandMap[sk.skill] > 0
      ? (sk.count / demandMap[sk.skill]).toFixed(1)
      : "∞"
  }));

  // Top demand skills not in supply
  const demandOnly = Object.entries(demandMap)
    .filter(([skill]) => !skills.find(s => s.skill === skill))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">Skill Trends</h1>
        <p className="text-sm text-[#666] mt-1">Supply vs demand across the student network</p>
      </div>

      {/* Skill Table */}
      <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-[#111] border-b border-[#1E1E1E] text-[11px] text-[#555] font-bold uppercase tracking-wider">
          <div className="col-span-3">Skill</div>
          <div className="col-span-2">Students (Supply)</div>
          <div className="col-span-2">Want to Learn (Demand)</div>
          <div className="col-span-2">Supply/Demand</div>
          <div className="col-span-3">Penetration</div>
        </div>

        <div className="divide-y divide-[#1A1A1A]">
          {skillData.map((sk) => {
            const ratio = parseFloat(sk.supplyDemandRatio);
            const ratioColor = ratio === Infinity || isNaN(ratio)
              ? "text-[#555]"
              : ratio < 0.5 ? "text-red-400" : ratio < 1 ? "text-amber-400" : "text-emerald-400";

            return (
              <div key={sk.skill} className="grid grid-cols-12 gap-2 px-5 py-3.5 hover:bg-white/[0.02] transition-all">
                <div className="col-span-3 text-[13px] font-semibold text-white">{sk.skill}</div>
                <div className="col-span-2 flex items-center gap-2">
                  <Users size={12} className="text-[#555]" />
                  <span className="text-[13px] text-[#999] tabular-nums">{sk.count}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <TrendingUp size={12} className="text-[#555]" />
                  <span className="text-[13px] text-[#999] tabular-nums">{sk.demand}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[13px] font-bold tabular-nums ${ratioColor}`}>
                    {sk.supplyDemandRatio}x
                  </span>
                </div>
                <div className="col-span-3 flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[#1E1E1E] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#D94F04] to-[#FF7A33] transition-all duration-700"
                      style={{ width: `${sk.penetration}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#555] tabular-nums w-10 text-right">{sk.penetration}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Gaps - demanded but not supplied */}
      {demandOnly.length > 0 && (
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-red-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Skill Gaps</h2>
            <span className="text-[10px] text-[#555] ml-2">Skills students want to learn but nobody teaches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {demandOnly.map(([skill, count]) => (
              <div key={skill} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/10">
                <span className="text-[12px] font-medium text-red-400">{skill}</span>
                <span className="text-[10px] text-[#555]">{count} students want this</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
