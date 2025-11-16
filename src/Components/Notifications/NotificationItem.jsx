import React from "react";
import { MessageSquare, Users, Bell, Zap, Award, CheckCircle } from "lucide-react";

export default function NotificationItem({ 
  type, 
  senderName, 
  message, 
  timeAgo, 
  isRead, 
  onClick 
}) {
  const getNotificationConfig = (type) => {
    const configs = {
      mention: {
        icon: MessageSquare,
        color: "from-blue-500 to-indigo-600",
        bgLight: "bg-blue-50",
        bgDark: "dark:bg-blue-950/20",
        iconColor: "text-blue-600 dark:text-blue-400"
      },
      collaboration: {
        icon: Users,
        color: "from-purple-500 to-pink-600",
        bgLight: "bg-purple-50",
        bgDark: "dark:bg-purple-950/20",
        iconColor: "text-purple-600 dark:text-purple-400"
      },
      system: {
        icon: Bell,
        color: "from-green-500 to-emerald-600",
        bgLight: "bg-green-50",
        bgDark: "dark:bg-green-950/20",
        iconColor: "text-green-600 dark:text-green-400"
      },
      achievement: {
        icon: Award,
        color: "from-yellow-500 to-amber-600",
        bgLight: "bg-yellow-50",
        bgDark: "dark:bg-yellow-950/20",
        iconColor: "text-yellow-600 dark:text-yellow-400"
      },
      update: {
        icon: Zap,
        color: "from-orange-500 to-red-600",
        bgLight: "bg-orange-50",
        bgDark: "dark:bg-orange-950/20",
        iconColor: "text-orange-600 dark:text-orange-400"
      }
    };
    return configs[type] || configs.system;
  };

  const config = getNotificationConfig(type);
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isRead
          ? "bg-white dark:bg-[#1A1A1A] border-[#E2E1DB] dark:border-gray-800 hover:bg-[#F9F8F3] dark:hover:bg-[#0B0B0B]"
          : "bg-[#FFF4E6] dark:bg-[#E86C2E]/5 border-[#FFE4CC] dark:border-[#E86C2E]/20 hover:bg-[#FFE9D5] dark:hover:bg-[#E86C2E]/10"
      }`}
    >
      {/* Unread Indicator Dot */}
      {!isRead && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#D94F04] dark:bg-[#E86C2E] rounded-full" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${config.bgLight} ${config.bgDark} flex items-center justify-center ${isRead ? "" : "ring-2 ring-[#D94F04]/20 dark:ring-[#E86C2E]/20"}`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-sm text-[#2B2B2B] dark:text-gray-100 leading-relaxed">
            {senderName && (
              <span className="font-semibold">{senderName}</span>
            )}{" "}
            <span className={isRead ? "text-[#6B6B6B] dark:text-gray-400" : "text-[#3C3C3C] dark:text-gray-300"}>
              {message}
            </span>
          </p>
        </div>

        {/* Time */}
        <p className="text-xs text-[#8A877C] dark:text-gray-500">
          {timeAgo}
        </p>
      </div>

      {/* Read Indicator */}
      {isRead && (
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        </div>
      )}
    </div>
  );
}