import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useFirestore } from "../Hooks/useFirestore";
import { Loader, AlertCircle, ArrowLeft, GraduationCap, Briefcase, Award, Hash, BookOpen, UserPlus, Check, Clock, BadgeCheck } from "lucide-react";
import { where, query, collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

export default function GlobalProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getDocument, loading: firestoreLoading, error: firestoreError } = useFirestore();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Connection State
    const [connectionStatus, setConnectionStatus] = useState("none"); // none, pending, accepted, received
    const [connectLoading, setConnectLoading] = useState(false);

    // Stats
    const [connectionsCount, setConnectionsCount] = useState(0);
    const [projectsCount, setProjectsCount] = useState(0);
    const [completion, setCompletion] = useState(0);

    // Initials logic
    const initials = (profile?.displayName || "User")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

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
        setCompletion(Math.round((filled / fields.length) * 100));
    }, [profile]);

    useEffect(() => {
        if (!userId) {
            setError("User ID not provided");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch User Profile
                const userProfile = await getDocument("users", userId);

                if (!userProfile) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }

                setProfile(userProfile);

                // Fetch Counts
                const connQuery1 = query(collection(db, "connections"), where("requesterId", "==", userId), where("status", "==", "accepted"));
                const connSnap1 = await getDocs(connQuery1);
                const connQuery2 = query(collection(db, "connections"), where("receiverId", "==", userId), where("status", "==", "accepted"));
                const connSnap2 = await getDocs(connQuery2);
                setConnectionsCount(connSnap1.size + connSnap2.size);

                const projQuery = query(collection(db, "collaborations"), where("memberIds", "array-contains", userId));
                const projSnap = await getDocs(projQuery);
                setProjectsCount(projSnap.size);

                // Check Connection Status with Current User
                if (currentUser) {
                    if (currentUser.uid === userId) {
                        setConnectionStatus("self");
                    } else {
                        // Check if I sent request
                        const myReqQuery = query(collection(db, "connections"), where("requesterId", "==", currentUser.uid), where("receiverId", "==", userId));
                        const myReqSnap = await getDocs(myReqQuery);

                        // Check if they sent request
                        const theirReqQuery = query(collection(db, "connections"), where("requesterId", "==", userId), where("receiverId", "==", currentUser.uid));
                        const theirReqSnap = await getDocs(theirReqQuery);

                        if (!myReqSnap.empty) {
                            const data = myReqSnap.docs[0].data();
                            setConnectionStatus(data.status === "accepted" ? "accepted" : "pending");
                        } else if (!theirReqSnap.empty) {
                            const data = theirReqSnap.docs[0].data();
                            setConnectionStatus(data.status === "accepted" ? "accepted" : "received");
                        } else {
                            setConnectionStatus("none");
                        }
                    }
                }

            } catch (err) {
                console.error("Global profile fetch error:", err);
                setError("Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId, currentUser, getDocument]);


    const handleConnect = async () => {
        if (!currentUser || connectLoading) return;
        setConnectLoading(true);
        try {
            await addDoc(collection(db, "connections"), {
                requesterId: currentUser.uid,
                requesterName: currentUser.displayName || "User",
                requesterPhoto: currentUser.photoURL || "",
                receiverId: userId,
                receiverName: profile.displayName || "User",
                receiverPhoto: profile.photoURL || "",
                status: "pending",
                timestamp: serverTimestamp()
            });
            setConnectionStatus("pending");
        } catch (err) {
            console.error("Failed to send connection request", err);
            alert("Failed to send request");
        } finally {
            setConnectLoading(false);
        }
    };


    // Helper for rendering skills/wants
    const renderTags = (items, type) => {
        const list = Array.isArray(items) ? items : [];
        if (list.length === 0) return <span className="text-xs text-white/60">No {type} listed</span>;
        return list.slice(0, 6).map((s, idx) => (
            <span key={idx} className={`text-xs px-2.5 py-1 rounded-md font-medium ${type === 'learning' ? 'bg-white/10 text-white' : 'bg-white/15 text-white'}`}>
                {s}
            </span>
        ));
    };

    // Render Action Button
    const renderActionButton = () => {
        if (connectionStatus === "self") return null;

        if (connectionStatus === "accepted") {
            return (
                <button disabled className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-green-500 text-white flex items-center gap-2 cursor-default">
                    <Check className="w-4 h-4" /> Connected
                </button>
            );
        }
        if (connectionStatus === "pending") {
            return (
                <button disabled className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-white/20 text-white flex items-center gap-2 cursor-default">
                    <Clock className="w-4 h-4" /> Pending
                </button>
            );
        }
        if (connectionStatus === "received") {
            return (
                <button onClick={() => navigate("/connections")} className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-all shadow-md flex items-center gap-2">
                    Respond
                </button>
            );
        }

        return (
            <button
                onClick={handleConnect}
                disabled={connectLoading}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-white text-[#D94F04] hover:bg-white/90 transition-all shadow-md flex items-center gap-2"
            >
                {connectLoading ? <Loader className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Connect
            </button>
        );
    };


    // Loading state
    if (loading || firestoreLoading) {
        return (
            <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] flex items-center justify-center transition-colors duration-300">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-[#D94F04] animate-spin mx-auto mb-4" />
                    <p className="text-[#6B6B6B] dark:text-gray-400 font-medium">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || firestoreError) {
        return (
            <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] flex items-center justify-center p-6 transition-colors duration-300">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#2B2B2B] dark:text-gray-100 mb-3">
                        User Unavailable
                    </h2>
                    <p className="text-[#6B6B6B] dark:text-gray-400 mb-6">
                        {error || firestoreError}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300 -mt-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 py-6">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#D94F04] transition-colors dark:text-gray-400 dark:hover:text-[#D94F04]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>

                <div className="space-y-6">

                    {/* HEADER SECTION (Standalone) */}
                    <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-[#D94F04] via-[#E86C2E] to-[#F9F8F3] dark:from-[#D94F04] dark:via-[#C44303] dark:to-[#1A1A1A] border border-[#E2E1DB] dark:border-[#3A3A3A] shadow-lg">
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-6 mb-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-5xl sm:text-7xl font-black text-white leading-none tracking-tight">
                                            {(profile.displayName || "User").split(" ")[0].toUpperCase()}
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

                                <div className="flex flex-col items-end gap-3">
                                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-white/20 bg-white/10 shadow-xl flex-shrink-0">
                                        {profile.photoURL ? (
                                            <img
                                                src={`${profile.photoURL}?sz=300`}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-white">
                                                {initials}
                                            </div>
                                        )}
                                    </div>
                                    {/* CONNECT BUTTON */}
                                    {renderActionButton()}
                                </div>
                            </div>

                            {/* Skills/Learning */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <Hash className="w-3.5 h-3.5 text-white/85" />
                                        <span className="text-xs font-bold text-white/85 uppercase tracking-wide">Skills</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {renderTags(profile.skills, 'skills')}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <BookOpen className="w-3.5 h-3.5 text-white/85" />
                                        <span className="text-xs font-bold text-white/85 uppercase tracking-wide">Learning</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {renderTags(profile.wantToLearn, 'learning')}
                                    </div>
                                </div>
                            </div>

                            {/* NO COMPLETION BAR */}

                            {/* Info Tiles */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <InfoTile title="Education" icon={GraduationCap} data={profile.education} />
                                <InfoTile title="Experience" icon={Briefcase} data={profile.experience} />
                                <InfoTile title="Certifications" icon={Award} data={profile.certifications} />
                            </div>
                        </div>
                    </div>

                    {/* NO LOWER SECTION (Stats/Leaderboard) */}

                </div>
            </div>
        </div>
    );
}

// Local Helper Component for Tiles
function InfoTile({ title, icon: Icon, data = [] }) {
    const list = Array.isArray(data) ? data : [];

    return (
        <div className="p-3 rounded-xl bg-[#FCFCF9] dark:bg-[#2B2B2B] border border-[#E2E1DB] dark:border-[#3A3A3A]">
            <div className="flex items-center gap-2 mb-3">
                <Icon className="w-5 h-5 text-[#D94F04]" />
                <p className="font-medium text-sm">{title}</p>
            </div>
            <div className="space-y-2">
                {list.length === 0 && <p className="text-xs text-gray-400">No entries</p>}
                {list.slice(0, 3).map((item, i) => (
                    <div key={i} className="pb-2 border-b border-gray-100 dark:border-[#333] last:border-0 last:pb-0">
                        <p className="font-semibold text-sm text-[#2B2B2B] dark:text-white truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{item.subtitle || ""}</p>
                        {item.duration && <p className="text-[10px] text-gray-400">{item.duration}</p>}
                    </div>
                ))}
            </div>
        </div>
    )
}
