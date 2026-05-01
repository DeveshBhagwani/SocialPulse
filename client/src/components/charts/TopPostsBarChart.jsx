import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TopPostsBarChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/analytics/top-posts")
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hasPosts = data.some((post) => post.engagement > 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-semibold mb-4 text-gray-950 dark:text-gray-100">
        Top Posts
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading post performance...</p>
      ) : !data.length ? (
        <p className="text-gray-500">No posts yet</p>
      ) : !hasPosts ? (
        <p className="text-gray-500">No post engagement yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="text" tick={false} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="engagement" name="Engagement" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
