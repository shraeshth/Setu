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
        if (Array.isArray(data)) {
          setNotices(data.map(n => ({
            ...n,
            time: n.time || "Just now",
            day: n.day || "Today"
          })));
        } else {
          setNotices([]);
        }
      } catch (err) {
        console.error("Error fetching notices:", err);
      }
    };
    fetchNotices();
  }, [getCollection]);

  if (notices.length === 0)
    return <div className="text-xs text-gray-500">No notices.</div>;

  return (
    <div className="h-full flex flex-col relative overflow-hidden rounded-lg group">

      <div
        className="space-y-1 overflow-y-auto h-full pb-4
                 scrollbar-thin scrollbar-thumb-[#D3D2C9] dark:scrollbar-thumb-[#4A4A4A]
                 scrollbar-track-transparent relative z-10"
      >
        {notices.map((n) => (
          <div
            key={n.id}
            className="border-b border-[#E2E1DB]/50 dark:border-[#3A3A3A] p-1 last:border-b-0
                       hover:bg-[#F0F0F0] dark:hover:bg-black/20 transition-all"
          >
            {/* MAIN TITLE - Dark Blue in Light Mode, White in Dark Mode */}
            <h4
              className="font-medium cursor-pointer text-sm line-clamp-1
                       transition-colors duration-200
                       text-[#1E3E88] dark:text-[#ffffff]
                       hover:text-[#2E7BE4] dark:hover:text-[#f0f0f0]"
            >
              {n.title}
            </h4>

            {/* INFO TEXT */}
            <p
              className="text-xs font-medium
                       text-[#2E7BE4] dark:text-[#5B9FFF]"
            >
              {n.time} — {n.day}
            </p>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#FCFCF9] dark:from-[#2B2B2B] via-[#FCFCF9]/80 dark:via-[#2B2B2B]/80 to-transparent pointer-events-none z-20" />
    </div>
  );

}
