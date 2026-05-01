import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedPage = (page) => (
  <ProtectedRoute>
    {page}
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={protectedPage(<Dashboard />)} />
      <Route path="/profile" element={protectedPage(<Profile />)} />
      <Route path="/users/:id" element={protectedPage(<PublicProfile />)} />
      <Route path="/feed" element={protectedPage(<Feed />)} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
