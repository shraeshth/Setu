import React from "react";
import { Star, Briefcase, GraduationCap, Award, BarChart3, FolderKanban, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ profile }) {
  const navigate = useNavigate();   // <-- FIXED: hook is called here

  const firstName = (profile?.displayName || "User").split(" ")[0];

  return (
    <div
      className="
        w-full rounded-3xl overflow-hidden
        bg-gradient-to-b from-[#D94F04] to-[#F9F8F3]
        dark:from-[#D94F04] dark:to-[#1A1A1A]
        border border-[#E2E1DB] dark:border-[#3A3A3A]
      "
    >

      {/* ===================== TOP GRADIENT HEADER ===================== */}
      <div className="relative h-55 w-full px-6 py-6">
        {/* GIANT FIRST NAME */}
        <h1
          className="
            text-7xl sm:text-9xl font-bold tracking-tight
            text-[#F9F8F3] dark:text-[#0B0B0B]
            absolute top-4 right-4 drop-shadow-xl
          "
        >
          {firstName}
        </h1>

        {/* SHORT BIO */}
        {profile.bio && (
          <p
            className="
              absolute bottom-16 right-6 right-6
              text-sm max-w-md leading-relaxed
              text-white/90 dark:text-black/80
              backdrop-blur-sm
            "
          >
            {profile.bio}
          </p>
        )}
      </div>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="px-4 -mt-16 relative z-10">

        <div className="flex gap-6 items-start">

          {/* ---------- AVATAR + NAME ---------- */}
          <div className="flex flex-col items-center">
            <div
              className="
                w-30 h-30 rounded-2xl overflow-hidden -mt-13 border border-[#E2E1DB] dark:border-[#3A3A3A]
              "
            >
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                  {firstName[0]}
                </div>
              )}
            </div>
          </div>

          {/* ---------- RIGHT SIDE STATS GRID ---------- */}
          <div className="flex flex-row gap-10 w-full mt-8 ml-2 items-center">

            {/* LEFT SMALL */}
            <div className="flex flex-row flex-1 items-center justify-between text-center">

              {/* Projects */}
              <div className="flex flex-row items-center gap-2">
                <p className="text-3xl font-semibold text-gray-100 dark:text-gray-900">
                  {profile.projects || 0}
                </p>
                <FolderKanban className="w-4 h-4 text-gray-100 dark:text-gray-900" />
              </div>

              {/* Connections */}
              <div className="flex flex-row items-center gap-2">
                <p className="text-3xl font-semibold text-gray-100 dark:text-gray-900">
                  {profile.connections || 0}
                </p>
                <Users className="w-4 h-4 text-gray-100 dark:text-gray-900" />
              </div>
            </div>

            {/* MIDDLE BIG ONE */}
            <div className="flex flex-col flex-[3] min-w-0 justify-center">
              <div className="flex justify-between text-[10px] text-gray-100 dark:text-gray-900 mb-1">
                <span>Profile Completion</span>
                <span>{profile.completion || 68}%</span>
              </div>

              <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D94F04] to-[#E86C2E]"
                  style={{ width: `${profile.completion || 68}%` }}
                ></div>
              </div>
            </div>

            {/* RIGHT SMALL */}
            <button
              onClick={() => navigate("/profile/edit")}   // <-- FIXED: correct usage
              className="
                flex-1 max-w-[120px]
                mt-0 w-full py-1 rounded-lg
                bg-white text-black
                dark:bg-black dark:text-white
                font-medium text-xs
                hover:bg-gray-800 dark:hover:bg-gray-200
                transition
              "
            >
              Edit Profile
            </button>
          </div>

        </div>

        {/* ===================== FOUR GRID BLOCKS ===================== */}
        <div className="grid grid-cols-4 gap-4 mt-4 mb-4">

          {/* EDUCATION */}
          <div
            className="
              p-4 rounded-xl border border-[#E2E1DB] dark:border-[#3A3A3A]
              bg-white dark:bg-[#121212]
              flex flex-col gap-2
            "
          >
            <GraduationCap className="w-5 h-5 text-[#D94F04]" />
            <p className="font-medium text-sm">Education</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile.education || "Add your education"}
            </p>
          </div>

          {/* EXPERIENCE */}
          <div
            className="
              p-4 rounded-xl border border-[#E2E1DB] dark:border-[#3A3A3A]
              bg-white dark:bg-[#121212]
              flex flex-col gap-2
            "
          >
            <Briefcase className="w-5 h-5 text-[#D94F04]" />
            <p className="font-medium text-sm">Experience</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile.experience || "Add experience"}
            </p>
          </div>

          {/* CERTIFICATIONS */}
          <div
            className="
              p-4 rounded-xl border border-[#E2E1DB] dark:border-[#3A3A3A]
              bg-white dark:bg-[#121212]
              flex flex-col gap-2
            "
          >
            <Award className="w-5 h-5 text-[#D94F04]" />
            <p className="font-medium text-sm">Certifications</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile.certifications || "Add certifications"}
            </p>
          </div>

          {/* ANALYTICS */}
          <div
            className="
              p-4 rounded-xl border border-[#E2E1DB] dark:border-[#3A3A3A]
              bg-white dark:bg-[#121212]
              flex flex-col gap-2
            "
          >
            <BarChart3 className="w-5 h-5 text-[#D94F04]" />
            <p className="font-medium text-sm">Analytics</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Profile views, engagement, reach
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
