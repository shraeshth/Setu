import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext.jsx";
import { collection, query, where, orderBy, onSnapshot, writeBatch, doc, updateDoc, getDocs, limit, arrayUnion, getDoc } from "firebase/firestore"
import { db } from "../firebase.js";
import { Loader, AlertCircle } from "lucide-react"
import { useFirestore } from "../Hooks/useFirestore";
import { useNavigate } from "react-router-dom";

// Import notification components
import NotificationHeader from "../Components/Notifications/NotificationHeader.jsx";
import NotificationList from "../Components/Notifications/NotificationList.jsx";
import EmptyState from "../Components/Notifications/EmptyState.jsx";

export default function Notifications() {
  const { currentUser } = useAuth();
  const { addDocument } = useFirestore(); // Helper for adding notifications
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    // Real-time listener for notifications
    const q = query(
      collection(db, "notifications"),
      where("userUid", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
      setLoading(false);
    }, (err) => {
      console.error("Error loading notifications:", err);
      // setError("Failed to load notifications."); // Suppress generic error for cleaner UI
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkAllRead = async () => {
    try {
      const batch = writeBatch(db);
      const unreadNotifs = notifications.filter(n => !n.isRead);

      if (unreadNotifs.length === 0) return;

      unreadNotifs.forEach(notif => {
        const ref = doc(db, "notifications", notif.id);
        batch.update(ref, { isRead: true });
      });

      await batch.commit();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      // 1. Mark as read if needed
      if (!notif.isRead) {
        await updateDoc(doc(db, "notifications", notif.id), { isRead: true });
      }

      // 2. Navigate based on type
      switch (notif.type) {
        case 'project_request':
        case 'request_accepted':
        case 'collaboration':
          navigate('/workspace');
          break;
        case 'connection_request':
        case 'connection_accepted':
          navigate('/profile');
          break;
        case 'mention':
          navigate('/workspace');
          break;
        default:
          // No specific navigation
          break;
      }

    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  const handleAcceptProjectRequest = async (notification) => {
    if (!notification.projectId || !notification.senderId) return;
    try {
      // 1. Find the pending request
      const q = query(
        collection(db, "project_requests"),
        where("projectId", "==", notification.projectId),
        where("requesterId", "==", notification.senderId),
        where("status", "==", "pending"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("Request not found or already handled.");
        return;
      }
      const requestDoc = snap.docs[0];
      const requestData = requestDoc.data();

      // 2. Add member to project
      const newMember = {
        uid: requestData.requesterId,
        name: requestData.requesterName || "New Member",
        role: "member",
        joinedAt: new Date().toISOString()
      };

      const projectRef = doc(db, "collaborations", notification.projectId);

      // Check if user is already a member to avoid duplicates
      const projectSnap = await getDoc(projectRef);
      if (projectSnap.exists()) {
        const projData = projectSnap.data();
        if (projData.memberIds && projData.memberIds.includes(requestData.requesterId)) {
          alert("User is already a member.");
          // Just update request status
          await updateDoc(requestDoc.ref, { status: "accepted" });
          return;
        }
      }

      await updateDoc(projectRef, {
        members: arrayUnion(newMember),
        memberIds: arrayUnion(requestData.requesterId)
      });

      // 3. Update Request Status
      await updateDoc(requestDoc.ref, { status: "accepted" });

      // 4. Notify Requester
      await addDocument("notifications", {
        type: "request_accepted",
        message: `Your request to join the project was accepted!`,
        userUid: requestData.requesterId,
        senderId: currentUser.uid,
        projectId: notification.projectId,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // 5. Mark THIS notification as read
      await updateDoc(doc(db, "notifications", notification.id), { isRead: true });

      alert("Request accepted!");

    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Failed to accept request.");
    }
  };

  const handleRejectProjectRequest = async (notification) => {
    if (!notification.projectId || !notification.senderId) return;
    try {
      // 1. Find the pending request
      const q = query(
        collection(db, "project_requests"),
        where("projectId", "==", notification.projectId),
        where("requesterId", "==", notification.senderId),
        where("status", "==", "pending"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("Request not found or already handled.");
        return;
      }
      const requestDoc = snap.docs[0];

      // 2. Update Request Status
      await updateDoc(requestDoc.ref, { status: "rejected" });

      // 3. Mark notification as read
      await updateDoc(doc(db, "notifications", notification.id), { isRead: true });

      alert("Request rejected.");
    } catch (err) {
      console.error("Error rejecting request:", err);
    }
  };

  const handleAcceptConnection = async (notification) => {
    // notification.senderId is the requester
    if (!notification.senderId) return;
    try {
      // 1. Find pending connection request
      const q = query(
        collection(db, "connections"),
        where("requesterId", "==", notification.senderId),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", "pending"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) {
        alert("Connection request not found.");
        return;
      }
      const connDoc = snap.docs[0];

      // 2. Update connections document
      await updateDoc(connDoc.ref, { status: "accepted" });

      // 3. Notify Requester
      await addDocument("notifications", {
        type: "connection_accepted",
        message: `${currentUser.displayName || "Someone"} accepted your connection request`,
        userUid: notification.senderId,
        senderId: currentUser.uid,
        isRead: false,
        createdAt: new Date().toISOString()
      });

      // 5. Mark THIS notification as read
      await updateDoc(doc(db, "notifications", notification.id), { isRead: true });

      alert("Connection accepted!");

    } catch (err) {
      console.error("Error accepting connection:", err);
      alert("Failed to accept connection.");
    }
  };

  const handleRejectConnection = async (notification) => {
    if (!notification.senderId) return;
    try {
      const q = query(
        collection(db, "connections"),
        where("requesterId", "==", notification.senderId),
        where("receiverId", "==", currentUser.uid),
        where("status", "==", "pending"),
        limit(1)
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        await updateDoc(snap.docs[0].ref, { status: "rejected" });
      }
      await updateDoc(doc(db, "notifications", notification.id), { isRead: true });
      alert("Connection rejected.");
    } catch (err) {
      console.error(err);
    }
  };


  // Calculate stats
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const stats = {
    unread: unreadCount,
    collaborationInvites: notifications.filter(n => n.type === "collaboration" && !n.isRead).length,
    mentions: notifications.filter(n => n.type === "mention" && !n.isRead).length,
    systemAlerts: notifications.filter(n => n.type === "system" && !n.isRead).length
  };

  // Not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] flex items-center justify-center p-6 transition-colors duration-300">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-white dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-gray-800 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-[#D94F04]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2B2B2B] dark:text-gray-100 mb-3">
            Authentication Required
          </h2>
          <p className="text-[#6B6B6B] dark:text-gray-400 mb-6">
            Please log in to view your notifications.
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
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <Loader className="w-12 h-12 text-[#D94F04] animate-spin mx-auto mb-4" />
          <p className="text-[#6B6B6B] dark:text-gray-400 font-medium">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
            {error}
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
    <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-4">
        {/* Header */}
        <NotificationHeader
          onMarkAllRead={handleMarkAllRead}
          unreadCount={unreadCount}
        />

        {/* Main Content */}
        <div className="mt-6">
          {notifications.length > 0 ? (
            <NotificationList
              notifications={notifications}
              onNotificationClick={(id) => {
                const notif = notifications.find(n => n.id === id);
                handleNotificationClick(notif);
              }}
              onAccept={handleAcceptProjectRequest}
              onReject={handleRejectProjectRequest}
              onAcceptConnection={handleAcceptConnection}
              onRejectConnection={handleRejectConnection}
            />
          ) : (
            <EmptyState />
          )}
        </div>
      </div >
    </div >
  );
}