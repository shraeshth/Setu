import React, { useEffect, useState, useRef } from "react";
import { useFirestore } from "../../Hooks/useFirestore";
import { limit, where } from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function HotRolesWidgetCompact() {
  const { getCollection } = useFirestore();
  const chartRef = useRef(null);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const users = (await getCollection("users", [limit(50)])) || [];
        const projects = (await getCollection("collaborations", [
          where("status", "==", "active"),
          limit(50),
        ])) || [];

        const stats = {};
        users.forEach((u) => {
          const role = (u.role || u.headline || "").toString();
          if (!role) return;
          const key = role.split(",")[0].trim();
          if (!key) return;
          stats[key] = stats[key] || { name: key, users: 0, openings: 0 };
          stats[key].users++;
        });

        projects.forEach((p) => {
          if (!Array.isArray(p.openRoles)) return;
          p.openRoles.forEach((r) => {
            const key = (r || "").toString().trim();
            if (!key) return;
            stats[key] = stats[key] || { name: key, users: 0, openings: 0 };
            stats[key].openings++;
          });
        });

        const top = Object.values(stats)
          .map((it) => ({ ...it, heat: it.openings * 2 + it.users }))
          .sort((a, b) => b.heat - a.heat)
          .slice(0, 5);

        if (!mounted) return;
        setRoles(top);
        if (top.length) setSelected(0);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("HotRoles fetch error", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();
    return () => {
      mounted = false;
    };
  }, [getCollection]);

  if (loading) {
    return (
      <div className="w-full p-3 flex items-center justify-center text-xs text-gray-500">
        Loading...
      </div>
    );
  }

  if (!roles.length) {
    return (
      <div className="w-full p-3 text-xs text-gray-500">No trending roles</div>
    );
  }

  const labels = roles.map((r) => r.name);
  const values = roles.map((r) => r.heat);
  const maxHeat = Math.max(...values, 1);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: "#D94F04",
        backgroundColor: "rgba(217,79,4,0.12)",
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#D94F04",
        pointBorderWidth: 1.5,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleFont: { size: 12, weight: "600" },
        bodyFont: { size: 11 },
        padding: 8,
        cornerRadius: 6,
        callbacks: {
          title: (items) => labels[items[0].dataIndex],
          label: (context) => {
            const r = roles[context.dataIndex];
            return `Buzz ${r.heat} — ${r.users} pros • ${r.openings} open`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#9CA3AF", font: { size: 10 }, maxRotation: 0 },
        border: { display: false },
      },
      y: { display: false, grid: { display: false }, border: { display: false } },
    },
    elements: { point: { hoverRadius: 5 } },
  };

  const current = roles[selected] || roles[0];

  return (
    <div className="w-full">
      {/* header */}
      <div className="flex items-center justify-between gap-2 mb-2 px-2">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-8 h-8 text-orange-600" />
          <div className="text-3xl font-semibold text-gray-700 dark:text-gray-100">
            {current.name}
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {current.users}p • {current.openings}o
        </div>
      </div>

      {/* compact chart */}
      <div className="h-28 mb-3 px-1">
        <Line ref={chartRef} options={options} data={data} />
      </div>


    </div>
  );
}
