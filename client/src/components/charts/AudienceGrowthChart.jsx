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

export default function AudienceGrowthChart({ days }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get(`/analytics/audience-growth?days=${days}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [days]);

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-semibold mb-4">
          Audience Growth (Last {days} Days)
        </h3>
        <p className="text-gray-500">No follower activity yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="font-semibold mb-4">
        Audience Growth (Last {days} Days)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="_id" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="newFollowers"
            stroke="#16a34a"
            strokeWidth={3}
            dot
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
