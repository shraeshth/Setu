import React, { useEffect, useState } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { orderBy, limit } from "firebase/firestore";

export default function NoticeBoard() {
  const { getCollection } = useFirestore();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getCollection("notices", [
          orderBy("createdAt", "desc"),
          limit(20)
        ]);
        setNotices(data.map(n => ({
          ...n,
          time: n.time || "Just now",
          day: n.day || "Today"
        })));
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, [getCollection]);

  if (notices.length === 0) return <div className="text-xs text-gray-500">No notices.</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-2 overflow-y-auto h-full pr-1
                      scrollbar-thin scrollbar-thumb-[#D3D2C9] dark:scrollbar-thumb-[#4A4A4A] scrollbar-track-transparent">
        {notices.map((n) => (
          <div
            key={n.id}
            className="border-b border-[#E2E1DB] dark:border-[#3A3A3A] pb-1 last:border-b-0"
          >
            <h4
              className="font-medium cursor-pointer text-sm line-clamp-1 
              transition-colors duration-200 
              text-[#1E3E88] dark:text-[#5B9FFF] 
              hover:text-[#2E7BE4] dark:hover:text-[#7AB8FF]"
            >
              {n.title}
            </h4>
            <p className="text-xs font-medium text-[#2E7BE4] dark:text-[#5B9FFF]">
              {n.time} — {n.day}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
