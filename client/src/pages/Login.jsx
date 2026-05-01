import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/auth-context";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const res = await api.post(endpoint, payload);

      login(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <section className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-500 mb-2">
            SocialPulse
          </p>
          <h1 className="text-3xl font-bold text-gray-950">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`rounded-md py-2 text-sm font-medium transition ${
              !isRegister
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode("register")}
            className={`rounded-md py-2 text-sm font-medium transition ${
              isRegister
                ? "bg-white text-gray-950 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Signup
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Username</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                required
              />
            </label>
          )}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-950 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
