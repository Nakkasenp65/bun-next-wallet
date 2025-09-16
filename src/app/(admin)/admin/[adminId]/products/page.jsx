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
import AdminProductCard from "./components/AdminProductCard";
import Pagination from "./components/Pagination";
import Toolbar from "./components/Toolbar";
import ProductFormModal from "./components/ProductFormModal";

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

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useAdminGetProducts(queryFilters);
  const { data: filterOptions } = useAdminGetProductFilters(); // ดึง options สำหรับ filter
  const { mutate: createProduct, isLoading: isCreating } =
    useAdminCreateProduct();
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
              <h1 className="text-2xl font-bold text-slate-900">
                จัดการสินค้า
              </h1>
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
                            <span className="font-semibold text-slate-800">
                              {item.brand}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-800">
                            {item.model}
                          </div>
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
