import { Filter } from "lucide-react";
import Chip from "./Chip";
import { useRef, useCallback } from "react";

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
  const statusScrollRef = useRef(null);
  const typeScrollRef = useRef(null);
  const availableTypeScrollRef = useRef(null);

  const handleStatusFilterChange = useCallback((newStatus) => {
    if (!statusScrollRef.current) return;
    const scrollPos = statusScrollRef.current.scrollLeft;
    setMyMissionStatusFilter(newStatus);
    // Double requestAnimationFrame ensures DOM is fully painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (statusScrollRef.current) {
          statusScrollRef.current.scrollLeft = scrollPos;
        }
      });
    });
  }, []);

  const handleTypeFilterChange = useCallback((newType) => {
    if (!typeScrollRef.current) return;
    const scrollPos = typeScrollRef.current.scrollLeft;
    setMyMissionTypeFilter(newType);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (typeScrollRef.current) {
          typeScrollRef.current.scrollLeft = scrollPos;
        }
      });
    });
  }, []);

  const handleAvailableTypeFilterChange = useCallback((newType) => {
    if (!availableTypeScrollRef.current) return;
    const scrollPos = availableTypeScrollRef.current.scrollLeft;
    setAvailableMissionTypeFilter(newType);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (availableTypeScrollRef.current) {
          availableTypeScrollRef.current.scrollLeft = scrollPos;
        }
      });
    });
  }, []);

  return (
    <div className="sticky top-[116px] z-10 border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {forTab === "my" ? (
        <>
          <div
            ref={statusScrollRef}
            className="scrollbar-hide -mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "auto", // Prevent smooth scroll interfering
              WebkitOverflowScrolling: "touch", // Better mobile experience
            }}
          >
            <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Filter className="h-4 w-4" /> สถานะ
            </span>
            {STATUS_FILTERS.map(({ key, label }) => (
              <Chip
                key={key}
                active={myMissionStatusFilter === key}
                onClick={() => handleStatusFilterChange(key)}
              >
                {label}
              </Chip>
            ))}
          </div>
          <div
            ref={typeScrollRef}
            className="scrollbar-hide -mx-1 mt-2 flex items-center gap-2 overflow-x-auto px-1 py-1"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
              ประเภท
            </span>
            {TYPE_FILTERS.map(({ key, label }) => (
              <Chip
                key={key}
                active={myMissionTypeFilter === key}
                onClick={() => handleTypeFilterChange(key)}
              >
                {label}
              </Chip>
            ))}
          </div>
        </>
      ) : (
        <div
          ref={availableTypeScrollRef}
          className="scrollbar-hide -mx-1 flex items-center gap-2 overflow-x-auto px-1 py-1"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <span className="inline-flex flex-shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Filter className="h-4 w-4" /> ประเภท
          </span>
          {TYPE_FILTERS.map(({ key, label }) => (
            <Chip
              key={key}
              active={availableMissionTypeFilter === key}
              onClick={() => handleAvailableTypeFilterChange(key)}
            >
              {label}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );
}
