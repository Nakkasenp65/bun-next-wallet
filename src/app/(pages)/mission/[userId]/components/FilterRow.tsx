import { Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* =========================================================
   Filter configs
========================================================= */
const STATUS_FILTERS = [
  { key: "ALL", label: "ทั้งหมด" },
  { key: "AWAITING_CLAIM", label: "รอรับรางวัล" },
  { key: "COMPLETED", label: "สำเร็จแล้ว" },
  { key: "EXPIRED", label: "หมดอายุ" },
];

const TYPE_FILTERS = [
  { key: "ALL", label: "ทุกประเภท" },
  { key: "ONBOARDING", label: "ภารกิจต้อนรับ" },
  { key: "ACCUMULATION", label: "ภารกิจสะสม" },
  { key: "STREAK", label: "ภารกิจต่อเนื่อง" },
  { key: "REFERRAL", label: "ภารกิจชวนเพื่อน" },
];

export default function FilterRow({
  forTab,
  myMissionStatusFilter,
  setMyMissionStatusFilter,
  myMissionTypeFilter,
  setMyMissionTypeFilter,
  availableMissionTypeFilter,
  setAvailableMissionTypeFilter,
}) {
  return (
    <div className="sticky top-0 z-10 grid grid-cols-2 gap-3 bg-white pb-2">
      {forTab === "my" ? (
        <>
          {/* Status Filter */}
          <Select value={myMissionStatusFilter} onValueChange={setMyMissionStatusFilter}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-pink-100">
              <div className="flex items-center gap-2 truncate">
                <Filter className="h-3.5 w-3.5 opacity-70" />
                <span className="truncate">
                  {STATUS_FILTERS.find((f) => f.key === myMissionStatusFilter)?.label || "สถานะ"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((filter) => (
                <SelectItem key={filter.key} value={filter.key}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select value={myMissionTypeFilter} onValueChange={setMyMissionTypeFilter}>
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-pink-100">
              <div className="flex items-center gap-2 truncate">
                <Filter className="h-3.5 w-3.5 opacity-70" />
                <span className="truncate">
                  {TYPE_FILTERS.find((f) => f.key === myMissionTypeFilter)?.label || "ประเภท"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTERS.map((filter) => (
                <SelectItem key={filter.key} value={filter.key}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      ) : (
        /* Available Missions - Only Type Filter */
        <div className="col-span-2">
          <Select value={availableMissionTypeFilter} onValueChange={setAvailableMissionTypeFilter}>
            <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-slate-50 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-pink-100">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 opacity-70" />
                <span className="truncate">
                  {TYPE_FILTERS.find((f) => f.key === availableMissionTypeFilter)?.label || "ประเภทภารกิจ"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {TYPE_FILTERS.map((filter) => (
                <SelectItem key={filter.key} value={filter.key}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
