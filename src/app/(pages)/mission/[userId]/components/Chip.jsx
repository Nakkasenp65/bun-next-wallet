import clsx from "clsx";

export default function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-max flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium text-nowrap transition-colors",
        active
          ? "bg-pink-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300",
      )}
    >
      {children}
    </button>
  );
}
