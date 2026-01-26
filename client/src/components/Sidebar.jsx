export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-gray-100 min-h-screen px-6 py-8">
      <h1 className="text-2xl font-bold mb-10">
        SocialPulse
      </h1>

      <nav className="space-y-4 text-sm">
        <p className="cursor-pointer text-white font-medium">
          Dashboard
        </p>
        <p className="cursor-pointer text-gray-400 hover:text-white transition">
          Feed
        </p>
      </nav>
    </aside>
  );
}