import React, { useState, useEffect } from "react";
import { updateUserField } from "../../utils/updateUserField";
import {
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
  Users,
  Hash,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Firestore imports
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";

// GENERIC COMPONENTS
import GenericTileDisplay from "./GenericTileDisplay";
import GenericModalForm from "./GenericModalForm";

export default function ProfileHeader({ profile, setProfile, onEditClick }) {
  const navigate = useNavigate();
  const firstName = (profile?.displayName || "User").split(" ")[0];

  const [modalType, setModalType] = useState(null);
  const closeModal = () => setModalType(null);

  // New state for counts & completion
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [completion, setCompletion] = useState(0);

  // =====================================================
  // CONFIG FOR ALL THREE MODALS
  // =====================================================

  const FIELD_CONFIGS = {
    education: {
      title: "Add Education",
      icon: GraduationCap,
      key: "education",
      fields: [
        { name: "title", placeholder: "Degree / Course" },
        { name: "subtitle", placeholder: "Institution" },
        { name: "duration", placeholder: "Years (e.g. 2020 - 2024)" },
      ],
    },

    experience: {
      title: "Add Experience",
      icon: Briefcase,
      key: "experience",
      fields: [
        { name: "title", placeholder: "Job Title" },
        { name: "subtitle", placeholder: "Company / Role" },
        { name: "duration", placeholder: "Duration (e.g. 2021 - 2023)" },
      ],
    },

    certifications: {
      title: "Add Certification",
      icon: Award,
      key: "certifications",
      fields: [
        { name: "title", placeholder: "Certification Name" },
        { name: "subtitle", placeholder: "Issued By" },
        { name: "duration", placeholder: "Year (e.g. 2023)" },
      ],
    },
  };

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleSaveEntry = async (typeKey, newEntry) => {
    const existing = Array.isArray(profile[typeKey]) ? profile[typeKey] : [];
    const updatedList = [...existing, newEntry];

    await updateUserField(profile.uid, typeKey, updatedList);

    setProfile((prev) => ({
      ...prev,
      [typeKey]: updatedList,
    }));

    closeModal();
  };

  const handleDeleteEntry = async (typeKey, index) => {
    const existing = Array.isArray(profile[typeKey]) ? profile[typeKey] : [];
    const updatedList = existing.filter((_, i) => i !== index);

    await updateUserField(profile.uid, typeKey, updatedList);

    setProfile((prev) => ({
      ...prev,
      [typeKey]: updatedList,
    }));
  };

  // -------------------------------------------------
  // Fetch connections & projects count, compute completion
  // -------------------------------------------------
  useEffect(() => {
    if (!profile?.uid) return;
    const fetchCounts = async () => {
      try {
        // Connections where user is requester or receiver
        const connQuery = query(
          collection(db, "connections"),
          where("requesterId", "==", profile.uid),
          where("status", "==", "accepted")
        );
        const connSnap = await getDocs(connQuery);
        const receiverQuery = query(
          collection(db, "connections"),
          where("receiverId", "==", profile.uid),
          where("status", "==", "accepted")
        );
        const receiverSnap = await getDocs(receiverQuery);
        setConnectionsCount(connSnap.size + receiverSnap.size);

        // Projects (collaborations) where memberIds array contains uid
        const projQuery = query(
          collection(db, "collaborations"),
          where("memberIds", "array-contains", profile.uid)
        );
        const projSnap = await getDocs(projQuery);
        setProjectsCount(projSnap.size);
      } catch (err) {
        // non-fatal
        // eslint-disable-next-line no-console
        console.error("Error fetching counts:", err);
      }
    };
    fetchCounts();
  }, [profile?.uid]);

  // Compute profile completion percentage (simple heuristic)
  useEffect(() => {
    if (!profile) return;
    const fields = [
      "displayName",
      "bio",
      "headline",
      "availability",
      "photoURL",
      "skills",
      "wantToLearn",
      "education",
      "experience",
      "certifications",
    ];
    const filled = fields.filter((f) => {
      const val = profile[f];
      if (Array.isArray(val)) return val.length > 0;
      return val && val !== "";
    }).length;
    const percent = Math.round((filled / fields.length) * 100);
    setCompletion(percent);
  }, [profile]);

  // helpers for chips
  const skills = Array.isArray(profile?.skills)
    ? profile.skills
    : typeof profile?.skills === "string" && profile.skills.length
      ? profile.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const wants = Array.isArray(profile?.wantToLearn)
    ? profile.wantToLearn
    : typeof profile?.wantToLearn === "string" && profile.wantToLearn.length
      ? profile.wantToLearn.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

  const initials = (profile?.displayName || "User")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <>
      {/* HEADER WRAPPER */}
      <div
        className="
          w-full rounded-3xl overflow-hidden
          bg-gradient-to-b from-[#D94F04] to-[#F9F8F3]
          dark:from-[#D94F04] dark:to-[#1A1A1A]
          border border-[#E2E1DB] dark:border-[#3A3A3A]
        "
      >
        {/* TOP HEADER */}
        <div className="relative h-48 w-full px-6 py-6">
          <h1
            className="
              text-7xl sm:text-9xl font-bold tracking-tight
              text-white/90 dark:text-black/80
              absolute top-1 right-4
            "
          >
            {firstName.toUpperCase()}
          </h1>

          {/* BIO */}
          {(profile.bio ?? "") !== "" && (
            <p
              className="
                absolute bottom-10 right-6
                text-sm max-w-md leading-relaxed
                text-white dark:text-gray-900
              "
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* MAIN BLOCK */}
        <div className="px-4 pb-4 mt-0 relative z-10">
          <div className="flex gap-6 items-start">
            {/* AVATAR */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-32 h-25 rounded-2xl overflow-hidden absolute -top-44 left-4">
                {profile.photoURL ? (
                  <img
                    src={`${profile.photoURL}?sz=300`}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-700 dark:text-gray-300">
                    {firstName[0]}
                  </div>
                )}
              </div>
            </div>

            {/* INFO BLOCK */}
            <div className="flex-1 flex flex-col gap-4">
              {/* HEADLINE & AVAILABILITY */}
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  {profile.headline || "No headline"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {profile.availability || "Availability not set"}
                </p>

                {/* SKILLS chips + icon */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200 mr-2">
                    <Hash className="w-4 h-4" />
                    <span className="font-medium">Skills</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {skills.length ? (
                      skills.slice(0, 6).map((s, idx) => (
                        <span
                          key={s + idx}
                          className="text-[11px] bg-white/80 dark:bg-black/10 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-md shadow-sm"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-600 dark:text-gray-400">No skills yet</span>
                    )}
                  </div>
                </div>

                {/* WANT TO LEARN chips + icon */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200 mr-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">Learning</span>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {wants.length ? (
                      wants.slice(0, 4).map((s, idx) => (
                        <span
                          key={s + idx}
                          className="text-[11px] bg-white/60 dark:bg-black/8 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-md shadow-sm"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-600 dark:text-gray-400">Nothing listed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* STATS ROW */}
              <div className="flex items-center gap-8">
                {/* CONNECTIONS & PROJECTS */}
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {connectionsCount}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Connections
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {projectsCount}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Projects
                    </span>
                  </div>
                </div>

                {/* PROFILE COMPLETION BAR */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300 mb-1.5">
                    <span className="font-medium">Profile Completion</span>
                    <span className="font-semibold">{completion}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D94F04] to-[#E86C2E] transition-all duration-500"
                      style={{ width: `${completion}%` }}
                    ></div>
                  </div>
                </div>

                {/* EDIT BUTTON */}
                <button
                  onClick={onEditClick}
                  className="
                    px-6 py-2 rounded-lg text-sm font-medium
                    text-gray-900 dark:text-white
                    bg-white dark:bg-gray-800
                    border-2 border-gray-300 dark:border-gray-600
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    hover:border-gray-400 dark:hover:border-gray-500
                    transition-all
                    flex-shrink-0
                  "
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* ====================== TILE SECTIONS ====================== */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <GenericTileDisplay
              title="Education"
              icon={GraduationCap}
              data={profile.education || []}
              max={3}
              onAdd={() => setModalType("education")}
              onDelete={(i) => handleDeleteEntry("education", i)}
            />

            <GenericTileDisplay
              title="Experience"
              icon={Briefcase}
              data={profile.experience || []}
              max={3}
              onAdd={() => setModalType("experience")}
              onDelete={(i) => handleDeleteEntry("experience", i)}
            />

            <GenericTileDisplay
              title="Certifications"
              icon={Award}
              data={profile.certifications || []}
              max={3}
              onAdd={() => setModalType("certifications")}
              onDelete={(i) => handleDeleteEntry("certifications", i)}
            />
          </div>
        </div>
      </div>

      {/* ====================== MODAL ====================== */}
      {modalType && (
        <GenericModalForm
          title={FIELD_CONFIGS[modalType].title}
          fields={FIELD_CONFIGS[modalType].fields}
          initialData={{}}
          onSave={(formData) =>
            handleSaveEntry(FIELD_CONFIGS[modalType].key, formData)
          }
          onClose={closeModal}
        />
      )}
    </>
  );
}
