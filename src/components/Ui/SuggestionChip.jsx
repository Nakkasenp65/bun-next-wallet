export default function SuggestionChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-white p-2 text-sm shadow-md transition-transform hover:scale-105"
    >
      {label}
    </button>
  );
}
