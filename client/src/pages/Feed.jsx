import { useCallback, useContext, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import SkeletonCard from "../components/SkeletonCard";
import { AuthContext } from "../context/auth-context";

const normalizePost = (post, userId) => {
  const likes = post.likes || [];
  const comments = post.comments || [];

  return {
    ...post,
    likesCount: post.likesCount ?? likes.length,
    commentsCount: post.commentsCount ?? comments.length,
    isLiked: likes.some((like) => (like._id || like) === userId)
  };
};

export default function Feed() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [postForm, setPostForm] = useState({ text: "", image: null });
  const [commentText, setCommentText] = useState({});
  const observer = useRef(null);

  const loadPosts = useCallback(
    async (pageNumber) => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get(`/posts/feed?page=${pageNumber}&limit=10`);
        const responsePosts = Array.isArray(res.data) ? res.data : res.data.posts;
        const pagination = res.data.pagination || {};
        const normalized = responsePosts.map((post) =>
          normalizePost(post, user._id)
        );

        setPosts((current) =>
          pageNumber === 1 ? normalized : [...current, ...normalized]
        );
        setHasMore(Boolean(pagination.hasMore));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load feed");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [user._id]
  );

  useEffect(() => {
    loadPosts(page);
  }, [loadPosts, page]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((current) => current + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loading]
  );

  const handleCreatePost = async (event) => {
    event.preventDefault();

    if (!postForm.text.trim() && !postForm.image) {
      setError("Post text or image is required");
      return;
    }

    const formData = new FormData();
    formData.append("text", postForm.text);
    if (postForm.image) {
      formData.append("image", postForm.image);
    }

    try {
      const res = await api.post("/posts", formData);
      setPosts((current) => [normalizePost(res.data, user._id), ...current]);
      setPostForm({ text: "", image: null });
      event.target.reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/posts/${postId}/like`);
      setPosts((current) =>
        current.map((post) =>
          post._id === postId
            ? {
                ...post,
                isLiked: res.data.liked,
                likesCount: res.data.likes
              }
            : post
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update like");
    }
  };

  const handleComment = async (event, postId) => {
    event.preventDefault();
    const text = commentText[postId]?.trim();

    if (!text) return;

    try {
      const res = await api.post(`/posts/${postId}/comment`, { text });
      setPosts((current) =>
        current.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: res.data.comments,
                commentsCount: res.data.comments.length
              }
            : post
        )
      );
      setCommentText((current) => ({ ...current, [postId]: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add comment");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-950 dark:text-gray-100">
                Feed
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Publish updates and interact with posts from people you follow.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleCreatePost}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 mb-6"
          >
            <textarea
              value={postForm.text}
              onChange={(event) =>
                setPostForm((current) => ({
                  ...current,
                  text: event.target.value
                }))
              }
              rows="3"
              maxLength="1000"
              placeholder="Share an update..."
              className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-gray-100 outline-none focus:border-gray-900 dark:focus:border-gray-400"
            />

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setPostForm((current) => ({
                    ...current,
                    image: event.target.files?.[0] || null
                  }))
                }
                className="text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />
              <button
                type="submit"
                className="rounded-lg bg-gray-950 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Publish
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {initialLoading ? (
            <div className="space-y-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-700 dark:text-gray-200 mb-2">
                No posts in your feed yet
              </p>
              <p className="text-sm text-gray-500">
                Create your first post or follow another user to start the feed.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post, index) => {
                const isLastPost = index === posts.length - 1;

                return (
                  <article
                    key={post._id}
                    ref={isLastPost ? lastPostRef : null}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <a
                        href={`/users/${post.user._id}`}
                        className="font-semibold text-gray-950 dark:text-gray-100 hover:underline"
                      >
                        {post.user.username}
                      </a>
                      <span className="text-sm text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {post.text && (
                      <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                        {post.text}
                      </p>
                    )}

                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="mb-4 max-h-[460px] w-full rounded-lg object-cover"
                      />
                    )}

                    <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-700 pt-4 text-sm">
                      <button
                        type="button"
                        onClick={() => handleLike(post._id)}
                        className={`rounded-lg px-3 py-1.5 font-medium transition ${
                          post.isLiked
                            ? "bg-gray-950 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {post.isLiked ? "Liked" : "Like"} ({post.likesCount})
                      </button>
                      <span className="text-gray-500">
                        {post.commentsCount} comments
                      </span>
                    </div>

                    {post.comments?.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {post.comments.slice(-3).map((comment) => (
                          <div
                            key={comment._id}
                            className="rounded-lg bg-gray-50 dark:bg-gray-900 px-3 py-2"
                          >
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {comment.user?.username || "User"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <form
                      onSubmit={(event) => handleComment(event, post._id)}
                      className="mt-4 flex gap-2"
                    >
                      <input
                        type="text"
                        value={commentText[post._id] || ""}
                        onChange={(event) =>
                          setCommentText((current) => ({
                            ...current,
                            [post._id]: event.target.value
                          }))
                        }
                        placeholder="Add a comment"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-gray-900 dark:focus:border-gray-400"
                      />
                      <button
                        type="submit"
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        Comment
                      </button>
                    </form>
                  </article>
                );
              })}
            </div>
          )}

          {loading && !initialLoading && (
            <p className="py-6 text-center text-sm text-gray-500">
              Loading more posts...
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
