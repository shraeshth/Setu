import React from "react";
import { useAdmin } from "../../Contexts/AdminContext";
import { Settings, Shield, Database, Loader } from "lucide-react";

export default function AdminSettings() {
  const { systemConfig, role } = useAdmin();

  if (role !== "super_admin" && role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <Shield size={40} className="text-[#222] mb-4" />
        <p className="text-sm text-[#555]">Access restricted to Super Admin</p>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1000px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
        <p className="text-sm text-[#666] mt-1">Configure credibility weights and system thresholds</p>
      </div>

      {/* Credibility Weights */}
      <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-5">
          <Database size={15} className="text-[#D94F04]" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Credibility Score Weights</h2>
        </div>
        <p className="text-[12px] text-[#555] mb-5">
          These weights control how each dimension contributes to the overall credibility score. Must sum to 1.0.
        </p>

        <div className="space-y-4">
          {Object.entries(systemConfig.weights).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <span className="text-[13px] text-[#999] w-40 capitalize">{key}</span>
              <div className="flex-1 h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D94F04] to-[#FF7A33]"
                  style={{ width: `${value * 100}%` }}
                />
              </div>
              <span className="text-[13px] text-white font-bold tabular-nums w-12 text-right">{(value * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#444] mt-4">
          ⓘ Weight modification requires Firebase Cloud Function deployment. Current values are read-only in the UI.
        </p>
      </div>

      {/* System Thresholds */}
      <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings size={15} className="text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wide">Alert Thresholds</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(systemConfig.thresholds).map(([key, value]) => {
            const labels = {
              collusion: "Collusion Rating Threshold",
              inactivityDays: "Inactivity Alert (days)",
              isolationDays: "Isolation Detection (days)",
              negativeTrendDrop: "Negative Trend Drop (points)"
            };

            return (
              <div key={key} className="p-3 rounded-lg bg-[#1A1A1A] border border-[#222]">
                <p className="text-[11px] text-[#666] mb-1">{labels[key] || key}</p>
                <p className="text-lg font-bold text-white tabular-nums">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
