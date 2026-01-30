import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen px-6 py-8">
      <h1 className="text-2xl font-bold mb-10">
        SocialPulse
      </h1>

      <nav className="space-y-4 text-sm">
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
    </aside>
  );
}
