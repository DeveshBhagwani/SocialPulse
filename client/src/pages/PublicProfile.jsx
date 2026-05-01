import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import SkeletonCard from "../components/SkeletonCard";

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load profile")
      );
  }, [id]);

  const handleFollow = async () => {
    if (!data) return;

    const endpoint = data.isFollowing
      ? `/users/${id}/unfollow`
      : `/users/${id}/follow`;

    setSaving(true);
    setError("");

    try {
      const res = await api.post(endpoint);
      setData((current) => ({
        ...current,
        isFollowing: !current.isFollowing,
        stats: {
          ...current.stats,
          followers: res.data.followers
        },
        user: {
          ...current.user,
          followers: Array.from({ length: res.data.followers }),
          following: current.user.following
        }
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update follow");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-950 dark:text-gray-100">
            Public Profile
          </h2>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!data ? (
            <SkeletonCard />
          ) : (
            <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div className="flex items-center gap-6">
                  <img
                    src={data.user.avatar || "https://placehold.co/160x160?text=SP"}
                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                    alt="Profile"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-100">
                      {data.user.username}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-300">
                      {data.user.bio || "No bio added yet."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleFollow}
                  disabled={saving}
                  className={`rounded-lg px-5 py-2 text-sm font-semibold transition disabled:opacity-60 ${
                    data.isFollowing
                      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      : "bg-gray-950 text-white hover:bg-gray-800"
                  }`}
                >
                  {data.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                {[
                  ["Posts", data.stats.posts],
                  ["Likes", data.stats.likes],
                  ["Comments", data.stats.comments],
                  ["Followers", data.stats.followers],
                  ["Following", data.stats.following]
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <p className="text-xl font-semibold text-gray-950 dark:text-gray-100">
                      {value}
                    </p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
