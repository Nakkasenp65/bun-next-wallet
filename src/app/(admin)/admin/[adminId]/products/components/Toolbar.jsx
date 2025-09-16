import DropDownComponent from "@/components/ui/DropDownComponent";
import { Search } from "lucide-react";

export default function Toolbar({ filters, onFilterChange, filterOptions }) {
  const brandOptions = [
    { label: "ทุกยี่ห้อ", value: "ALL" },
    ...(filterOptions?.brands || []).map((b) => ({ label: b, value: b })),
  ];
  const conditionOptions = [
    { label: "ทุกสภาพ", value: "ALL" },
    { label: "มือหนึ่ง", value: "มือหนึ่ง" },
    { label: "มือสอง", value: "มือสอง" },
  ];
  const capacityOptions = [
    { label: "ทุกความจุ", value: "ALL" },
    ...(filterOptions?.capacities || []).map((c) => ({ label: c, value: c })),
  ];
  const colorOptions = [
    { label: "ทุกสี", value: "ALL" },
    ...(filterOptions?.colors || []).map((c) => ({ label: c, value: c })),
  ];
  const sortOptions = [
    { label: "สร้างล่าสุด", value: "createdAt_desc" },
    { label: "ราคาดาวน์ (น้อยไปมาก)", value: "downPaymentAsc" },
    { label: "ราคาดาวน์ (มากไปน้อย)", value: "downPaymentDesc" },
  ];

  return (
    <div className="mb-4 space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          placeholder="ค้นหารุ่น หรือ ยี่ห้อ..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3 pl-9 text-sm focus:ring-2 focus:ring-pink-400 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        <DropDownComponent
          label="ยี่ห้อ"
          name="brand"
          value={filters.brand}
          onChange={(v) => onFilterChange("brand", v)}
          options={brandOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <DropDownComponent
          label="สภาพ"
          name="condition"
          value={filters.condition}
          onChange={(v) => onFilterChange("condition", v)}
          options={conditionOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <DropDownComponent
          label="ความจุ"
          name="capacity"
          value={filters.capacity}
          onChange={(v) => onFilterChange("capacity", v)}
          options={capacityOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <DropDownComponent
          label="สี"
          name="color"
          value={filters.color}
          onChange={(v) => onFilterChange("color", v)}
          options={colorOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <DropDownComponent
          label="เรียงโดย"
          name="sort"
          value={filters.sort}
          onChange={(v) => onFilterChange("sort", v)}
          options={sortOptions}
          buttonClassName="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}
