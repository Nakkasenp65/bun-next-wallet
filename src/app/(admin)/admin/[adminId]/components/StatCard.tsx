interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  note?: string;
}

export default function StatCard({ title, value, icon, color, note }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white p-4 shadow-sm transition-transform hover:-translate-y-1">
      <div>
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${color}`}
        >
          {icon}
        </div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
      {note && <p className="mt-3 text-xs text-gray-400">{note}</p>}
    </div>
  );
}
