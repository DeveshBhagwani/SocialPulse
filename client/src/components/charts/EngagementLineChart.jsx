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

export default function EngagementLineChart({ days }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/analytics/engagement?days=${days}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [days]); // re-fetch when days changes

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold mb-4">Engagement Over Time</h3>
        <p className="text-gray-500">No engagement data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold mb-4">
        Engagement Over Time (Last {days} Days)
      </h3>

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
