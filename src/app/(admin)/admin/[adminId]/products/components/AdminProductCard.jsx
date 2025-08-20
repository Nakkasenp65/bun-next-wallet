import React from "react";
import Image from "next/image";
import { Pencil, Trash2 } from "lucide-react";

/**
 * ProductCard: แสดงข้อมูลสินค้าในรูปแบบการ์ดสำหรับหน้าจอมือถือ
 * @param {object} props
 * @param {object} props.product - Object ข้อมูลสินค้า
 * @param {function} props.onEdit - ฟังก์ชันที่จะถูกเรียกเมื่อกดปุ่ม "แก้ไข"
 * @param {function} props.onDelete - ฟังก์ชันที่จะถูกเรียกเมื่อกดปุ่ม "ลบ"
 */
export default function AdminProductCard({ product, onEdit, onDelete }) {
  return (
    <li className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      {/* Section 1: Image and Main Info */}
      <div className="flex items-start gap-4">
        <Image
          src={product.imageUrl || "/placeholder-image.png"} // ใช้ภาพ placeholder หากไม่มี URL
          alt={product.model}
          width={64}
          height={64}
          className="h-16 w-16 flex-shrink-0 rounded-lg object-contain ring-1 ring-slate-100"
        />
        <div className="flex-grow">
          <p className="text-xs font-semibold text-pink-600">{product.brand}</p>
          <p className="font-semibold text-slate-800">{product.model}</p>
          <p className="text-xs text-slate-500">
            {product.capacity} - {product.color || "N/A"}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
              product.condition === "มือสอง"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {product.condition || "มือหนึ่ง"}
          </span>
        </div>
      </div>

      {/* Section 2: Price and Actions */}
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div>
          <p className="text-xs text-slate-500">ราคาดาวน์</p>
          <p className="font-bold text-slate-900">
            ฿{product.downPaymentAmount.toLocaleString()}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" /> แก้ไข
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" /> ลบ
          </button>
        </div>
      </div>
    </li>
  );
}
