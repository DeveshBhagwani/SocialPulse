import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import EngagementLineChart from "../components/charts/EngagementLineChart";
import TopPostsBarChart from "../components/charts/TopPostsBarChart";
import StatCard from "../components/StatCard";
import api from "../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/analytics/summary")
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-10">

          <h2 className="text-3xl font-bold mb-8">
            Analytics Dashboard
          </h2>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard
              title="Total Posts"
              value={stats ? stats.totalPosts : "—"}
            />
            <StatCard
              title="Total Likes"
              value={stats ? stats.totalLikes : "—"}
            />
            <StatCard
              title="Total Comments"
              value={stats ? stats.totalComments : "—"}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <EngagementLineChart />
            <TopPostsBarChart />
          </div>

        </div>
      </main>
    </div>
  );
}
