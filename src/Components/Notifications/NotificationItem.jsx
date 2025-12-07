import React from "react";
import {
  MessageCircle,
  FolderGit2,
  UserPlus,
  UserCheck,
  Info,
  CheckCircle2
} from "lucide-react"

export default function NotificationItem({
  type,
  senderName,
  message,
  timeAgo,
  isRead,
  onClick,
  onAccept,
  onReject
}) {
  const getNotificationConfig = (type) => {
    switch (type) {
      case 'project_request':
        return { icon: FolderGit2, color: "text-[#D94F04]" };
      case 'connection_request':
        return { icon: UserPlus, color: "text-[#2E7BE4]" };
      case 'request_accepted':
        return { icon: CheckCircle2, color: "text-green-600" };
      case 'connection_accepted':
        return { icon: UserCheck, color: "text-green-600" };
      case 'mention':
        return { icon: MessageCircle, color: "text-purple-600" };
      default:
        return { icon: Info, color: "text-gray-500" };
    }
  };

  const { icon: Icon, color } = getNotificationConfig(type);

  return (
    <div
      onClick={onClick}
      className={`
        group relative flex items-center gap-3 p-3 rounded-lg border 
        transition-all duration-200 cursor-pointer 
        ${isRead
          ? "bg-white dark:bg-[#1A1A1A] border-transparent hover:border-[#E2E1DB] dark:hover:border-[#333]"
          : "bg-[#FCFCF9] dark:bg-[#222] border-[#E2E1DB] dark:border-[#333] shadow-sm"
        }
      `}
    >
      {/* Unread Indicator Dot */}
      {!isRead && (
        <div className="absolute right-3 top-3 w-1.5 h-1.5 bg-[#D94F04] rounded-full" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 ${color}`}>
        <Icon size={20} strokeWidth={2} />
      </div>

      {/* Content Container - Row Layout */}
      <div className="flex-1 min-w-0 flex items-center justify-between gap-4">

        {/* Text Section */}
        <div className="min-w-0">
          <div className="text-sm text-[#2B2B2B] dark:text-[#EAEAEA] leading-snug">
            {senderName && <span className="font-semibold mr-1">{senderName}</span>}
            <span className="text-[#3C3C3C] dark:text-[#B0B0B0] font-normal">
              {message}
            </span>
          </div>
        </div>

        {/* Right Side: Time + Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[10px] text-[#8A877C] dark:text-[#707070] whitespace-nowrap">
            {timeAgo}
          </span>

          {/* Actions */}
          {(type === "project_request" || type === "connection_request") && !isRead && (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onAccept}
                className="px-3 py-1.5 bg-[#2B2B2B] dark:bg-[#F9F8F3] text-white dark:text-[#2B2B2B] text-xs font-semibold rounded hover:opacity-90 transition shadow-sm whitespace-nowrap"
              >
                Accept
              </button>
              <button
                onClick={onReject}
                className="px-3 py-1.5 bg-transparent border border-[#E2E1DB] dark:border-[#444] text-[#6B6B6B] dark:text-[#A0A0A0] text-xs font-medium rounded hover:bg-gray-50 dark:hover:bg-[#333] transition whitespace-nowrap"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}