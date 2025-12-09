import React, { useState, useEffect } from "react";
import { updateUserField } from "../../utils/updateUserField";
import {
    Briefcase,
    GraduationCap,
    Award,
    Users,
    Hash,
    BookOpen,
    BadgeCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";
import GenericTileDisplay from "./GenericTileDisplay";
import GenericModalForm from "./GenericModalForm";

export default function ProfileHeader({ profile, setProfile, onEditClick, readOnly = false }) {
    const navigate = useNavigate();
    const firstName = (profile?.displayName || "User").split(" ")[0];

    const [modalType, setModalType] = useState(null);
    const closeModal = () => setModalType(null);

    const [connectionsCount, setConnectionsCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [completion, setCompletion] = useState(0);

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

    useEffect(() => {
        if (!profile?.uid) return;
        const fetchCounts = async () => {
            try {
                const connQuery1 = query(
                    collection(db, "connections"),
                    where("requesterId", "==", profile.uid),
                    where("status", "==", "accepted")
                );
                const connSnap1 = await getDocs(connQuery1);

                const connQuery2 = query(
                    collection(db, "connections"),
                    where("receiverId", "==", profile.uid),
                    where("status", "==", "accepted")
                );
                const connSnap2 = await getDocs(connQuery2);

                setConnectionsCount(connSnap1.size + connSnap2.size);

                const projQuery = query(
                    collection(db, "collaborations"),
                    where("memberIds", "array-contains", profile.uid)
                );
                const projSnap = await getDocs(projQuery);
                setProjectsCount(projSnap.size);
            } catch (err) {
                console.error("Error fetching counts:", err);
            }
        };
        fetchCounts();
    }, [profile?.uid]);

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
            <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#D94F04] via-[#E86C2E] to-[#F9F8F3] dark:from-[#D94F04] dark:via-[#C44303] dark:to-[#1A1A1A] border border-[#E2E1DB] dark:border-[#3A3A3A] shadow-lg">
                <div className="p-5">
                    {/* Top: Name + Avatar Row */}
                    <div className="flex items-start justify-between gap-6 mb-4">
                        {/* Left: Name + Role + Availability */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-6xl sm:text-7xl font-black text-white leading-none tracking-tight">
                                    {firstName.toUpperCase()}
                                </h1>
                                {completion === 100 && (
                                    <BadgeCheck className="w-10 h-10 text-blue-500" fill="currentColor" stroke="white" strokeWidth={1.5} />
                                )}
                            </div>
                            <p className="text-lg font-semibold text-white/95 mb-1">
                                {profile.headline || "No headline"}
                            </p>
                            <p className="text-sm text-white/75 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                {profile.availability || "Availability not set"}
                            </p>

                            {/* Stats - Compact */}
                            <div className="flex items-center gap-6 mt-3">
                                <div>
                                    <span className="text-2xl font-bold text-white">{connectionsCount}</span>
                                    <span className="text-xs text-white/70 ml-1">connections</span>
                                </div>
                                <div className="w-px h-6 bg-white/20"></div>
                                <div>
                                    <span className="text-2xl font-bold text-white">{projectsCount}</span>
                                    <span className="text-xs text-white/70 ml-1">projects</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Avatar + Button */}
                        <div className="flex flex-col items-end gap-3">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-white/20 bg-white/10 shadow-xl flex-shrink-0">
                                {profile.photoURL ? (
                                    <img
                                        src={`${profile.photoURL}?sz=300`}
                                        alt={`${profile.displayName || "User"} avatar`}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                                        {initials}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={onEditClick}
                                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-white text-[#D94F04] hover:bg-white/90 transition-all shadow-md"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Skills + Learning Row */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <Hash className="w-3.5 h-3.5 text-white/85" />
                                <span className="text-xs font-bold text-white/85 uppercase tracking-wide">Skills</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.length ? (
                                    skills.slice(0, 6).map((s, idx) => (
                                        <span
                                            key={s + idx}
                                            className="text-xs bg-white/15 text-white px-2.5 py-1 rounded-md font-medium"
                                        >
                                            {s}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-white/60">No skills yet</span>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-1.5 mb-2">
                                <BookOpen className="w-3.5 h-3.5 text-white/85" />
                                <span className="text-xs font-bold text-white/85 uppercase tracking-wide">Learning</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {wants.length ? (
                                    wants.slice(0, 4).map((s, idx) => (
                                        <span
                                            key={s + idx}
                                            className="text-xs bg-white/10 text-white px-2.5 py-1 rounded-md font-medium"
                                        >
                                            {s}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-white/60">Nothing listed</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Completion Bar */}
                    {completion < 100 && (
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs font-semibold text-white/90">Profile Completion</span>
                                <span className="text-xs font-bold text-white">{completion}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-300"
                                    style={{ width: `${completion}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Tiles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
