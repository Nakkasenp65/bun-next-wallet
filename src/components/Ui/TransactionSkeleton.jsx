export default function TransactionSkeleton() {
  return (
    <li className="flex animate-pulse items-center justify-between border-b border-gray-100 py-4">
      <div className="flex items-center gap-4">
        {/* Icon Placeholder */}
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        {/* Text Placeholder */}
        <div>
          <div className="mb-2 h-4 w-32 rounded bg-gray-200"></div>
          <div className="h-3 w-24 rounded bg-gray-200"></div>
        </div>
      </div>
      {/* Amount Placeholder */}
      <div className="h-5 w-16 rounded bg-gray-200"></div>
    </li>
  );
}
