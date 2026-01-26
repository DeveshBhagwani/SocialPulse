import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function TopPostsBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/analytics/top-posts")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data.length) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <h3 className="font-semibold mb-4">Top Posts</h3>
        <p className="text-gray-500">No post data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="font-semibold mb-4">Top Posts</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis
            dataKey="text"
            tick={false}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="engagement" fill="#16a34a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
