import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function EngagementLineChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/analytics/engagement?days=7")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Engagement Over Time</h3>
        <p className="text-gray-500">No engagement data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-4">Engagement Over Time</h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalEngagement"
            stroke="#2563eb"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
