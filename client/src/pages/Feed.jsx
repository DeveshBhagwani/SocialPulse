import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("/posts")
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <h2 className="text-2xl font-bold mb-6">Feed</h2>

          {posts.length === 0 && (
            <p className="text-gray-500">No posts yet</p>
          )}

          <div className="space-y-6">
            {posts.map(post => (
              <div
                key={post._id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <p className="font-medium mb-2">
                  {post.user.username}
                </p>
                <p className="text-gray-700">{post.text}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
