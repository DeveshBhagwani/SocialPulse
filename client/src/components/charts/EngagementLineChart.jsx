import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });

export default function EngagementLineChart({ days }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/analytics/engagement?days=${days}`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [days]);

  const hasEngagement = data.some((item) => item.totalEngagement > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-semibold mb-4 text-gray-950 dark:text-gray-100">
        Engagement Over Time
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading engagement data...</p>
      ) : !hasEngagement ? (
        <p className="text-gray-500">No likes or comments in this period yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis allowDecimals={false} />
            <Tooltip labelFormatter={formatDate} />
            <Line
              type="monotone"
              dataKey="likes"
              name="Likes"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="comments"
              name="Comments"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
