import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext";
import { useNavigationBadges } from "../Hooks/useNavigationBadges";
import {
  Home,
  Compass,
  User,
  Briefcase,
  HelpCircle,
  ChevronDown,
  LogOut,
  Settings
} from "lucide-react"
import logo from "../assets/setulogo.png";
import bridgeImage from "../assets/bridge-removebg-preview.png";

export default function LeftSidebar() {
  const { currentUser, logout } = useAuth();
  const { profileIncomplete, unreadNotifications, newTasks } = useNavigationBadges();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const links = [
    { name: "Home", icon: Home, badge: 0 },
    { name: "Explore", icon: Compass, badge: 0 },
    { name: "Profile", icon: User, badge: profileIncomplete },
    { name: "Workspace", icon: Briefcase, badge: newTasks },
    { name: "Help", icon: HelpCircle, badge: 0 },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Close menu on navigation
  useEffect(() => {
    setShowMenu(false);
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Get user initials
  const getUserInitials = () => {
    if (currentUser?.displayName) {
      const names = currentUser.displayName.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    return currentUser?.email?.[0]?.toUpperCase() || "U";
  };

  // Get user display name
  const getDisplayName = () => {
    if (currentUser?.displayName) {
      const firstName = currentUser.displayName.split(" ")[0];
      return firstName.length > 10 ? `${firstName.slice(0, 10)}...` : firstName;
    }
    if (currentUser?.email) {
      const emailName = currentUser.email.split("@")[0];
      return emailName.length > 10 ? `${emailName.slice(0, 10)}...` : emailName;
    }
    return "User";
  };

  return (
    <aside
      className="w-[15%] min-w-[200px] bg-white dark:bg-[#1A1A1A]
                 flex flex-col justify-between transition-colors duration-300
                 h-screen sticky top-0 border-r border-[#E2E1DB] dark:border-[#3A3A3A]"
    >
      {/* ====== Top Section: Logo + Nav ====== */}
      <div className="flex flex-col h-full">
        {/* Logo + Text */}
        <NavLink to="/home" className="flex items-center gap-1 px-5 py-5 select-none">
          <img
            src={logo}
            alt="Setu logo"
            className="
      w-10 h-auto
      dark:drop-shadow-[0_0_10px_rgba(232,108,46,0.75)]
    "
            draggable="false"
          />

          <span className="text-2xl font-semibold text-[#2B2B2B] dark:text-gray-100 
      dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]">
            Setu
          </span>
        </NavLink>


        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 py-4">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={`/${item.name.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-6 text-sm transition-all duration-200
                 ${isActive
                  ? "bg-[#D94F04] text-white font-semibold"
                  : "text-[#3C3C3C] dark:text-[#EAEAEA] hover:bg-[#E8E7E0] dark:hover:bg-[#2B2B2B] hover:text-[#D94F04] dark:hover:text-[#D94F04]"
                }`
              }
            >
              <item.icon size={18} strokeWidth={2} />
              <span>{item.name}</span>
              {item.badge > 0 && (
                <span className="ml-auto text-xs font-semibold bg-[#D94F04] text-white 
                                 rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mx-auto select-none pointer-events-none -mb-10 relative z-0 opacity-90">
        <img src={bridgeImage} alt="Bridge" className="w-[500px] h-auto" />
      </div>

      {/* ====== Bottom Section: Profile Capsule ====== */}
      <div className="p-4 relative">
        <button
          ref={buttonRef}
          onClick={() => setShowMenu((prev) => !prev)}
          className="w-full flex items-center justify-between 
                     bg-[#FCFCF9] dark:bg-[#2B2B2B]
                     border border-[#E2E1DB] dark:border-[#3A3A3A]
                     rounded-full px-3 py-2.5 cursor-pointer
                     hover:bg-[#E8E7E0] dark:hover:bg-[#3A3A3A]
                     transition-all duration-200"
          aria-label="User menu"
          aria-expanded={showMenu}
        >
          {/* Left: Profile Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              {currentUser?.photoURL ? (
                <img
                  src={`${currentUser.photoURL}?sz=200`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div
                  className="w-full h-full rounded-full 
      bg-gradient-to-br from-[#2E7BE4] to-[#1A5BB8]
      dark:from-[#4C9FFF] dark:to-[#2E7BE4]
      text-white flex items-center justify-center 
      text-sm font-bold shadow-sm"
                >
                  {getUserInitials()}
                </div>
              )}
            </div>



            <div className="flex flex-col items-start min-w-0">
              <p className="text-sm font-semibold 
                            text-[#2B2B2B] dark:text-[#EAEAEA] 
                            leading-none truncate w-full text-left">
                {getDisplayName()}
              </p>
            </div>
          </div>

          {/* Chevron Icon */}
          <ChevronDown
            size={16}
            className={`text-[#3C3C3C] dark:text-[#EAEAEA] transition-transform duration-200 flex-shrink-0
                       ${showMenu ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute bottom-full left-4 right-4 mb-2
                       bg-[#FCFCF9] dark:bg-[#2B2B2B]
                       border border-[#E2E1DB] dark:border-[#3A3A3A]
                       rounded-lg shadow-lg overflow-hidden
                       animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-[#E2E1DB] dark:border-[#3A3A3A]
                            bg-[#F9F8F3] dark:bg-[#1A1A1A]">
              <p className="text-sm font-semibold text-[#2B2B2B] dark:text-[#EAEAEA] truncate">
                {currentUser?.displayName || "User"}
              </p>
              <p className="text-xs text-[#8A877C] dark:text-[#A0A0A0] truncate">
                {currentUser?.email || "user@example.com"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                to="/profile"
                onClick={() => setShowMenu(false)}
                className="w-full flex items-center gap-3 text-left text-sm px-4 py-2.5
                           text-[#3C3C3C] dark:text-[#EAEAEA]
                           hover:bg-[#E8E7E0] dark:hover:bg-[#3A3A3A]
                           transition-colors"
              >
                <Settings size={16} />
                <span>Settings</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-left text-sm px-4 py-2.5
                           text-[#D94F04] font-medium
                           hover:bg-[#E8E7E0] dark:hover:bg-[#3A3A3A]
                           transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}