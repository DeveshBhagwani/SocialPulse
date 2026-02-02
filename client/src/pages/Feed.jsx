import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import SkeletonCard from "../components/SkeletonCard";

export default function Feed() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    api.get("/posts/feed")
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Your Feed
          </h2>

          {!posts ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Your feed is empty
              </p>
              <p className="text-sm text-gray-500">
                Follow users to see their posts here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm p-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <a
                      href={`/users/${post.user._id}`}
                      className="font-semibold text-gray-900 dark:text-gray-100 hover:underline"
                    >
                      {post.user.username}
                    </a>
                    <span className="text-sm text-gray-400">
                      {new Date(post.createdAt).toDateString()}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-gray-800 dark:text-gray-200 mb-4">
                    {post.text}
                  </p>

                  {/* Engagement */}
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span>❤️ {post.likes.length}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
