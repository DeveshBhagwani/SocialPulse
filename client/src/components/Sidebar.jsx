export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">SocialPulse</h1>
      <nav className="space-y-4">
        <p className="cursor-pointer">Dashboard</p>
        <p className="cursor-pointer">Feed</p>
      </nav>
    </div>
  );
}
