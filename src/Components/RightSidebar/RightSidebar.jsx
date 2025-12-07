import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Newspaper, Megaphone, Flame, Activity, Users, Bell } from "lucide-react"

import logo from "../../assets/setulogo.png";

import ThemeToggle from "./ThemeToggle";
import SearchBar from "./SearchBar";

// Default Mode Components
import TechNews from "./TechNews";
import NoticeBoard from "./NoticeBoard";

// Stats
import StatProject from "./StatProject";
import StatCredibility from "./StatCredibility";
import StatStreak from "./StatStreak";

// Explore Widgets
import MicroAchievementsWidget from "../Explore/MicroAchievementsWidget";
import HotRolesWidget from "../Explore/HotRolesWidget";

// NEW: Connections List Widget
import ConnectionsListWidget from "../Profile/ConnectionsListWidget";

import { useAuth } from "../../Contexts/AuthContext";
import { useFirestore } from "../../Hooks/useFirestore";
import { useNavigationBadges } from "../../Hooks/useNavigationBadges";
import { where } from "firebase/firestore";

export default function RightSidebar({ isExplorePage, isProfilePage }) {
  const { currentUser } = useAuth();
  const { getDocument, getCollection } = useFirestore();
  const { unreadNotifications } = useNavigationBadges();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("news");
  const isNotificationsActive = location.pathname === "/notifications";

  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({ count: 0, completed: 0, active: 0, pending: 0 });

  useEffect(() => {
    if (isProfilePage) {
      setActiveTab("connections");
    } else if (isExplorePage) {
      setActiveTab("hot");
    } else {
      setActiveTab("news");
    }
  }, [isExplorePage, isProfilePage]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        // Fetch user data for streak and credibility
        const userDoc = await getDocument("users", currentUser.uid);
        if (userDoc) {
          setUserData(userDoc);
        }

        // Fetch personal projects
        const userProjects = await getCollection("collaborations", [
          where("memberIds", "array-contains", currentUser.uid)
        ]);

        setProjects(userProjects.map(p => ({
          id: p.id,
          name: p.title,
          status: p.status?.toLowerCase() || "active" // Map status if needed
        })));

        // Calculate stats
        const stats = {
          count: userProjects.length,
          completed: userProjects.filter(p => p.status?.toLowerCase() === "completed").length,
          pending: userProjects.filter(p => ["archived", "pending", "planning"].includes(p.status?.toLowerCase())).length,
          active: userProjects.filter(p => !["completed", "archived", "pending", "planning"].includes(p.status?.toLowerCase())).length
        };
        setProjectStats(stats);
      }
    };
    fetchData();
  }, [currentUser, getDocument, getCollection]);


  return (
    <aside className="hidden lg:flex flex-col h-screen w-[27%] 
      bg-[#F9F8F3] dark:bg-[#1A1A1A] 
      border-l border-[#E2E1DB] dark:border-[#333] 
      p-6 gap-4 transition-colors duration-300">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center gap-3">
        {/* Notification Button */}
        <Link
          to="/notifications"
          className={`w-9 h-9 flex items-center justify-center rounded-full 
                     bg-[#FCFCF9] dark:bg-[#2B2B2B]
                     border border-[#D3D2C9] dark:border-[#3A3A3A]
                     hover:bg-[#FFF4E6] dark:hover:bg-[#E86C2E]/20
                     hover:border-[#D94F04]/30 dark:hover:border-[#E86C2E]/30
                     transition-all duration-300 relative group
                     ${isNotificationsActive ? "bg-[#FFF4E6] dark:bg-[#E86C2E]/20 border-[#D94F04]/50 dark:border-[#E86C2E]/50" : ""}`}
          aria-label="Notifications"
        >
          <Bell
            size={16}
            className={`text-[#3C3C3C] dark:text-[#EAEAEA] 
                       group-hover:text-[#D94F04] dark:group-hover:text-[#E86C2E]
                       transform rotate-12 group-hover:rotate-0 transition-transform duration-300
                       ${isNotificationsActive ? "text-[#D94F04] dark:text-[#E86C2E] !rotate-0" : ""}`}
          />
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#D94F04] text-[#FCFCF9] text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#FCFCF9] dark:border-[#2B2B2B] animate-pulse px-1">
              {unreadNotifications > 99 ? '99+' : unreadNotifications}
            </span>
          )}
        </Link>

        <ThemeToggle />
        <div className="flex-1">
          <SearchBar />
        </div>
      </div>

      {/* ================= MAIN BOX ================= */}
      <div className="flex flex-col 
        bg-[#FCFCF9] dark:bg-[#2B2B2B] 
        border border-[#E2E1DB] dark:border-[#3A3A3A]
        rounded-md flex-[2] px-4 py-2 overflow-hidden">

        {/* ============================================================
            ========== PROFILE PAGE MODE WITH TABS =====================
      ============================================================ */}
        {isProfilePage ? (
          <>
            <div className="border-b border-[#E2E1DB] dark:border-[#3A3A3A]
    flex items-center justify-between mb-2">

              {/* CONNECTIONS */}
              <button
                onClick={() => setActiveTab("connections")}
                className={`flex flex-1 items-center gap-2 py-2 text-sm font-medium
        ${activeTab === "connections"
                    ? "text-[#D94F04] border-b-2 border-[#D94F04] px-3 justify-between"
                    : "text-[#3C3C3C] dark:text-[#B0B0B0] justify-center hover:text-[#D94F04]"
                  }`}>
                <span>Connections</span>
                <Users
                  size={14}
                  className={`${activeTab === "connections"
                    ? "text-[#D94F04]"
                    : "text-[#A3A29A] dark:text-[#707070]"
                    }`}
                />
              </button>

              {/* YOUR ACTIVITY */}
              <button
                onClick={() => setActiveTab("profile-activity")}
                className={`flex flex-1 items-center gap-2 py-2 text-sm font-medium
        ${activeTab === "profile-activity"
                    ? "text-[#2E7BE4] border-b-2 border-[#2E7BE4] px-3 justify-between"
                    : "text-[#3C3C3C] dark:text-[#B0B0B0] justify-center hover:text-[#2E7BE4]"
                  }`}>
                <span>Your Activity</span>
                <Activity
                  size={14}
                  className={`${activeTab === "profile-activity"
                    ? "text-[#2E7BE4]"
                    : "text-[#A3A29A] dark:text-[#707070]"
                    }`}
                />
              </button>
            </div>

            {/* Content Switch */}
            <div className="flex-1 overflow-hidden">
              {activeTab === "connections" ? (
                <ConnectionsListWidget />
              ) : (
                <MicroAchievementsWidget />
              )}
            </div>
          </>

        ) : isExplorePage ? (


          /* ============================================================
              ====================== EXPLORE MODE ========================
          ============================================================ */
          <>
            <div className="border-b border-[#E2E1DB] dark:border-[#3A3A3A]
              flex items-center justify-between mb-2">

              {/* HOT ROLES */}
              <button
                onClick={() => setActiveTab("hot")}
                className={`flex flex-1 items-center gap-2 py-2 text-sm font-medium
                  ${activeTab === "hot"
                    ? "text-[#D94F04] border-b-2 border-[#D94F04] px-3 justify-between"
                    : "text-[#3C3C3C] dark:text-[#B0B0B0] justify-center hover:text-[#D94F04]"
                  }`}>
                <span>Hot Roles</span>
                <Flame size={14} className={activeTab === "hot"
                  ? "text-[#D94F04]"
                  : "text-[#A3A29A] dark:text-[#707070]"} />
              </button>

              {/* YOUR ACTIVITY */}
              <button
                onClick={() => setActiveTab("micro")}
                className={`flex flex-1 items-center gap-2 py-2 text-sm font-medium
                  ${activeTab === "micro"
                    ? "text-[#2E7BE4] border-b-2 border-[#2E7BE4] px-3 justify-between"
                    : "text-[#3C3C3C] dark:text-[#B0B0B0] justify-center hover:text-[#2E7BE4]"
                  }`}>
                <span>Your Activity</span>
                <Activity size={14} className={activeTab === "micro"
                  ? "text-[#2E7BE4]"
                  : "text-[#A3A29A] dark:text-[#707070]"} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {activeTab === "hot" ? <HotRolesWidget /> : <MicroAchievementsWidget />}
            </div>
          </>
        ) : (

          /* ============================================================
              ===================== DEFAULT MODE =========================
          ============================================================ */
          <>
            <div className="border-b border-[#E2E1DB] dark:border-[#3A3A3A]
              flex items-center justify-between mb-2">

              {/* TECH NEWS */}
              <button
                onClick={() => setActiveTab("news")}
                className={`flex flex-1 items-center gap-2 py-2 text-sm font-medium
                  ${activeTab === "news"
                    ? "text-[#D94F04] border-b-2 border-[#D94F04] px-3 justify-between"
                    : "text-[#3C3C3C] dark:text-[#B0B0B0] justify-center hover:text-[#D94F04]"
                  }`}>
                <span>Tech News</span>
                <Newspaper size={14} className={activeTab === "news"
                  ? "text-[#D94F04]"
                  : "text-[#A3A29A] dark:text-[#707070]"} />
              </button>

              {/* NOTICE BOARD */}
              <button
                onClick={() => setActiveTab("notices")}
                className={`flex flex-1 items-center gap-2 py-2 text-sm font-medium
                  ${activeTab === "notices"
                    ? "text-[#2E7BE4] border-b-2 border-[#2E7BE4] px-3 justify-between"
                    : "text-[#3C3C3C] dark:text-[#B0B0B0] justify-center hover:text-[#2E7BE4]"
                  }`}>
                <span>Notice Board</span>
                <Megaphone size={14} className={activeTab === "notices"
                  ? "text-[#2E7BE4]"
                  : "text-[#A3A29A] dark:text-[#707070]"} />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {activeTab === "news" ? <TechNews /> : <NoticeBoard />}
            </div>
          </>
        )}

      </div>

      {/* ================= STATS ================= */}
      <div className="flex flex-col gap-4 flex-none">
        <div className="grid grid-cols-2 gap-4">
          <StatCredibility userId={currentUser?.uid} />
          <StatStreak days={userData?.streak || 0} goal={7} />
        </div>
        <StatProject
          count={projectStats.count}
          completed={projectStats.completed}
          active={projectStats.active}
          pending={projectStats.pending}
          projects={projects}
        />
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-[#E2E1DB] dark:border-[#3A3A3A]
        flex items-center justify-between flex-none pt-2">
        <p className="text-xs text-[#8A877C] dark:text-[#6B6B6B]">
          © 2025 — Setu
        </p>
        <img src={logo} className="w-6 select-none" alt="logo" />
      </footer>
    </aside>
  );
}
