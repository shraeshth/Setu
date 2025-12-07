import React, { useEffect, useState } from "react";
import { User, UserCheck, Users } from "lucide-react"
import { useFirestore } from "../../Hooks/useFirestore";
import { useAuth } from "../../Contexts/AuthContext";
import { where, limit } from "firebase/firestore";

export default function ConnectionsListWidget() {
  const { getCollection } = useFirestore();
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;
      try {
        // Fetch accepted connections or pending requests
        const data = await getCollection("connections", [
          where("receiverId", "==", currentUser.uid),
          limit(5)
        ]);

        setConnections(data.map(c => ({
          ...c,
          icon: c.status === "accepted" ? UserCheck : User,
          name: c.requesterName || "Unknown User", // Ideally fetch user details
          statusText: c.status === "accepted" ? "Connected" : "Sent you a request",
          time: "Recently" // Timestamp logic can be added
        })));
      } catch (err) {
        console.error("Error fetching connections widget:", err);
      }
    };
    fetchConnections();
  }, [currentUser, getCollection]);

  if (connections.length === 0) return <div className="text-xs text-gray-500">No recent connections.</div>;

  return (
    <div className="h-full flex flex-col">

      {/* Items */}
      <div className="space-y-2 overflow-y-auto pr-1">
        {connections.map((c, i) => (
          <div
            key={i}
            className="
              flex items-start gap-2
              border-b border-[#E2E1DB] dark:border-[#3A3A3A] 
              pb-1 last:border-b-0
              transition-all cursor-pointer
            "
          >
            <c.icon className="w-4 h-4 text-[#D94F04]" />

            <div className="flex-1">
              <p className="text-xs text-[#3C3C3C] dark:text-gray-300 leading-tight font-medium">
                {c.name}
              </p>

              <p className="text-[11px] text-[#6A6A6A] dark:text-gray-400 leading-tight">
                {c.statusText}
              </p>

              <span className="text-[10px] text-[#8A877C] dark:text-gray-500">
                {c.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
