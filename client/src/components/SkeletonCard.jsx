export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );
}
