import React from "react";
import { Bell, Users, Zap, MessageSquare, TrendingUp } from "lucide-react";

export default function NotificationSidebar({ stats }) {
  const defaultStats = {
    unread: stats?.unread || 0,
    collaborationInvites: stats?.collaborationInvites || 0,
    systemAlerts: stats?.systemAlerts || 0,
    mentions: stats?.mentions || 0
  };

  const statCards = [
    {
      label: "Unread",
      value: defaultStats.unread,
      icon: Bell,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      bgDark: "dark:bg-blue-950/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      label: "Collaboration Invites",
      value: defaultStats.collaborationInvites,
      icon: Users,
      color: "from-purple-500 to-pink-600",
      bgLight: "bg-purple-50",
      bgDark: "dark:bg-purple-950/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      label: "Mentions",
      value: defaultStats.mentions,
      icon: MessageSquare,
      color: "from-green-500 to-emerald-600",
      bgLight: "bg-green-50",
      bgDark: "dark:bg-green-950/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      label: "System Alerts",
      value: defaultStats.systemAlerts,
      icon: Zap,
      color: "from-orange-500 to-red-600",
      bgLight: "bg-orange-50",
      bgDark: "dark:bg-orange-950/20",
      textColor: "text-orange-600 dark:text-orange-400"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-gray-800 p-5 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D94F04] to-[#E86C2E] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-100">
            Summary
          </h2>
        </div>

        <div className="space-y-3">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-[#F9F8F3] dark:bg-[#0B0B0B] rounded-lg border border-[#E2E1DB] dark:border-gray-800 hover:border-[#D94F04] dark:hover:border-[#E86C2E] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${stat.bgLight} ${stat.bgDark} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                  </div>
                  <span className="text-sm font-medium text-[#2B2B2B] dark:text-gray-100">
                    {stat.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-[#D94F04] dark:text-[#E86C2E]">
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-gray-800 p-5 transition-colors duration-300">
        <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-gray-100 mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-300 hover:bg-[#F9F8F3] dark:hover:bg-[#0B0B0B] rounded-lg transition-colors">
            View all collaborations
          </button>
          <button className="w-full text-left px-3 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-300 hover:bg-[#F9F8F3] dark:hover:bg-[#0B0B0B] rounded-lg transition-colors">
            Notification settings
          </button>
          <button className="w-full text-left px-3 py-2.5 text-sm text-[#2B2B2B] dark:text-gray-300 hover:bg-[#F9F8F3] dark:hover:bg-[#0B0B0B] rounded-lg transition-colors">
            Mute notifications
          </button>
        </div>
      </div>

      {/* Tips Card */}
      <div className="bg-gradient-to-br from-[#FFF4E6] to-[#FFE9D5] dark:from-[#E86C2E]/10 dark:to-[#D94F04]/10 rounded-2xl border border-[#FFE4CC] dark:border-[#E86C2E]/20 p-5 transition-colors duration-300">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D94F04] dark:bg-[#E86C2E] flex items-center justify-center flex-shrink-0">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-gray-100 mb-1">
              Stay Updated
            </h3>
            <p className="text-xs text-[#6B6B6B] dark:text-gray-400 leading-relaxed">
              Enable push notifications to never miss important collaboration requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}