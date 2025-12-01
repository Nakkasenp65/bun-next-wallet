import clsx from "clsx";

export default function TabBtn({ active, onClick, children, count }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group relative flex-1 py-3 text-center font-bold transition-all",
        // --- FIXED COLOR LOGIC ---
        active ? "text-primary-pink" : "text-bg-dark hover:opacity-80",
      )}
    >
      <span className="inline-flex items-center justify-center gap-2">
        {children}
        {typeof count === "number" && (
          <span
            className={clsx(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              active
                ? "bg-pink-100 text-pink-600"
                : "bg-gray-200 text-gray-700",
            )}
          >
            {count}
          </span>
        )}
      </span>
      <span
        className={clsx(
          "absolute inset-x-6 -bottom-0.5 h-0.5 rounded-full transition-all",
          active ? "bg-primary-pink" : "bg-transparent",
        )}
      />
    </button>
  );
}
