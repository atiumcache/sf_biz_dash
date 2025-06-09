const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      <div className="text-gray-600 dark:text-gray-400 text-sm">
        Loading data... This may take a few seconds as we fetch the latest data from SF.gov.
      </div>
    </div>
  )
}

export default LoadingSpinner;
