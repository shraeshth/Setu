import React, { useEffect, useState } from "react";
import { useAdmin } from "../../Contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  Flag, AlertTriangle, CheckCircle2, Clock, Loader,
  X, ChevronDown, Eye, User
} from "lucide-react";

const SEVERITY_MAP = {
  critical: { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/20", dot: "bg-red-400" },
  high: { bg: "bg-orange-500/15", text: "text-orange-400", border: "border-orange-500/20", dot: "bg-orange-400" },
  medium: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/20", dot: "bg-amber-400" },
  low: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/20", dot: "bg-blue-400" },
};

const STATUS_MAP = {
  open: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  reviewed: { icon: Eye, color: "text-blue-400", bg: "bg-blue-500/10" },
  resolved: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  dismissed: { icon: X, color: "text-[#555]", bg: "bg-[#1E1E1E]" },
};

export default function AdminFlags() {
  const { fetchFlags, flags, flagsLoading, resolveFlag } = useAdmin();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("open");
  const [resolveId, setResolveId] = useState(null);
  const [resolution, setResolution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFlags({ status: statusFilter || undefined });
  }, [statusFilter, fetchFlags]);

  const handleResolve = async () => {
    if (!resolution.trim() || !resolveId) return;
    setSubmitting(true);
    try {
      await resolveFlag(resolveId, resolution);
      setResolveId(null);
      setResolution("");
      fetchFlags({ status: statusFilter || undefined });
    } catch (err) {
      alert("Failed to resolve flag");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Flags & Moderation</h1>
          <p className="text-sm text-[#666] mt-1">Review anomalies, disputes, and system alerts</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 bg-[#111] border border-[#1E1E1E] rounded-lg p-1 w-fit">
        {["open", "reviewed", "resolved", "dismissed", ""].map((s) => {
          const label = s || "All";
          const isActive = statusFilter === s;
          return (
            <button
              key={label}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all
                ${isActive ? "bg-[#1E1E1E] text-white" : "text-[#555] hover:text-white"}`}
            >
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </button>
          );
        })}
      </div>

      {/* Flags List */}
      {flagsLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-6 h-6 text-[#D94F04] animate-spin" />
        </div>
      ) : flags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 size={40} className="text-emerald-500/20 mb-4" />
          <p className="text-sm text-[#555]">No flags found</p>
          <p className="text-[11px] text-[#444] mt-1">
            {statusFilter === "open" ? "The moderation queue is clear" : "Try a different filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {flags.map((flag) => {
            const sev = SEVERITY_MAP[flag.severity] || SEVERITY_MAP.medium;
            const stat = STATUS_MAP[flag.status] || STATUS_MAP.open;
            const StatIcon = stat.icon;

            return (
              <div
                key={flag.id}
                className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-5 hover:border-[#2A2A2A] transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Type + Severity */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />
                      <span className="text-[13px] font-bold text-white">{flag.type}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${sev.bg} ${sev.text} ${sev.border}`}>
                        {flag.severity}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${stat.bg} ${stat.color}`}>
                        <StatIcon size={10} /> {flag.status}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-[12px] text-[#888] mb-2">{flag.description}</p>

                    {/* Target User */}
                    {flag.targetUserName && (
                      <button
                        onClick={() => navigate(`/admin/students/${flag.targetUserId}`)}
                        className="flex items-center gap-1.5 text-[11px] text-[#D94F04] hover:underline"
                      >
                        <User size={11} /> {flag.targetUserName}
                      </button>
                    )}

                    {/* Timestamp */}
                    <p className="text-[10px] text-[#444] mt-2">
                      {flag.createdAt?.toDate ? flag.createdAt.toDate().toLocaleString() : "Unknown date"}
                    </p>

                    {/* Resolution info */}
                    {flag.resolution && (
                      <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[10px] text-emerald-400 font-semibold mb-0.5">Resolution:</p>
                        <p className="text-[11px] text-[#888]">{flag.resolution}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {flag.status === "open" && (
                    <button
                      onClick={() => setResolveId(flag.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex-shrink-0"
                    >
                      <CheckCircle2 size={12} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Modal */}
      {resolveId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setResolveId(null)}>
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Resolve Flag</h3>
            <p className="text-[12px] text-[#666] mb-3">Describe the action taken to resolve this flag.</p>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Resolution details..."
              className="w-full bg-[#1A1A1A] border border-[#222] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder-[#444] focus:outline-none focus:border-[#333] resize-none h-24"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setResolveId(null)} className="px-4 py-2 rounded-lg text-[12px] text-[#666] hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleResolve}
                disabled={submitting || !resolution.trim()}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25 transition-all disabled:opacity-40"
              >
                {submitting ? "Resolving..." : "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
