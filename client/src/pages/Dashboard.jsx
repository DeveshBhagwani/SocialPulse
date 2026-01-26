import Sidebar from "../components/Sidebar";
import EngagementLineChart from "../components/charts/EngagementLineChart";
import TopPostsBarChart from "../components/charts/TopPostsBarChart";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>

        <div className="grid grid-cols-2 gap-6">
          <EngagementLineChart />
          <TopPostsBarChart />
        </div>
      </div>
    </div>
  );
}
