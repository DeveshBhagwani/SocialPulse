export default function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{title}</p>
      <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </p>
    </div>
  );
}
