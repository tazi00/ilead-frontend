export const LeadsLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-4 bg-white dark:bg-gray-900"
        >
          <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
