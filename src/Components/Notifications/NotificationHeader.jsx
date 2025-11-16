import React, { useState } from "react";
import { CheckCheck, Filter, ChevronDown } from "lucide-react";

export default function NotificationHeader({ onFilterChange, onMarkAllRead, unreadCount }) {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filters = [
    { id: "all", label: "All Notifications" },
    { id: "mentions", label: "Mentions" },
    { id: "collaboration", label: "Collaboration Requests" },
    { id: "system", label: "System" }
  ];

  const handleFilterChange = (filterId) => {
    setSelectedFilter(filterId);
    setShowFilterDropdown(false);
    if (onFilterChange) onFilterChange(filterId);
  };

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl border border-[#E2E1DB] dark:border-gray-800 p-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title and Badge */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#2B2B2B] dark:text-gray-100">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-1 bg-[#D94F04] dark:bg-[#E86C2E] text-white text-xs font-semibold rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Filter Dropdown - Desktop */}
          <div className="hidden sm:flex gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.id
                    ? "bg-[#D94F04] dark:bg-[#E86C2E] text-white shadow-sm"
                    : "bg-[#F9F8F3] dark:bg-[#0B0B0B] text-[#2B2B2B] dark:text-gray-300 hover:bg-[#E2E1DB] dark:hover:bg-gray-800"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Filter Dropdown - Mobile */}
          <div className="relative sm:hidden">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F9F8F3] dark:bg-[#0B0B0B] text-[#2B2B2B] dark:text-gray-300 rounded-lg border border-[#E2E1DB] dark:border-gray-800 hover:bg-[#E2E1DB] dark:hover:bg-gray-800 transition-all"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">
                {filters.find(f => f.id === selectedFilter)?.label}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showFilterDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowFilterDropdown(false)}
                />
                <div className="absolute top-full mt-2 right-0 w-56 bg-white dark:bg-[#1A1A1A] border border-[#E2E1DB] dark:border-gray-800 rounded-lg shadow-lg z-20 overflow-hidden">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterChange(filter.id)}
                      className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                        selectedFilter === filter.id
                          ? "bg-[#FFF4E6] dark:bg-[#E86C2E]/10 text-[#D94F04] dark:text-[#E86C2E]"
                          : "text-[#2B2B2B] dark:text-gray-300 hover:bg-[#F9F8F3] dark:hover:bg-[#0B0B0B]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mark All Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04] text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all read</span>
              <span className="sm:hidden">Mark read</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}