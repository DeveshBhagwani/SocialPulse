import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Sidebar() {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-100 px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">
        SocialPulse
      </h1>

      <nav className="space-y-4 text-sm flex-1">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "block text-white font-medium"
              : "block text-gray-400 hover:text-white transition"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/feed"
          className={({ isActive }) =>
            isActive
              ? "block text-white font-medium"
              : "block text-gray-400 hover:text-white transition"
          }
        >
          Feed
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive
              ? "block text-white font-medium"
              : "block text-gray-400 hover:text-white transition"
          }
        >
          Profile
        </NavLink>
      </nav>

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="mt-6 text-sm text-gray-400 hover:text-white transition"
      >
        {dark ? "☀ Light Mode" : "🌙 Dark Mode"}
      </button>
    </aside>
  );
}
