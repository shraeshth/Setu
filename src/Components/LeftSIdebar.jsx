import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import {
  Home,
  Compass,
  User,
  Bell,
  Briefcase,
  HelpCircle,
  ChevronDown,
  LogOut,
  Settings
} from "lucide-react";
import logo from "../assets/logofinal.png";

export default function LeftSidebar() {
  const { currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const links = [
    { name: "Home", icon: Home },
    { name: "Explore", icon: Compass },
    { name: "Profile", icon: User },
    { name: "Notifications", icon: Bell },
    { name: "Workspace", icon: Briefcase },
    { name: "Help", icon: HelpCircle },
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
                 h-screen sticky top-0"
    >
      {/* ====== Top Section: Logo + Nav ====== */}
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-5">
          <img
            src={logo}
            alt="Setu logo"
            className="w-16 h-auto select-none"
            draggable="false"
          />
        </div>

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
            </NavLink>
          ))}
        </nav>
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
                  src={currentUser.photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "";
                  }}
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
              <button
                onClick={() => {
                  setShowMenu(false);
                  // Navigate to settings if you have that route
                }}
                className="w-full flex items-center gap-3 text-left text-sm px-4 py-2.5
                           text-[#3C3C3C] dark:text-[#EAEAEA]
                           hover:bg-[#E8E7E0] dark:hover:bg-[#3A3A3A]
                           transition-colors"
              >
                <Settings size={16} />
                <span>Settings</span>
              </button>

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