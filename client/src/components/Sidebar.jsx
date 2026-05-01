import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { ThemeContext } from "../context/theme-context";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/feed", label: "Feed" },
  { to: "/profile", label: "Profile" }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { dark, setDark } = useContext(ThemeContext);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-gray-100 px-6 py-8 flex flex-col">
      <h1 className="text-2xl font-bold mb-10">SocialPulse</h1>

      <nav className="space-y-2 text-sm flex-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 transition ${
                isActive
                  ? "bg-white text-gray-950 font-semibold"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-gray-800 pt-4">
        <button
          type="button"
          onClick={() => setDark(!dark)}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
        >
          {dark ? "Light mode" : "Dark mode"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-400 transition hover:bg-gray-900 hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
