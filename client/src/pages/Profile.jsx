import { useEffect, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import SkeletonCard from "../components/SkeletonCard";

export default function Profile() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ bio: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setData(res.data);
        setForm({
          bio: res.data.user.bio || "",
          avatar: res.data.user.avatar || ""
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load profile");
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await api.put("/users/me", form);
      setData((current) => ({
        ...current,
        user: res.data.user
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <h2 className="text-3xl font-bold mb-8 text-gray-950 dark:text-gray-100">
            Profile
          </h2>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!data ? (
            <SkeletonCard />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
              <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <img
                    src={
                      data.user.avatar ||
                      "https://placehold.co/160x160?text=SP"
                    }
                    className="w-24 h-24 rounded-full object-cover border border-gray-200"
                    alt="Profile"
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-950 dark:text-gray-100">
                      {data.user.username}
                    </h3>
                    <p className="text-gray-500">{data.user.email}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Joined {new Date(data.user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-8">
                  {data.user.bio || "No bio added yet."}
                </p>

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

              <form
                onSubmit={handleSubmit}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-fit"
              >
                <h3 className="font-semibold text-gray-950 dark:text-gray-100 mb-4">
                  Edit Profile
                </h3>

                <label className="block mb-4">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </span>
                  <textarea
                    value={form.bio}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        bio: event.target.value
                      }))
                    }
                    rows="4"
                    className="mt-1 w-full resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-gray-900 dark:focus:border-gray-400"
                  />
                </label>

                <label className="block mb-5">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Avatar URL
                  </span>
                  <input
                    type="url"
                    value={form.avatar}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        avatar: event.target.value
                      }))
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-gray-900 dark:focus:border-gray-400"
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-gray-950 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
