export default function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-3xl font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}
