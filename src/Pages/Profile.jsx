import React, { useEffect, useState } from "react";
import { useAuth } from "../Contexts/AuthContext.jsx";
import { useFirestore } from "../Hooks/useFirestore";
import { Loader, AlertCircle } from "lucide-react"
import { orderBy, limit, where } from "firebase/firestore";

// Import profile components
import ProfileHeader from "../Components/Profile/ProfileHeader";
import PerformanceBreakdown from "../Components/Profile/PerformanceBreakdown.jsx";
import Leaderboard from "../Components/Explore/LeaderBoardsStats.jsx";
import ProfileForm from "../Components/Profile/ProfileForm.jsx";

export default function Profile() {
  const { currentUser } = useAuth();
  const { getDocument, getCollection, loading: firestoreLoading, error: firestoreError } = useFirestore();
  /* New state for detailed stats */
  const [performance, setPerformance] = useState({
    efficiency: 0,
    collaboration: 0,
    consistency: 0,
    credibility: 0
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Profile
        const userProfile = await getDocument("users", currentUser.uid);

        if (userProfile) {
          setProfile(userProfile);

          // REAL DATA FETCH for Performance
          const uid = currentUser.uid;

          // 1. Tasks (Efficiency)
          const tasks = await getCollection("tasks", [where("assigneeId", "==", uid)]);
          const completed = tasks.filter(t => t.status === "Done" || t.status === "Completed" || t.status === "completed").length;
          const efficiency = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

          // 2. Projects & Connections (Collaboration)
          const queries = [
            getCollection("collaborations", [where("memberIds", "array-contains", uid)]),
            getCollection("connections", [where("requesterId", "==", uid), where("status", "==", "accepted")]),
            getCollection("connections", [where("receiverId", "==", uid), where("status", "==", "accepted")])
          ];
          const [projects, connReq, connRec] = await Promise.all(queries);

          const pCount = projects.length;
          const cCount = connReq.length + connRec.length;
          const collaboration = Math.min(100, (cCount * 5) + (pCount * 10)); // Weighted score

          // 3. Consistency (Derived: Efficiency + Project Count stability)
          const consistency = Math.min(100, Math.round((efficiency * 0.7) + 30));

          setPerformance({
            efficiency,
            collaboration,
            consistency,
            credibility: userProfile.credibilityScore || 0
          });

        } else {
          // Profile doesn't exist yet - user needs to create one
          setProfile({
            email: currentUser.email,
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            createdAt: new Date().toISOString()
          });
        }

      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, getDocument, getCollection]);

  // Handle Profile Update
  const handleProfileUpdate = (updatedData) => {
    setProfile(prev => ({ ...prev, ...updatedData }));
    setIsEditing(false);
  };

  // Force completion if key fields are missing
  const isMandatory = profile && (!profile.headline || !profile.skills || profile.skills.length === 0);

  useEffect(() => {
    if (profile && isMandatory && !loading) {
      setIsEditing(true);
    }
  }, [profile, isMandatory, loading]);

  // Not logged in
  if (!currentUser) {
    return (
      <div className="max-h-screen dark:bg-[#0B0B0B] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-gray-800 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-[#D94F04]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2B2B2B] dark:text-gray-100 mb-3">
            Authentication Required
          </h2>
          <p className="text-[#6B6B6B] dark:text-gray-400 mb-6">
            Please log in to view your profile.
          </p>

          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || firestoreLoading) {
    return (
      <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#D94F04] animate-spin mx-auto mb-4" />
          <p className="text-[#6B6B6B] dark:text-gray-400 font-medium">
            Loading your profile...
          </p>
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
            Something went wrong
          </h2>
          <p className="text-[#6B6B6B] dark:text-gray-400 mb-6">
            {error || firestoreError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white font-semibold rounded-lg transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300 -mt-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-6 py-6 ">


        {/* Profile Layout */}
        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            profile={profile}
            setProfile={setProfile}
            onEditClick={() => setIsEditing(true)}
          />
          <div className="flex gap-6">

            <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-4 mb-4 h-full">
              <PerformanceBreakdown title="Collaboration Score" score={performance.collaboration} change={5.2} />
              <PerformanceBreakdown title="Credibility Index" score={performance.credibility} change={2.1} />
              <PerformanceBreakdown title="Task Efficiency" score={performance.efficiency} change={performance.efficiency > 50 ? 4.5 : -2.3} />
              <PerformanceBreakdown title="Consistency" score={performance.consistency} change={1.8} />
            </div>
            <div className="flex-1 h-full min-w-0 mt-4 mb-4">
              <Leaderboard />
            </div>
          </div>

        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <ProfileForm
          existing={profile}
          onClose={() => setIsEditing(false)}
          onSave={handleProfileUpdate}
          mandatory={isMandatory}
        />
      )}
    </div>
  );
}