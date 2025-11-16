import React from "react";
import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications, onNotificationClick, filter }) {
  // Group notifications by date
  const groupNotificationsByDate = (notifications) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      older: []
    };

    notifications.forEach((notification) => {
      const notifDate = new Date(notification.createdAt);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      if (notifDay.getTime() === today.getTime()) {
        groups.today.push(notification);
      } else if (notifDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification);
      } else if (notifDate >= thisWeek) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    return notif.type === filter;
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

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
              timeAgo={notification.timeAgo}
              isRead={notification.isRead}
              onClick={() => onNotificationClick(notification.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  if (filteredNotifications.length === 0) {
    return null; // EmptyState will be shown by parent
  }

  return (
    <div className="space-y-6">
      {renderGroup("Today", groupedNotifications.today)}
      {renderGroup("Yesterday", groupedNotifications.yesterday)}
      {renderGroup("This Week", groupedNotifications.thisWeek)}
      {renderGroup("Older", groupedNotifications.older)}
    </div>
  );
}