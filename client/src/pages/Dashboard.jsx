import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import EngagementLineChart from "../components/charts/EngagementLineChart";
import TopPostsBarChart from "../components/charts/TopPostsBarChart";
import AudienceGrowthChart from "../components/charts/AudienceGrowthChart";
import StatCard from "../components/StatCard";
import SkeletonCard from "../components/SkeletonCard";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    api.get("/analytics/summary")
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-8 py-10">

          {/* Header + Date Selector */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Analytics Dashboard
            </h2>

            <div className="flex bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setDays(7)}
                className={`px-4 py-2 text-sm font-medium ${
                  days === 7
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Last 7 Days
              </button>

              <button
                onClick={() => setDays(30)}
                className={`px-4 py-2 text-sm font-medium ${
                  days === 30
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          {!stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard title="Total Posts" value={stats.totalPosts} />
              <StatCard title="Total Likes" value={stats.totalLikes} />
              <StatCard title="Total Comments" value={stats.totalComments} />
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EngagementLineChart days={days} />
            <TopPostsBarChart />
            <AudienceGrowthChart days={days} />
          </div>

        </div>
      </main>
    </div>
  );
}
