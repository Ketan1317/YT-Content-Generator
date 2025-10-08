const VideoCardSkeleton = () => {
  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg animate-pulse flex flex-col h-80">
      <div className="w-full h-40 md:h-44 bg-gray-300 dark:bg-gray-600" />
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
        <div className="flex items-center justify-evenly mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;