export default function TypeBadge({ type }) {
  const map = {
    WALLET: { text: "WALLET", cls: "bg-blue-100 text-blue-700" },
    REWARD: { text: "REWARD", cls: "bg-green-100 text-green-700" },
    SYSTEM: { text: "SYSTEM", cls: "bg-slate-100 text-slate-700" },
  };
  const t = map[type] || map.SYSTEM;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${t.cls}`}>
      {t.text}
    </span>
  );
}
