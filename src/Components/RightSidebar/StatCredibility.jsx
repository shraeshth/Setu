import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Tooltip } from "react-tooltip/dist/react-tooltip";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";

export default function StatCredibility({ userId }) {
  const [score, setScore] = useState(null); // numeric
  const [increase, setIncrease] = useState(0);
  const [avg, setAvg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(false);

  const breakdown = [
    { label: "Communication", value: 25 },
    { label: "Teamwork", value: 20 },
    { label: "Delivery", value: 30 },
    { label: "Initiative", value: 15 },
    { label: "Consistency", value: 10 },
  ];

  const lightColors = [
    "#FFFFFF",
    "#FBEAE0",
    "#F4BDA3",
    "#EB7A40",
    "#D94F04",
  ];

  const darkColors = [
    "#FDF4EE",
    "#FAD6C3",
    "#F4A774",
    "#E86C2E",
    "#D94F04",
  ];

  useEffect(() => {
    // detect dark mode (client-side)
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setError("userId required");
      setLoading(false);
      return;
    }

    const db = getFirestore();
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // 1) read the user doc
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          if (!cancelled) {
            setError("User not found");
            setLoading(false);
          }
          return;
        }

        const userData = userSnap.data();
        // parse credibilityscore
        let userScore =
          userData?.credibilityscore ??
          userData?.credibilityScore ??
          userData?.credibility?.score ??
          null;

        if (typeof userScore === "string") {
          // allow strings like "4.1"
          const parsed = parseFloat(userScore);
          if (!Number.isNaN(parsed)) userScore = parsed;
        }

        if (userScore == null || Number.isNaN(Number(userScore))) {
          // fallback if missing
          userScore = 0;
        } else {
          userScore = Number(userScore);
        }

        // 2) compute average across users collection (only numeric scores)
        //    keep light — fetch only first 500 users to avoid huge reads; adapt if needed
        const usersCol = collection(db, "users");
        const q = query(usersCol);
        const usersSnap = await getDocs(q);

        let sum = 0;
        let count = 0;
        usersSnap.forEach((docSnap) => {
          const d = docSnap.data();
          let s =
            d?.credibilityscore ??
            d?.credibilityScore ??
            d?.credibility?.score ??
            null;
          if (typeof s === "string") {
            const p = parseFloat(s);
            if (!Number.isNaN(p)) s = p;
            else s = null;
          }
          if (s != null && !Number.isNaN(Number(s))) {
            sum += Number(s);
            count += 1;
          }
        });

        const computedAvg = count > 0 ? sum / count : 0;

        // 3) compute increase: prefer previousCredibility field if present
        let prev =
          userData?.previousCredibility ??
          userData?.prevCredibility ??
          userData?.previous_credibility ??
          null;

        if (typeof prev === "string") {
          const p = parseFloat(prev);
          if (!Number.isNaN(p)) prev = p;
          else prev = null;
        }

        let computedIncrease;
        if (prev != null && !Number.isNaN(Number(prev))) {
          computedIncrease = userScore - Number(prev);
        } else {
          // fallback: relative to average
          computedIncrease = userScore - computedAvg;
        }

        if (!cancelled) {
          setScore(userScore);
          setAvg(Number(computedAvg.toFixed(2)));
          setIncrease(Number(computedIncrease.toFixed(2)));
          setLoading(false);
        }
      } catch (err) {
        console.error("StatCredibility fetch error:", err);
        if (!cancelled) {
          setError(err.message || "Failed to fetch credibility");
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // UI fallbacks
  if (loading) {
    return (
      <div className="rounded-xl p-4 bg-white dark:bg-[#222] border dark:border-[#333]">
        <div className="animate-pulse h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl p-4 bg-white dark:bg-[#222] border dark:border-[#333] text-sm text-red-500">
        Error: {error}
      </div>
    );
  }

  const colors = isDark ? darkColors : lightColors;

  return (
    <div
      className="relative bg-[#FCFCF9] dark:bg-[#2B2B2B]
                border border-[#E2E1DB] dark:border-[#3A3A3A]
                rounded-xl p-4 flex flex-col justify-between
                text-[#2B2B2B] dark:text-[#EAEAEA]
                overflow-hidden transition-colors duration-300"
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#D94F04]/5 to-transparent dark:from-[#D94F04]/10 rounded-xl"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium text-[#8A877C] dark:text-[#A0A0A0] tracking-wide">
          CREDIBILITY
        </p>
        <TrendingUp size={14} className="text-[#D94F04]" />
      </div>

      {/* Main Score */}
      <div className="mb-3">
        <div className="flex items-end gap-2">
          <p className="text-5xl font-thin text-[#D94F04] leading-none">
            {Number(score).toFixed(1)}
          </p>

          <div className="text-sm leading-tight mb-1">
            <p className="text-[#2E7BE4] dark:text-[#5B9FFF] font-medium">
              {increase >= 0 ? `+${increase.toFixed(2)}` : increase.toFixed(2)}
            </p>
            <p className="text-[#8A877C] dark:text-[#f9f8f3]">
              {increase >= 0 ? "since last" : "vs avg"}
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Bar */}
      <div
        className="relative w-full h-5 rounded-full overflow-hidden flex mb-3 border border-[#E2E1DB] dark:border-[#3A3A3A]"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        {breakdown.map((part, i) => {
          const width = `${part.value}%`;
          const backgroundColor = colors[i] || colors[colors.length - 1];

          return (
            <div
              key={part.label}
              data-tooltip-id={`tooltip-${i}`}
              data-tooltip-content={`${part.label}: ${part.value}%`}
              style={{
                width,
                backgroundColor,
                minWidth: 1,
                height: "100%",
                transition: "transform .15s ease",
              }}
              className="h-full cursor-pointer hover:scale-y-105"
            />
          );
        })}
      </div>

      {/* Tooltip elements */}
      {breakdown.map((_, i) => (
        <Tooltip
          key={i}
          id={`tooltip-${i}`}
          place="top"
          style={{
            backgroundColor: "#2B2B2B",
            color: "#FCFCF9",
            fontSize: "0.75rem",
            borderRadius: "6px",
            padding: "4px 8px",
          }}
        />
      ))}

      {/* Footer */}
      <div className="flex justify-between text-xs text-[#8A877C] dark:text-[#A0A0A0]">
        <span>Avg: {avg != null ? Number(avg).toFixed(1) : "—"}</span>
        <span className="font-medium">{/* placeholder for future */}</span>
      </div>
    </div>
  );
}
