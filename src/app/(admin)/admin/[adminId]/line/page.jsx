"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
  Save,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";
import Image from "next/image";
import {
  useAdminGetProducts,
  useAdminCreateProduct,
  useAdminEditProduct,
  useAdminDeleteProduct,
  useAdminGetProductFilters,
} from "@/hooks/useAdmin";
import DropDownComponent from "@/components/ui/DropDownComponent";
import AdminProductCard from "../products/components/AdminProductCard";
import Pagination from "../products/components/Pagination";

const Toolbar = ({ filters, onFilterChange, filterOptions }) => {
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
};

// [MODIFIED] ProductFormModal: ปรับปรุง UX การใส่ข้อมูล
const ProductFormModal = ({ open, initial, onClose, onSubmit, isProcessing }) => {
  const [form, setForm] = useState({});
  const [otherColor, setOtherColor] = useState("");

  const commonColors = [
    { label: "ดำ", value: "ดำ" },
    { label: "ขาว", value: "ขาว" },
    { label: "เงิน", value: "เงิน" },
    { label: "ทอง", value: "ทอง" },
    { label: "น้ำเงิน", value: "น้ำเงิน" },
    { label: "เขียว", value: "เขียว" },
    { label: "แดง", value: "แดง" },
    { label: "ม่วง", value: "ม่วง" },
    { label: "ชมพู", value: "ชมพู" },
    { label: "เทา", value: "เทา" },
    { label: "ฟ้า", value: "ฟ้า" },
    { label: "เหลือง", value: "เหลือง" },
    { label: "ส้ม", value: "ส้ม" },
    { label: "น้ำตาล", value: "น้ำตาล" },
    { label: "ธรรมชาติ", value: "ธรรมชาติ" },
    { label: "ทะเลทราย", value: "ทะเลทราย" },
    { label: "อื่นๆ", value: "OTHER" },
  ];
  const conditionOptions = [
    { label: "มือหนึ่ง", value: "มือหนึ่ง" },
    { label: "มือสอง", value: "มือสอง" },
  ];

  useEffect(() => {
    const initialData = initial || {
      brand: "",
      model: "",
      capacity: "",
      color: "",
      downPaymentAmount: 0,
      price: 0,
      imageUrl: "",
      condition: "มือหนึ่ง",
    };
    setForm(initialData);

    if (initialData.color && !commonColors.some((c) => c.value === initialData.color)) {
      setForm((prev) => ({ ...prev, color: "OTHER" }));
      setOtherColor(initialData.color);
    } else {
      setOtherColor("");
    }
  }, [initial, open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const isNumeric = [
      "downPaymentAmount",
      "price",
      "installment6Months",
      "installment10Months",
    ].includes(name);
    setForm((s) => ({ ...s, [name]: isNumeric ? Number(value) : value }));
  };
  const handleDropdownChange = (name, value) => setForm((s) => ({ ...s, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.brand?.trim() || !form.model?.trim()) return alert("กรุณากรอกยี่ห้อและรุ่น");
    const finalColor = form.color === "OTHER" ? otherColor.trim() : form.color;
    onSubmit({ ...form, color: finalColor });
  };

  return (
    <div
      className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        role="dialog"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between border-b p-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {initial ? "แก้ไขสินค้า" : "สร้างสินค้าใหม่"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="ปิด"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid max-h-[80vh] grid-cols-1 gap-4 overflow-y-auto p-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">ยี่ห้อ (Brand)</label>
              <input
                name="brand"
                value={form.brand || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">รุ่น (Model)</label>
              <input
                name="model"
                value={form.model || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">ความจุ (Capacity)</label>
              <input
                name="capacity"
                value={form.capacity || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <DropDownComponent
                label="สภาพ"
                name="condition"
                value={form.condition}
                onChange={(v) => handleDropdownChange("condition", v)}
                options={conditionOptions}
                buttonClassName="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <DropDownComponent
                label="สี"
                name="color"
                value={form.color}
                onChange={(v) => handleDropdownChange("color", v)}
                options={commonColors}
                buttonClassName="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            {form.color === "OTHER" && (
              <div>
                <label className="text-sm text-slate-600">ระบุสีอื่นๆ</label>
                <input
                  value={otherColor}
                  onChange={(e) => setOtherColor(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-sm text-slate-600">ราคาดาวน์ (บาท)</label>
              <input
                type="number"
                name="downPaymentAmount"
                value={form.downPaymentAmount || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                required
                min={0}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">ราคาเต็ม (บาท)</label>
              <input
                type="number"
                name="price"
                value={form.price || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                min={0}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-600">Image URL</label>
              <input
                name="imageUrl"
                value={form.imageUrl || ""}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t bg-slate-50 p-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex min-w-[120px] items-center justify-center rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" /> บันทึก
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   Page: Admin Products Page
========================================================= */
export default function AdminProductsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    search: "",
    brand: "ALL",
    condition: "ALL",
    capacity: "ALL",
    color: "ALL",
    sort: "createdAt_desc",
    page: 1,
    pageSize: 10,
  });
  const [debouncedSearch] = useDebounce(filters.search, 300);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const queryFilters = { ...filters, search: debouncedSearch };

  const { data: apiResponse, isLoading, isError, error } = useAdminGetProducts(queryFilters);
  const { data: filterOptions } = useAdminGetProductFilters(); // ดึง options สำหรับ filter
  const { mutate: createProduct, isLoading: isCreating } = useAdminCreateProduct();
  const { mutate: editProduct, isLoading: isEditing } = useAdminEditProduct();
  const { mutate: deleteProduct } = useAdminDeleteProduct();
  const isProcessing = isCreating || isEditing;

  const products = apiResponse?.data || [];
  const paging = apiResponse?.paging || {};

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= paging.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  const handleDelete = (productId) => {
    if (confirm("ยืนยันการลบสินค้าชิ้นนี้?")) deleteProduct(productId);
  };

  const handleUpsert = (payload) => {
    if (editingProduct) {
      editProduct(
        { productId: editingProduct.id, payload },
        { onSuccess: () => setIsModalOpen(false) },
      );
    } else {
      createProduct(payload, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">จัดการสินค้า</h1>
              <p className="text-sm text-slate-500">
                เพิ่ม ลบ แก้ไข และจัดการรายการสินค้าทั้งหมดในระบบ
              </p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> เพิ่มสินค้า
          </button>
        </div>

        <Toolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          filterOptions={filterOptions}
        />

        {isLoading && (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          </div>
        )}
        {isError && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            Error: {error.message}
          </div>
        )}
        {!isLoading && !isError && products.length === 0 && (
          <div className="rounded-xl bg-white p-8 text-center text-slate-500">
            ไม่พบข้อมูลสินค้า
          </div>
        )}

        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100 md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">สินค้า</th>
                      <th className="px-6 py-3">รุ่น / ความจุ / สี</th>
                      <th className="px-6 py-3">ราคาดาวน์</th>
                      <th className="px-6 py-3">สภาพ</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((item) => (
                      <tr key={item.id} className="bg-white hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src={item.imageUrl || "/placeholder-image.png"}
                              alt={item.model}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-contain ring-1 ring-slate-100"
                            />
                            <span className="font-semibold text-slate-800">{item.brand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">{item.model}</div>
                          <div className="text-xs text-slate-500">
                            {item.capacity} - {item.color || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          ฿{item.downPaymentAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${item.condition === "มือสอง" ? "bg-yellow-100 text-yellow-800" : "bg-blue-100 text-blue-800"}`}
                          >
                            {item.condition || "มือหนึ่ง"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex gap-1">
                            <button
                              onClick={() => handleEdit(item)}
                              title="แก้ไข"
                              className="rounded-lg p-2 text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              title="ลบ"
                              className="rounded-lg p-2 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <ul className="space-y-3 md:hidden">
              {products.map((item) => (
                <AdminProductCard
                  key={item.id}
                  product={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
            {paging.total > paging.pageSize && (
              <Pagination paging={paging} onPageChange={handlePageChange} />
            )}
          </>
        )}
      </div>
      <ProductFormModal
        open={isModalOpen}
        initial={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpsert}
        isProcessing={isProcessing}
      />
    </div>
  );
}
