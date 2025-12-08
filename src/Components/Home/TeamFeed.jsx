import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader, UserPlus, Check } from "lucide-react"
import { useFirestore } from "../../Hooks/useFirestore.js";
import { useAuth } from "../../Contexts/AuthContext";
import { where } from "firebase/firestore";

export default function TeamFeed() {
  const { getCollection, addDocument } = useFirestore();
  const { currentUser } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingConnectionIds, setPendingConnectionIds] = useState([]);
  const [connectingId, setConnectingId] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);

        // Fetch all users
        const users = await getCollection("users");

        // Fetch pending requests made by current user
        let myPendingIds = [];
        if (currentUser) {
          const pendingReqs = await getCollection("connections", [
            where("requesterId", "==", currentUser.uid),
            where("status", "==", "pending")
          ]);
          myPendingIds = pendingReqs.map(r => r.receiverId);
          setPendingConnectionIds(myPendingIds);
        }

        // Fetch current user's existing connections (Accepted)
        let connectedUserIds = [];
        if (currentUser) {
          // My Sent Connections (Accepted)
          const sent = await getCollection("connections", [
            where("requesterId", "==", currentUser.uid),
            where("status", "==", "accepted")
          ]);
          // My Received Connections (Accepted)
          const received = await getCollection("connections", [
            where("receiverId", "==", currentUser.uid),
            where("status", "==", "accepted")
          ]);

          connectedUserIds = [
            ...sent.map(c => c.receiverId),
            ...received.map(c => c.requesterId)
          ];
        }

        const formattedMembers = users
          .filter(u => {
            if (currentUser && u.id === currentUser.uid) return false; // Filter self

            // Filter out ALREADY connected users
            if (connectedUserIds.includes(u.id)) return false;

            // Filter out PENDING connections
            if (myPendingIds.includes(u.id)) return false;

            return true;
          })
          .map(u => {
            // Robust credibility check
            let cred = u.credibilityscore ?? u.credibilityScore ?? u.credibility?.score ?? "N/A";
            if (typeof cred === 'number') cred = cred.toFixed(1);

            return {
              id: u.id,
              name: (u.displayName || u.name || "Anonymous").split(" ")[0],
              fullName: u.displayName || u.name || "Anonymous",
              role: u.headline || u.role || "Member",
              credibility: cred,
              projects: u.projectCount || 0,
              connections: u.connectionCount || 0,
              photoURL: u.photoURL || "",
            };
          });

        // LEADERBOARD SORTING
        // Weighted Score: Credibility (High) > Projects (Medium) > Connections (Low)
        formattedMembers.sort((a, b) => {
          const getVal = (v) => (v === "N/A" || !v) ? 0 : Number(v);

          const scoreA = (getVal(a.credibility) * 50) + (getVal(a.projects) * 5) + (getVal(a.connections) * 1);
          const scoreB = (getVal(b.credibility) * 50) + (getVal(b.projects) * 5) + (getVal(b.connections) * 1);

          return scoreB - scoreA; // Descending
        });

        setMembers(formattedMembers);
      } catch (err) {
        console.error("Error fetching team feed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMembers();
    }
  }, [getCollection, currentUser]);

  const handleConnect = async (targetUser) => {
    if (!currentUser) return;
    if (connectingId) return; // Prevent double click

    setConnectingId(targetUser.id);
    try {
      // 1. Create Connection Request
      await addDocument("connections", {
        requesterId: currentUser.uid,
        requesterName: currentUser.displayName || currentUser.email,
        receiverId: targetUser.id,
        status: "pending",
        createdAt: new Date().toISOString()
      });

      // 2. Create Notification for Target User
      await addDocument("notifications", {
        type: "connection_request",
        message: `${currentUser.displayName || "Someone"} wants to connect with you`,
        userUid: targetUser.id, // Receiver
        senderId: currentUser.uid, // Sender
        senderName: currentUser.displayName || "Someone",
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // 3. Update State
      setPendingConnectionIds(prev => [...prev, targetUser.id]);
      // alert("Connection request sent!");

    } catch (err) {
      console.error("Error sending connection request:", err);
      alert("Failed to connect.");
    } finally {
      setConnectingId(null);
    }
  };

  const next = () => setCurrentIndex((i) => (i + 1) % members.length);
  const prev = () =>
    setCurrentIndex((i) => (i - 1 + members.length) % members.length);

  /* ---------------- AUTO SLIDE EVERY 5 SEC ---------------- */
  useEffect(() => {
    if (members.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % members.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [members.length]);

  if (loading) {
    return <div className="flex justify-center p-10"><Loader className="animate-spin text-orange-500" /></div>;
  }

  if (members.length === 0) {
    return <div className="p-5 text-center text-gray-500">No members found.</div>;
  }

  const current = members[currentIndex];
  const isPending = pendingConnectionIds.includes(current.id);

  return (
    <div className="w-full">

      {/* HEADER WITH ARROWS */}
      <div className="flex items-center justify-between mb-2 pr-1">
        <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-white">
          Find Your Team
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="w-8 h-8 rounded-full 
            flex items-center justify-center 
            hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
          >
            <ChevronLeft className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
          </button>

          <button
            onClick={next}
            className="w-8 h-8 rounded-full 
            flex items-center justify-center 
            hover:bg-[#F5F4F0] dark:hover:bg-[#252525] transition"
          >
            <ChevronRight className="w-4 h-4 text-[#2B2B2B] dark:text-white" />
          </button>
        </div>
      </div>

      {/* CARD */}
      <div
        className="
          relative w-full max-w-sm mx-auto 
          rounded-2xl bg-[#FCFCF9] dark:bg-[#2B2B2B] 
          border border-[#E2E1DB] dark:border-[#3A3A3A]
          p-5 h-[380px]
        "
      >
        <div className="flex flex-col h-full">

          {/* HEADER SECTION */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E1DB] dark:border-[#3A3A3A]">

            {/* LEFT */}
            <div className="flex flex-col min-w-0">
              <h3 className="font-semibold text-base text-[#1f1f1f] dark:text-white leading-tight truncate">
                {current.name}
              </h3>

              <button
                onClick={() => !isPending && handleConnect(current)}
                disabled={isPending || connectingId === current.id}
                className={`
                  mt-2 flex items-center gap-1.5 px-4 py-1.5 rounded-full transition w-fit text-xs font-medium
                  ${isPending
                    ? "bg-gray-100 dark:bg-[#333] text-gray-500 cursor-default"
                    : "bg-[#D94F04] dark:bg-[#E86C2E] hover:bg-[#bf4404] dark:hover:bg-[#D94F04] text-white"}
                `}
              >
                {connectingId === current.id ? (
                  <>
                    <Loader size={12} className="animate-spin" /> Connecting...
                  </>
                ) : isPending ? (
                  <>
                    <Check size={12} /> Pending
                  </>
                ) : (
                  <>
                    <UserPlus size={12} /> Connect
                  </>
                )}
              </button>
            </div>

            {/* RIGHT — AVATAR */}
            <div
              className="
                w-16 h-16 rounded-xl flex items-center justify-center
                text-white text-2xl font-light
                bg-gradient-to-br from-[#D94F04] to-[#E86C2E]
                flex-shrink-0
              "
            >
              {current.photoURL ? (
                <img
                  src={current.photoURL}
                  alt={current.name}
                  className="w-full h-full rounded-xl object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                current.name.charAt(0)
              )}
            </div>
          </div>

          {/* 2×2 STATS */}
          <div className="grid grid-cols-2 gap-3 mt-3">

            {/* CREDIBILITY */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/15 to-transparent dark:from-[#D94F04]/20" />
              <p className="text-[10px] text-[#8A877C]">Credibility</p>
              <p className="text-xl font-light text-[#D94F04] mt-1">
                {current.credibility}
              </p>
            </div>

            {/* PROJECTS */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E86C2E]/15 to-transparent dark:from-[#E86C2E]/20" />
              <p className="text-[10px] text-[#8A877C]">Projects</p>
              <p className="text-5xl font-light text-[#2B2B2B] dark:text-gray-200 mt-1">
                {current.projects}
              </p>
            </div>

            {/* CONNECTIONS */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D94F04]/12 to-transparent dark:from-[#D94F04]/18" />
              <p className="text-[10px] text-[#8A877C]">Connections</p>
              <p className="text-3xl font-light text-[#2B2B2B] dark:text-gray-200 mt-1">
                {current.connections}
              </p>
            </div>

            {/* ROLE */}
            <div className="relative rounded-xl px-4 py-5 
              bg-[#FCFCF9] dark:bg-[#2B2B2B] 
              border border-[#E2E1DB] dark:border-[#3A3A3A] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E86C2E]/15 to-transparent dark:from-[#E86C2E]/20" />
              <p className="text-[10px] text-[#8A877C]">Role</p>
              <p className="text-sm font-bold text-[#E36324] mt-1 truncate">
                {current.role}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-1.5 mt-4">
        {members.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex
              ? "w-6 bg-[#2B2B2B] dark:bg-white"
              : "w-1.5 bg-[#E2E1DB] dark:bg-[#333]"
              }`}
          />
        ))}
      </div>
    </div >
  );
}
