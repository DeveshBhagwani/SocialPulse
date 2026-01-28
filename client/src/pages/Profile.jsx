import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Profile() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/users/me")
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p className="p-8">Loading...</p>;

  const { user, stats } = data;

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center gap-6 mb-6">
              <img
                src={user.avatar || "https://via.placeholder.com/100"}
                className="w-24 h-24 rounded-full"
                alt="avatar"
              />
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-sm text-gray-400">
                  Joined {new Date(user.createdAt).toDateString()}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              {user.bio || "No bio yet"}
            </p>

            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-xl font-semibold">{stats.posts}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{stats.likes}</p>
                <p className="text-sm text-gray-500">Likes</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{stats.comments}</p>
                <p className="text-sm text-gray-500">Comments</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
