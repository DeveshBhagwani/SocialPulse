import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      window.location.href = "/";
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign In
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border rounded w-full p-2 mb-4"
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border rounded w-full p-2 mb-6"
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button className="w-full bg-gray-900 text-white py-2 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}
