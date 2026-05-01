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
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/analytics/summary?days=${days}`)
      .then((res) => {
        setStats(res.data);
        setError("");
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load analytics")
      );
  }, [days]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-950 dark:text-gray-100">
                Analytics Dashboard
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Track engagement, post performance, and audience movement.
              </p>
            </div>

            <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {[7, 30].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDays(option)}
                  className={`px-4 py-2 text-sm font-medium ${
                    days === option
                      ? "bg-gray-950 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {option} Days
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">
              <StatCard title="Total Posts" value={stats.totalPosts} />
              <StatCard title="Total Likes" value={stats.totalLikes} />
              <StatCard title="Comments" value={stats.totalComments} />
              <StatCard title="Followers" value={stats.currentFollowers} />
              <StatCard title={`${days} Day Net`} value={stats.followerDelta} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EngagementLineChart days={days} />
            <TopPostsBarChart />
            <div className="lg:col-span-2">
              <AudienceGrowthChart days={days} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
