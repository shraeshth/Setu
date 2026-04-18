import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useAdmin } from "../Contexts/AdminContext";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  TrendingUp,
  Flag,
  FileBarChart,
  Settings,
  ArrowLeft,
  Shield,
  ChevronDown
} from "lucide-react";
import logo from "../assets/setulogo.png";

const NAV_ITEMS = [
  { path: "/admin", icon: LayoutDashboard, label: "Overview", roles: ["teacher", "placement_cell", "moderator", "super_admin", "admin"] },
  { path: "/admin/students", icon: Users, label: "Students", roles: ["teacher", "placement_cell", "super_admin", "admin"] },
  { path: "/admin/skills", icon: TrendingUp, label: "Skill Trends", roles: ["teacher", "placement_cell", "super_admin", "admin"] },
  { path: "/admin/flags", icon: Flag, label: "Flags & Moderation", roles: ["moderator", "super_admin", "admin"] },
  { path: "/admin/reports", icon: FileBarChart, label: "Reports", roles: ["placement_cell", "super_admin", "admin"] },
  { path: "/admin/settings", icon: Settings, label: "Settings", roles: ["super_admin", "admin"] },
];

const ROLE_LABELS = {
  teacher: "Teacher",
  placement_cell: "Placement Cell",
  moderator: "Moderator",
  super_admin: "Super Admin",
  admin: "Admin",
};

const ROLE_COLORS = {
  teacher: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  placement_cell: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  moderator: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  super_admin: "bg-red-500/15 text-red-400 border-red-500/20",
  admin: "bg-red-500/15 text-red-400 border-red-500/20",
};

export default function AdminLayout() {
  const { currentUser, userProfile, logout } = useAuth();
  const { role } = useAdmin();
  const navigate = useNavigate();

  const visibleItems = NAV_ITEMS.filter(item => item.roles.includes(role));

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B0B] text-gray-100">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[240px] min-w-[240px] bg-[#111111] border-r border-[#1E1E1E] flex flex-col h-screen">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-2">
          <img src={logo} alt="Setu" className="w-8 h-auto drop-shadow-[0_0_10px_rgba(232,108,46,0.6)]" draggable="false" />
          <span className="text-xl font-semibold text-white tracking-tight">Setu</span>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#D94F04] ml-1 mt-0.5">Admin</span>
        </div>

        {/* Role Badge */}
        <div className="px-5 mb-4">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold border ${ROLE_COLORS[role] || "bg-gray-500/15 text-gray-400 border-gray-500/20"}`}>
            <Shield size={11} />
            {ROLE_LABELS[role] || role}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 px-3">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150
                 ${isActive
                  ? "bg-[#D94F04]/15 text-[#FF7A33] shadow-[inset_0_0_0_1px_rgba(217,79,4,0.2)]"
                  : "text-[#999] hover:text-white hover:bg-white/[0.04]"
                }`
              }
            >
              <item.icon size={16} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Back to platform */}
        <div className="px-3 pb-2">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-[13px] text-[#666] hover:text-white hover:bg-white/[0.04] transition-all w-full"
          >
            <ArrowLeft size={15} />
            <span>Back to Platform</span>
          </button>
        </div>

        {/* User capsule */}
        <div className="p-3 border-t border-[#1E1E1E]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              {userProfile?.photoURL || currentUser?.photoURL ? (
                <img
                  src={`${userProfile?.photoURL || currentUser?.photoURL}?sz=100`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#D94F04] to-[#FF7A33] text-white flex items-center justify-center text-xs font-bold">
                  {(userProfile?.displayName || currentUser?.email || "A")[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {userProfile?.displayName || currentUser?.displayName || "Admin"}
              </p>
              <p className="text-[10px] text-[#666] truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-y-auto bg-[#0B0B0B]">
        <Outlet />
      </main>
    </div>
  );
}
