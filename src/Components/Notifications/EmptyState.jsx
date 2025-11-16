import React from "react";
import { Bell, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ filter }) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case "mentions":
        return {
          title: "No mentions yet",
          description: "When someone mentions you in a comment or discussion, you'll see it here.",
          action: "Explore projects",
          link: "/explore"
        };
      case "collaboration":
        return {
          title: "No collaboration requests",
          description: "Collaboration invites from other users will appear here.",
          action: "Find teammates",
          link: "/discover"
        };
      case "system":
        return {
          title: "No system notifications",
          description: "Important updates and alerts from Setu will be shown here.",
          action: "Go to dashboard",
          link: "/home"
        };
      default:
        return {
          title: "You're all caught up! 🎉",
          description: "No new notifications right now. Check back later for updates.",
          action: "Explore projects",
          link: "/explore"
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-gray-800 p-12 transition-colors duration-300">
      <div className="max-w-md mx-auto text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFF4E6] to-[#FFE9D5] dark:from-[#E86C2E]/10 dark:to-[#D94F04]/10 border-2 border-[#FFE4CC] dark:border-[#E86C2E]/20 flex items-center justify-center">
            <Bell className="w-10 h-10 text-[#D94F04] dark:text-[#E86C2E]" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#D94F04] dark:bg-[#E86C2E] flex items-center justify-center shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#2B2B2B] dark:text-gray-100 mb-2">
          {content.title}
        </h3>

        {/* Description */}
        <p className="text-[#6B6B6B] dark:text-gray-400 text-sm leading-relaxed mb-6">
          {content.description}
        </p>

        {/* Action Button */}
        <Link
          to={content.link}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md group"
        >
          <span>{content.action}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-[#E2E1DB] dark:border-gray-800">
          <p className="text-xs text-[#8A877C] dark:text-gray-500">
            💡 Tip: Enable notifications in your{" "}
            <Link to="/settings" className="text-[#D94F04] dark:text-[#E86C2E] hover:underline font-medium">
              settings
            </Link>{" "}
            to stay updated
          </p>
        </div>
      </div>
    </div>
  );
}