export default function DashboardSkeleton() {
  return (
    <div>
      {/* Skeleton for Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-44 animate-pulse rounded-2xl bg-gray-200 p-6"
          ></div>
        ))}
      </div>
      {/* Skeleton for Nav Menu */}
      <div className="mt-8">
        <div className="h-6 w-1/3 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
