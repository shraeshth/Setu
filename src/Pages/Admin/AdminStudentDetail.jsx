import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "../../Contexts/AdminContext";
import {
  ArrowLeft, Loader, Star, Users, GitBranch, CheckCircle2,
  MessageSquare, Award, TrendingUp, AlertTriangle, Shield, Flag
} from "lucide-react";

function DimensionMeter({ label, score, dataPoints, color }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[12px] font-medium text-[#999]">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#555]">{dataPoints} reviews</span>
          <span className="text-[13px] font-bold text-white">{score}%</span>
        </div>
      </div>
      <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
        />
      </div>
    </div>
  );
}

function MiniCard({ icon: Icon, label, value, color = "#999" }) {
  return (
    <div className="bg-[#141414] border border-[#1E1E1E] rounded-lg p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ background: `${color}12` }}>
        <Icon size={16} style={{ color }} strokeWidth={1.8} />
      </div>
      <div>
        <p className="text-lg font-bold text-white tabular-nums">{value}</p>
        <p className="text-[10px] text-[#555] font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function AdminStudentDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { fetchStudentAnalytics, createFlag, role } = useAdmin();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagDesc, setFlagDesc] = useState("");
  const [flagLoading, setFlagLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await fetchStudentAnalytics(userId);
      setData(result);
      setLoading(false);
    };
    load();
  }, [userId, fetchStudentAnalytics]);

  const handleCreateFlag = async () => {
    if (!flagDesc.trim()) return;
    setFlagLoading(true);
    try {
      await createFlag({
        type: "MANUAL_REVIEW",
        severity: "medium",
        targetUserId: userId,
        targetUserName: data?.profile?.displayName || "Unknown",
        description: flagDesc
      });
      setShowFlagModal(false);
      setFlagDesc("");
      alert("Flag created successfully");
    } catch (err) {
      alert("Failed to create flag");
    } finally {
      setFlagLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-8 h-8 text-[#D94F04] animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <AlertTriangle size={40} className="text-[#333] mb-4" />
        <p className="text-sm text-[#555]">Student not found</p>
        <button onClick={() => navigate("/admin/students")} className="mt-4 text-[12px] text-[#D94F04] hover:underline">
          ← Back to Students
        </button>
      </div>
    );
  }

  const { profile, stats, credibility, collaborations, recentReviews } = data;
  const dim = credibility.dimensions;

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Back */}
      <button onClick={() => navigate("/admin/students")} className="flex items-center gap-2 text-[12px] text-[#555] hover:text-white transition-all mb-6">
        <ArrowLeft size={14} /> Back to Students
      </button>

      {/* Profile Header */}
      <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-6 mb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
              {profile.photoURL ? (
                <img src={`${profile.photoURL}?sz=200`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#D94F04] to-[#FF7A33] text-white flex items-center justify-center text-xl font-bold">
                  {(profile.displayName || "U")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{profile.displayName || "Unnamed"}</h1>
              <p className="text-[12px] text-[#555]">{profile.email}</p>
              <div className="flex items-center gap-3 mt-2">
                {profile.department && (
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-semibold">
                    {profile.department}
                  </span>
                )}
                {profile.headline && (
                  <span className="text-[11px] text-[#666]">{profile.headline}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {(role === "teacher" || role === "moderator" || role === "super_admin") && (
              <button
                onClick={() => setShowFlagModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                <Flag size={12} /> Create Flag
              </button>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {(profile.skills || []).map((sk, i) => (
            <span key={i} className="text-[11px] bg-[#1E1E1E] text-[#888] px-2 py-1 rounded-md">{sk}</span>
          ))}
          {(profile.skills || []).length === 0 && (
            <span className="text-[11px] text-[#444]">No skills listed</span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
        <MiniCard icon={Users} label="Connections" value={stats.connections} color="#3B82F6" />
        <MiniCard icon={GitBranch} label="Collaborations" value={stats.collaborations} color="#10B981" />
        <MiniCard icon={CheckCircle2} label="Tasks Done" value={`${stats.completedTasks}/${stats.totalTasks}`} color="#D94F04" />
        <MiniCard icon={MessageSquare} label="Reviews Given" value={stats.reviewsGiven} color="#8B5CF6" />
        <MiniCard icon={Star} label="Reviews Received" value={stats.reviewsReceived} color="#F59E0B" />
        <MiniCard icon={Award} label="Credibility" value={credibility.overallScore} color="#D94F04" />
      </div>

      {/* Credibility Breakdown + Collaborations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Credibility Breakdown */}
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Shield size={15} className="text-[#D94F04]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">Credibility Breakdown</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{credibility.overallScore}</span>
              <span className="text-[10px] text-[#555]">/ 100</span>
            </div>
          </div>

          {/* Confidence indicator */}
          <div className="flex items-center gap-2 mb-5 p-2.5 rounded-lg bg-[#1A1A1A] border border-[#222]">
            <div className={`w-2 h-2 rounded-full ${credibility.confidence >= 0.7 ? "bg-emerald-400" : credibility.confidence >= 0.4 ? "bg-amber-400" : "bg-red-400"}`} />
            <span className="text-[11px] text-[#777]">
              Confidence: <span className="text-white font-semibold">{Math.round(credibility.confidence * 100)}%</span>
              {credibility.confidence < 0.5 && <span className="text-amber-400 ml-2">( Low data — needs more reviews )</span>}
            </span>
          </div>

          <div className="space-y-4">
            <DimensionMeter label="Technical Accuracy" score={dim.technicalAccuracy.score} dataPoints={dim.technicalAccuracy.dataPoints} color="#3B82F6" />
            <DimensionMeter label="Communication" score={dim.communication.score} dataPoints={dim.communication.dataPoints} color="#10B981" />
            <DimensionMeter label="Reliability" score={dim.reliability.score} dataPoints={dim.reliability.dataPoints} color="#D94F04" />
            <DimensionMeter label="Mentorship Impact" score={dim.mentorshipImpact.score} dataPoints={dim.mentorshipImpact.dataPoints} color="#8B5CF6" />
          </div>
        </div>

        {/* Collaborations */}
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <GitBranch size={15} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Collaborations</h2>
            <span className="ml-auto text-[10px] text-[#555]">{collaborations.length} total</span>
          </div>

          {collaborations.length === 0 ? (
            <p className="text-xs text-[#444] text-center py-8">No collaborations yet</p>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {collaborations.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-[#1A1A1A] border border-[#222]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] font-semibold text-white truncate">{c.title}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      c.status === "completed" ? "bg-emerald-500/15 text-emerald-400" :
                      c.status === "active" ? "bg-blue-500/15 text-blue-400" :
                      "bg-[#222] text-[#555]"
                    }`}>
                      {c.status || "active"}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#555]">{(c.memberIds || []).length} members • {(c.techStack || []).join(", ") || "No stack"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Reviews */}
      {recentReviews.length > 0 && (
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-5 mt-4">
          <div className="flex items-center gap-2 mb-5">
            <MessageSquare size={15} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">Recent Reviews Received</h2>
          </div>
          <div className="space-y-2">
            {recentReviews.map((r) => (
              <div key={r.id} className="p-3 rounded-lg bg-[#1A1A1A] border border-[#222] flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  {r.textFeedback && <p className="text-[12px] text-[#999] mb-1">"{r.textFeedback}"</p>}
                  <div className="flex items-center gap-3 text-[10px] text-[#555]">
                    {r.technicalRating && <span>Tech: <span className="text-white font-semibold">{r.technicalRating}/5</span></span>}
                    {r.communicationRating && <span>Comm: <span className="text-white font-semibold">{r.communicationRating}/5</span></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowFlagModal(false)}>
          <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Create Flag</h3>
            <p className="text-[12px] text-[#666] mb-3">
              Flag student <span className="text-white font-semibold">{profile.displayName}</span> for review.
            </p>
            <textarea
              value={flagDesc}
              onChange={(e) => setFlagDesc(e.target.value)}
              placeholder="Describe the concern..."
              className="w-full bg-[#1A1A1A] border border-[#222] rounded-lg px-3 py-2.5 text-[13px] text-white placeholder-[#444] focus:outline-none focus:border-[#333] resize-none h-24"
            />
            <div className="flex gap-2 mt-4 justify-end">
              <button onClick={() => setShowFlagModal(false)} className="px-4 py-2 rounded-lg text-[12px] text-[#666] hover:text-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleCreateFlag}
                disabled={flagLoading || !flagDesc.trim()}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25 transition-all disabled:opacity-40"
              >
                {flagLoading ? "Creating..." : "Create Flag"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
