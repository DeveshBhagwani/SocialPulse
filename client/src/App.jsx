import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/users/:id" element={<PublicProfile />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}