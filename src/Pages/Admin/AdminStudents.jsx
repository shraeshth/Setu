import React, { useEffect, useState } from "react";
import { useAdmin } from "../../Contexts/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  Search, SlidersHorizontal, Download, ChevronDown, ChevronUp,
  Users, Star, GitBranch, Loader, ArrowUpDown, X
} from "lucide-react";

export default function AdminStudents() {
  const { fetchStudents, exportStudentsCSV, role } = useAdmin();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [sortBy, setSortBy] = useState("credibilityScore");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    const result = await fetchStudents({
      search,
      skill: skillFilter,
      department: deptFilter,
      sortBy,
      sortOrder
    });
    setStudents(result);
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, [sortBy, sortOrder]);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadStudents();
    }, 400);
    return () => clearTimeout(timeout);
  }, [search, skillFilter, deptFilter]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(o => o === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return <ArrowUpDown size={12} className="text-[#444]" />;
    return sortOrder === "desc"
      ? <ChevronDown size={12} className="text-[#D94F04]" />
      : <ChevronUp size={12} className="text-[#D94F04]" />;
  };

  const getCredibilityColor = (score) => {
    if (score >= 75) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    if (score >= 25) return "text-orange-400";
    return "text-red-400";
  };

  // Extract unique departments
  const departments = [...new Set(students.map(s => s.department).filter(Boolean))];

  return (
    <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Student Intelligence</h1>
          <p className="text-sm text-[#666] mt-1">
            {students.length} student{students.length !== 1 ? "s" : ""} • Sorted by {sortBy.replace(/([A-Z])/g, " $1").toLowerCase()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border transition-all
              ${showFilters ? "bg-[#D94F04]/10 border-[#D94F04]/30 text-[#D94F04]" : "bg-[#141414] border-[#1E1E1E] text-[#999] hover:text-white hover:border-[#2A2A2A]"}`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          {(role === "placement_cell" || role === "super_admin") && (
            <button
              onClick={() => exportStudentsCSV(students)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[#141414] border border-[#1E1E1E] text-[#999] hover:text-white hover:border-[#2A2A2A] transition-all"
            >
              <Download size={14} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="mb-4 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or skill..."
            className="w-full bg-[#141414] border border-[#1E1E1E] rounded-lg pl-10 pr-4 py-2.5 text-[13px] text-white placeholder-[#444] focus:outline-none focus:border-[#333] transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Row */}
        {showFilters && (
          <div className="flex gap-3 flex-wrap">
            <input
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill..."
              className="bg-[#141414] border border-[#1E1E1E] rounded-lg px-3 py-2 text-[12px] text-white placeholder-[#444] focus:outline-none focus:border-[#333] w-48"
            />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-[#141414] border border-[#1E1E1E] rounded-lg px-3 py-2 text-[12px] text-white focus:outline-none focus:border-[#333] w-48 appearance-none"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {(skillFilter || deptFilter) && (
              <button
                onClick={() => { setSkillFilter(""); setDeptFilter(""); }}
                className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-6 h-6 text-[#D94F04] animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users size={40} className="text-[#222] mb-4" />
          <p className="text-sm text-[#555]">No students match your filters</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-[#111] border-b border-[#1E1E1E] text-[11px] text-[#555] font-bold uppercase tracking-wider">
            <div className="col-span-4">Student</div>
            <div className="col-span-2 flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("credibilityScore")}>
              Credibility <SortIcon field="credibilityScore" />
            </div>
            <div className="col-span-2">Skills</div>
            <div className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("connectionsCount")}>
              Conn. <SortIcon field="connectionsCount" />
            </div>
            <div className="col-span-1 flex items-center gap-1 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("collaborationsCount")}>
              Collabs <SortIcon field="collaborationsCount" />
            </div>
            <div className="col-span-2">Department</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#1A1A1A]">
            {students.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => navigate(`/admin/students/${s.id}`)}
                className="grid grid-cols-12 gap-2 px-5 py-3.5 w-full text-left hover:bg-white/[0.02] transition-all group"
              >
                {/* Student */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    {s.photoURL ? (
                      <img src={`${s.photoURL}?sz=100`} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D94F04] to-[#FF7A33] text-white flex items-center justify-center text-[11px] font-bold">
                        {(s.displayName || "U")[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate group-hover:text-[#D94F04] transition-colors">
                      {s.displayName || "Unnamed"}
                    </p>
                    <p className="text-[10px] text-[#555] truncate">{s.email}</p>
                  </div>
                </div>

                {/* Credibility */}
                <div className="col-span-2 flex items-center">
                  <span className={`text-lg font-bold tabular-nums ${getCredibilityColor(s.credibilityScore)}`}>
                    {s.credibilityScore || 0}
                  </span>
                  <span className="text-[10px] text-[#444] ml-1">/100</span>
                </div>

                {/* Skills */}
                <div className="col-span-2 flex items-center gap-1 flex-wrap">
                  {(s.skills || []).slice(0, 2).map((sk, i) => (
                    <span key={i} className="text-[10px] bg-[#1E1E1E] text-[#888] px-1.5 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                  {(s.skills || []).length > 2 && (
                    <span className="text-[10px] text-[#444]">+{s.skills.length - 2}</span>
                  )}
                </div>

                {/* Connections */}
                <div className="col-span-1 flex items-center text-[13px] text-[#888] tabular-nums">
                  {s.connectionsCount || 0}
                </div>

                {/* Collaborations */}
                <div className="col-span-1 flex items-center text-[13px] text-[#888] tabular-nums">
                  {s.collaborationsCount || 0}
                </div>

                {/* Department */}
                <div className="col-span-2 flex items-center">
                  <span className="text-[12px] text-[#666] truncate">{s.department || "—"}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
