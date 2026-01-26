import Sidebar from "../components/Sidebar";
import EngagementLineChart from "../components/charts/EngagementLineChart";
import TopPostsBarChart from "../components/charts/TopPostsBarChart";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-10">

          {/* Page Title */}
          <h2 className="text-3xl font-bold mb-8">
            Analytics Dashboard
          </h2>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard title="Total Posts" value="—" />
            <StatCard title="Total Likes" value="—" />
            <StatCard title="Total Comments" value="—" />
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
