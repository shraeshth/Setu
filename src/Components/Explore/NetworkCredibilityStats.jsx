import React, { useEffect, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { Globe } from "lucide-react";

export default function NetworkCredibilityStats() {
  const { getCollection } = useFirestore();
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all users to calculate total points
        // In a real app, this should be a dedicated stats document updated via Cloud Functions
        const users = await getCollection("users");
        const total = users.reduce((acc, user) => acc + (user.credibilityScore || 0) * 10, 0);
        setTotalPoints(total);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [getCollection]);

  return (
    <div className="h-full bg-[#FCFCF9] dark:bg-[#1A1A1A] rounded-2xl 
      border border-[#E2E1DB] dark:border-[#333] p-6 flex flex-col justify-center
      transition-colors duration-300 relative overflow-hidden group">

      {/* Background Globe Icon */}
      <div className="absolute -right-12 -bottom-12 text-[#E2E1DB] dark:text-[#333] 
                      transition-transform duration-500 group-hover:rotate-12">
        <Globe size={180} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="text-5xl font-bold text-[#D94F04]">
          {totalPoints.toLocaleString()}
        </div>
        <div className="text-xs text-[#8A877C] dark:text-[#A0A0A0] mt-0 font-thin">
          <span className="font-medium text-sm">Community Collaboration Points</span>
          <br />
          Overall credibility accumulated by  <br />the entire community.
        </div>
      </div>
    </div>
  );
}
