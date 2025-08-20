import React from "react";
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

/**
 * Pagination: ส่วนควบคุมการเปลี่ยนหน้า
 * @param {object} props
 * @param {object} props.paging - Object ข้อมูลการแบ่งหน้าจาก API (ต้องมี page, totalPages, total)
 * @param {function} props.onPageChange - ฟังก์ชันสำหรับเปลี่ยนหน้า (รับ newPage เป็น argument)
 */
export default function Pagination({ paging, onPageChange }) {
  // ป้องกันการ Render หากไม่มีข้อมูล paging หรือมีแค่หน้าเดียว
  if (!paging || paging.totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row">
      <span className="text-sm text-gray-700">
        หน้า <span className="font-semibold">{paging.page}</span> /{" "}
        <span className="font-semibold">{paging.totalPages}</span> (รวม{" "}
        {paging.total} รายการ)
      </span>
      <div className="inline-flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={paging.page <= 1}
          className="rounded-md p-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(paging.page - 1)}
          disabled={paging.page <= 1}
          className="rounded-md p-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(paging.page + 1)}
          disabled={paging.page >= paging.totalPages}
          className="rounded-md p-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => onPageChange(paging.totalPages)}
          disabled={paging.page >= paging.totalPages}
          className="rounded-md p-1.5 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
