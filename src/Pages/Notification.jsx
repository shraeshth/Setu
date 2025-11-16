import React, { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext.jsx";
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { Loader, AlertCircle } from "lucide-react";

// Import notification components
import NotificationHeader from "../Components/Notifications/NotificationHeader.jsx";
import NotificationList from "../Components/Notifications/NotificationList.jsx";
import NotificationSidebar from "../Components/Notifications/NotificationSidebar.jsx";
import EmptyState from "../Components/Notifications/EmptyState.jsx";

export default function Notifications() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Mock data for initial development
  const mockNotifications = [
    {
      id: "1",
      type: "mention",
      senderName: "Alice Johnson",
      message: "tagged you in a comment on AI Resume Builder",
      timeAgo: "2h ago",
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      type: "collaboration",
      senderName: "Rahul Singh",
      message: "invited you to collaborate on AI Resume Builder",
      timeAgo: "5h ago",
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      type: "mention",
      senderName: "Sarah Chen",
      message: "mentioned you in Web3 Portfolio project",
      timeAgo: "8h ago",
      isRead: true,
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "4",
      type: "system",
      senderName: null,
      message: "Your streak reached 5 days! Keep going! 🔥",
      timeAgo: "1d ago",
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "5",
      type: "collaboration",
      senderName: "Michael Park",
      message: "accepted your collaboration request",
      timeAgo: "1d ago",
      isRead: true,
      createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "6",
      type: "achievement",
      senderName: null,
      message: "You've earned the 'Team Player' badge! 🏆",
      timeAgo: "2d ago",
      isRead: true,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "7",
      type: "mention",
      senderName: "Emma Davis",
      message: "replied to your comment in Marketing Dashboard",
      timeAgo: "3d ago",
      isRead: true,
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "8",
      type: "update",
      senderName: null,
      message: "New feature: Real-time collaboration is now available!",
      timeAgo: "5d ago",
      isRead: true,
      createdAt: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString()
    }
  ];

  useEffect(() => {
    // For now, use mock data
    // TODO: Replace with real Firestore query
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Use mock data
        setNotifications(mockNotifications);

        // TODO: Uncomment when ready to use Firestore
        /*
        if (currentUser) {
          const notificationsRef = collection(db, "notifications");
          const q = query(
            notificationsRef,
            where("userId", "==", currentUser.uid),
            orderBy("createdAt", "desc")
          );
          const snapshot = await getDocs(q);
          const notifs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setNotifications(notifs);
        }
        */
      } catch (err) {
        console.error("Error loading notifications:", err);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [currentUser]);

  const handleMarkAllRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );

    // TODO: Update Firestore when ready
    /*
    const unreadNotifs = notifications.filter(n => !n.isRead);
    const updatePromises = unreadNotifs.map(notif =>
      updateDoc(doc(db, "notifications", notif.id), { isRead: true })
    );
    await Promise.all(updatePromises);
    */
  };

  const handleNotificationClick = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );

    // TODO: Update Firestore when ready
    /*
    await updateDoc(doc(db, "notifications", id), { isRead: true });
    */
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
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

  // Filter notifications for empty state check
  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    return notif.type === filter;
  });

  return (
    <div className="min-h-screen bg-[#F9F8F3] dark:bg-[#0B0B0B] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <NotificationHeader
          onFilterChange={handleFilterChange}
          onMarkAllRead={handleMarkAllRead}
          unreadCount={unreadCount}
        />

        {/* Main Content */}
        <div className="flex flex-col xl:flex-row gap-6 mt-6">
          {/* Notifications List */}
          <div className="flex-1">
            {filteredNotifications.length > 0 ? (
              <NotificationList
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
                filter={filter}
              />
            ) : (
              <EmptyState filter={filter} />
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden xl:block xl:w-80 flex-shrink-0">
            <NotificationSidebar stats={stats} />
          </div>
        </div>

        {/* Mobile Sidebar (below notifications) */}
        <div className="xl:hidden mt-6">
          <NotificationSidebar stats={stats} />
        </div>
      </div>
    </div>
  );
}