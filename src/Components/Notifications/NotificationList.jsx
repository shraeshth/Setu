import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications, onNotificationClick, filter, onAccept, onReject, onAcceptConnection, onRejectConnection }) {

  const parseDate = (val) => {
    if (!val) return new Date();
    if (val.toDate && typeof val.toDate === 'function') return val.toDate(); // Firestore Timestamp
    return new Date(val); // String or Date object
  };

  // Helper: format "time ago"
  const getTimeAgo = (dateInput) => {
    if (!dateInput) return "";
    const date = parseDate(dateInput);
    const now = new Date();
    const diffInSec = Math.floor((now - date) / 1000);

    if (diffInSec < 60) return "Just now";

    const minutes = Math.floor(diffInSec / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(diffInSec / 3600);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;

    // "12 May" format
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  // Group notifications by date
  const groupNotificationsByDate = (notifications) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [] // Catch-all for older
    };

    notifications.forEach((notification) => {
      const notifDate = parseDate(notification.createdAt);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      if (notifDay.getTime() === today.getTime()) {
        groups.today.push(notification);
      } else if (notifDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification);
      } else if (notifDate > lastWeek) {
        groups.thisWeek.push(notification);
      } else {
        // Everything else goes to "This Month" (as a catch-all per user request to hide "Older")
        // Alternatively, we could visually label it "Earlier" but user asked for "This Month"
        groups.thisMonth.push(notification);
      }
    });

    return groups;
  };

  // Filter notifications based on selected filter
  // The instruction implies removing this filter and treating all notifications as "all"
  // const filteredNotifications = notifications.filter(notif => {
  //   if (filter === "all") return true;
  //   return notif.type === filter;
  // });

  const groupedNotifications = groupNotificationsByDate(notifications);

  const renderGroup = (title, notifications) => {
    if (notifications.length === 0) return null;

    return (
      <div key={title} className="mb-6 last:mb-0">
        <h3 className="text-sm font-medium text-[#8A877C] dark:text-gray-500 mb-3 px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              type={notification.type}
              senderName={notification.senderName}
              message={notification.message}
              timeAgo={getTimeAgo(notification.createdAt)}
              isRead={notification.isRead}
              onClick={() => onNotificationClick(notification.id)}
              onAccept={
                notification.type === 'project_request' ? (onAccept ? () => onAccept(notification) : null) :
                  notification.type === 'connection_request' ? (onAcceptConnection ? () => onAcceptConnection(notification) : null) : null
              }
              onReject={
                notification.type === 'project_request' ? (onReject ? () => onReject(notification) : null) :
                  notification.type === 'connection_request' ? (onRejectConnection ? () => onRejectConnection(notification) : null) : null
              }
            />
          ))}
        </div>
      </div>
    );
  };

  if (notifications.length === 0) {
    return null; // EmptyState will be shown by parent
  }

  return (
    <div className="space-y-6">
      {renderGroup("Today", groupedNotifications.today)}
      {renderGroup("Yesterday", groupedNotifications.yesterday)}
      {renderGroup("This Week", groupedNotifications.thisWeek)}
      {renderGroup("This Month", groupedNotifications.thisMonth)}
    </div>
  );
}