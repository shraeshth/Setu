import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Github,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Loader
} from "lucide-react";

import { Radar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

import { useFirestore } from "../../Hooks/useFirestore";
import { useAuth } from "../../Contexts/AuthContext";
import { collection, query, where, getDocs, limit, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ReviewFeed() {
  const { currentUser } = useAuth();
  const { getCollection, addDocument } = useFirestore();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [userRatings, setUserRatings] = useState({
    Design: 50,
    Performance: 50,
    Quality: 50,
    Usability: 50,
    Scalability: 50,
    Innovation: 50
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Design", "Performance", "Quality", "Usability", "Scalability", "Innovation"];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const rawProjects = await getCollection("collaborations", [
          where("status", "==", "completed"),
          limit(30)
        ]);

        const otherUsersProjects = rawProjects.filter(
          (p) => {
            const isCreator = (p.createdBy === currentUser?.uid) || (p.ownerId === currentUser?.uid);
            const isMember = p.members?.some(m => (typeof m === 'string' ? m : m.uid) === currentUser?.uid) || p.memberIds?.includes(currentUser?.uid);
            return !isCreator && !isMember;
          }
        );

        const processed = (await Promise.all(
          otherUsersProjects.map(async (p) => {
            let authorName = "user";

            try {
              const userRef = doc(db, "users", p.createdBy);
              const userSnap = await getDoc(userRef);

              if (userSnap.exists()) {
                authorName = userSnap.data()?.displayName || "user";
              }
            } catch (err) {
              console.log("Error fetching author:", err);
            }

            const rRef = collection(db, "reviews");
            const q = query(rRef, where("projectId", "==", p.id));
            const snapshot = await getDocs(q);
            const reviews = snapshot.docs.map((d) => d.data());

            // Filter if user has already reviewed
            if (reviews.some(r => r.reviewerId === currentUser?.uid)) {
              return null;
            }

            let avgRadar = [50, 50, 50, 50, 50, 50];
            let overallRating = 0;

            if (reviews.length > 0) {
              const sums = { Design: 0, Performance: 0, Quality: 0, Usability: 0, Scalability: 0, Innovation: 0 };

              reviews.forEach((r) => {
                sums.Design += r.ratings.Design ?? 0;
                sums.Performance += r.ratings.Performance ?? 0;
                sums.Quality += r.ratings.Quality ?? 0;
                sums.Usability += r.ratings.Usability ?? 0;
                sums.Scalability += r.ratings.Scalability ?? 0;
                sums.Innovation += r.ratings.Innovation ?? 0;
              });

              avgRadar = [
                Math.round(sums.Design / reviews.length),
                Math.round(sums.Performance / reviews.length),
                Math.round(sums.Quality / reviews.length),
                Math.round(sums.Usability / reviews.length),
                Math.round(sums.Scalability / reviews.length),
                Math.round(sums.Innovation / reviews.length)
              ];

              // Calculate overall rating out of 5
              const totalAvg = avgRadar.reduce((acc, curr) => acc + curr, 0);
              overallRating = (totalAvg / avgRadar.length) / 20;
            }

            return {
              ...p,
              radar: avgRadar,
              overallRating: overallRating.toFixed(1),
              totalReviews: reviews.length,
              author: authorName,
              links: { repo: p.repoUrl || "#", demo: p.demoUrl || "#" }
            };
          })
        )).filter(Boolean);

        setProjects(processed);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [getCollection, currentUser]);

  const resetRatings = () => {
    setUserRatings({
      Design: 50,
      Performance: 50,
      Quality: 50,
      Usability: 50,
      Scalability: 50,
      Innovation: 50
    });
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % projects.length);
    resetRatings();
  };

  const prev = () => {
    setCurrentIndex((i) => (i - 1 + projects.length) % projects.length);
    resetRatings();
  };

  const handleVote = (category, delta) => {
    setUserRatings((prev) => ({
      ...prev,
      [category]: Math.max(0, Math.min(100, prev[category] + delta)),
    }));
  };

  const handleSubmitReview = async () => {
    if (!currentUser) return alert("Please login.");

    setIsSubmitting(true);

    try {
      const currentProject = projects[currentIndex];

      await addDocument("reviews", {
        projectId: currentProject.id,
        reviewerId: currentUser.uid,
        ratings: userRatings,
        createdAt: new Date().toISOString()
      });

      alert("Review submitted!");
      next();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review.");
    }
    setIsSubmitting(false);
  };

  if (loading)
    return (
      <div className="flex justify-center p-10">
        <Loader className="animate-spin text-orange-500" />
      </div>
    );

  if (projects.length === 0)
    return (
      <div className="p-5 text-center text-gray-500">
        No projects from others to review.
      </div>
    );

  const current = projects[currentIndex];

  const radarData = {
    labels: categories,
    datasets: [
      {
        label: "Average Score",
        data: current.radar,
        backgroundColor: "rgba(217,79,4,0.25)",
        borderColor: "#D94F04",
        borderWidth: 1.5,
        pointBackgroundColor: "#D94F04",
        pointRadius: 2,
      },
      {
        label: "Your Rating",
        data: Object.values(userRatings),
        backgroundColor: "rgba(50,50,50,0.1)",
        borderColor: "#888",
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 2,
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 100,
        ticks: { display: false },
        pointLabels: {
          display: true,
          font: { size: 9, family: "sans-serif" },
          color: "#888",
        },
        grid: { color: "rgba(128,128,128,0.15)" },
        angleLines: { color: "rgba(128,128,128,0.15)" },
      },
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2 pr-2">
        <h2 className="text-lg font-semibold text-[#2B2B2B] dark:text-gray-200">
          Review Projects
        </h2>

        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center">
            <ChevronLeft size={16} />
          </button>

          <button onClick={next} className="w-8 h-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* CARD */}
      <div className="relative w-full h-[380px] bg-[#FCFCF9] dark:bg-[#2B2B2B] border border-[#E2E1DB] dark:border-[#3A3A3A] rounded-xl p-4 flex flex-col justify-between">

        {/* TOP SECTION */}
        <div>
          <div className="flex justify-between items-start mb-1">
            <div className="pr-2">
              <h3 className="text-sm font-semibold text-[#2B2B2B] dark:text-white line-clamp-1">
                {current.title}
              </h3>
              <p className="text-[10px] text-[#7d7b73] dark:text-gray-400">
                by {current.author}
              </p>
            </div>

            <div className="text-right shrink-0">
              {parseFloat(current.overallRating) > 0 && (
                <div className="text-3xl font-bold text-[#D94F04] leading-none">
                  {current.overallRating}
                </div>
              )}
              <div className="text-[9px] text-[#7d7b73] dark:text-gray-400 mt-0.5">
                {current.totalReviews} reviews
              </div>
            </div>
          </div>

          {/* PROJECT DESCRIPTION (2 lines max) */}
          {current.description && (
            <p className="text-[10px] text-[#3C3C3C] dark:text-gray-400 mb-2 leading-snug line-clamp-2">
              {current.description}
            </p>
          )}

          {/* RADAR */}
          <div className="relative w-full h-32 mb-2">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* VOTING CONTROLS */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-2">
          {categories.map((cat) => (
            <div
              key={cat}
              className="flex items-center justify-between text-[10px] bg-[#F6F5F2] dark:bg-[#333] px-2 py-1 rounded"
            >
              <span className="text-[#2B2B2B] dark:text-gray-200 truncate mr-1">
                {cat}
              </span>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => handleVote(cat, -10)}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                >
                  <ChevronDown size={12} />
                </button>
                <button
                  onClick={() => handleVote(cat, +10)}
                  className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                >
                  <ChevronUp size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting}
            className={`
    w-full text-center
    text-white text-xs font-medium
    py-2 rounded-lg transition-colors

    ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed dark:bg-gray-700"
                : "bg-[#D94F04] hover:bg-[#bf4404] dark:bg-[#E86C2E] dark:hover:bg-[#D94F04]"}
  `}
          >
            {isSubmitting ? "..." : "Submit"}
          </button>



          <div className="flex gap-1">
            <a
              href={current.links.repo}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#2B2B2B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Repository"
            >
              <Github size={14} />
            </a>
            <a
              href={current.links.demo}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-[#2B2B2B] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              title="Live Demo"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>

      {/* DOTS */}
      <div className="flex justify-center gap-1.5 mt-4">
        {projects.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === currentIndex
              ? "w-6 bg-[#2B2B2B] dark:bg-white"
              : "w-1.5 bg-[#E2E1DB] dark:bg-[#333]"
              }`}
          ></div>
        ))}
      </div>
    </>
  );
}
