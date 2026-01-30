import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";

export default function PublicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [id]);

  if (!data) return <p className="p-8">Loading...</p>;

  const { user, stats, isFollowing } = data;

  const handleFollow = async () => {
    const endpoint = isFollowing
      ? `/users/${id}/unfollow`
      : `/users/${id}/follow`;

    await api.post(endpoint);
    setData({ ...data, isFollowing: !isFollowing });
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                <img
                  src={user.avatar || "https://via.placeholder.com/100"}
                  className="w-24 h-24 rounded-full"
                  alt="avatar"
                />
                <div>
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <p className="text-gray-500">{user.bio || "No bio"}</p>
                </div>
              </div>

              <button
                onClick={handleFollow}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800"
                    : "bg-gray-900 text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            </div>

            <div className="grid grid-cols-5 gap-6 text-center">
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
              <div>
                <p className="text-xl font-semibold">{user.followers.length}</p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-xl font-semibold">{user.following.length}</p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}