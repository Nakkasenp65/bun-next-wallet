import React from "react";
import clsx from "clsx";

export default function PriceFilterBar({
  mode,
  setMode,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  bounds, // { minAvailable, maxAvailable }
}) {
  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex gap-2">
        {["affordable", "upgrade", "all"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              "rounded-full px-3 py-2 text-sm font-semibold",
              mode === m ? "bg-black text-white" : "bg-gray-200 text-gray-800",
            )}
          >
            {m === "affordable"
              ? "ตามยอดที่มี"
              : m === "upgrade"
                ? "ดูเครื่องที่แพงขึ้น"
                : "ทั้งหมด"}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Min</span>
        <input
          type="number"
          className="w-full rounded-lg border px-3 py-2"
          placeholder={`${bounds.minAvailable ?? 0}`}
          value={minPrice ?? ""}
          onChange={(e) =>
            setMinPrice(e.target.value ? Number(e.target.value) : null)
          }
        />
        <span className="text-sm text-gray-600">Max</span>
        <input
          type="number"
          className="w-full rounded-lg border px-3 py-2"
          placeholder={`${bounds.maxAvailable ?? 0}`}
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(e.target.value ? Number(e.target.value) : null)
          }
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            onChange={(e) => {
              /* toggle topPerBrand in parent */
            }}
          />
          แสดงตัวท็อปของแต่ละแบรนด์
        </label>
      </div>
    </div>
  );
}
