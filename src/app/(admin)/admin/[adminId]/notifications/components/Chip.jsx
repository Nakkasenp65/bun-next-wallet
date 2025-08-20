export default function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
          : "bg-slate-200 text-slate-700 hover:bg-slate-300"
      }`}
    >
      {children}
    </button>
  );
}
