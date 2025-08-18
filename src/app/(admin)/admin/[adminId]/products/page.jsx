"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  Search,
  Plus,
  Pencil,
  Trash2,
  Phone,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Filter,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

/* =========================================================
   Mock data (แทน API จริงระหว่างพัฒนา)
========================================================= */
const mockProducts = [
  {
    id: "p1",
    uniqueId: "IP13-128-BLK",
    brand: "Apple",
    model: "iPhone 13",
    capacity: "128GB",
    color: "Midnight",
    price: 18990,
    imageUrl:
      "https://lh3.googleusercontent.com/d/1svfe2sxWnmIB7AKfsIrSUx7Si-mbG2rJ",
    downPaymentAmount: 2990,
    downPaymentPercent: 10,
    installment6Months: 2670,
    installment10Months: 1600,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    uniqueId: "S25-256-PNK",
    brand: "Samsung",
    model: "Galaxy S25",
    capacity: "256GB",
    color: "Pink",
    price: 24990,
    imageUrl:
      "https://lh3.googleusercontent.com/d/1svfe2sxWnmIB7AKfsIrSUx7Si-mbG2rJ",
    downPaymentAmount: 4990,
    downPaymentPercent: 15,
    installment6Months: 3350,
    installment10Months: 2050,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p3",
    uniqueId: "IPAD-AIR-64-STL",
    brand: "Apple",
    model: "iPad Air",
    capacity: "64GB",
    color: "Starlight",
    price: 17900,
    imageUrl:
      "https://lh3.googleusercontent.com/d/1svfe2sxWnmIB7AKfsIrSUx7Si-mbG2rJ",
    downPaymentAmount: 2900,
    downPaymentPercent: 10,
    installment6Months: 2500,
    installment10Months: 1500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/* =========================================================
   Utils & small atoms
========================================================= */
const formatTHB = (n) =>
  (Number(n) || 0).toLocaleString("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
  });

const Chip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
    }`}
  >
    {children}
  </button>
);

/* =========================================================
   Product Form Modal (Create / Edit)
========================================================= */
const ProductFormModal = ({ open, initial, onClose, onSubmit }) => {
  const [form, setForm] = useState(
    () =>
      initial || {
        uniqueId: "",
        brand: "",
        model: "",
        capacity: "",
        color: "",
        price: 0,
        imageUrl: "",
        downPaymentAmount: 0,
        downPaymentPercent: 0,
        installment6Months: 0,
        installment10Months: 0,
      },
  );

  useEffect(() => {
    setForm(
      initial || {
        uniqueId: "",
        brand: "",
        model: "",
        capacity: "",
        color: "",
        price: 0,
        imageUrl: "",
        downPaymentAmount: 0,
        downPaymentPercent: 0,
        installment6Months: 0,
        installment10Months: 0,
      },
    );
  }, [initial, open]);

  if (!open) return null;

  const handleNumber = (name, value) => {
    const v = value === "" ? "" : Number(value);
    setForm((s) => ({ ...s, [name]: isNaN(v) ? 0 : v }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "price",
        "downPaymentAmount",
        "downPaymentPercent",
        "installment6Months",
        "installment10Months",
      ].includes(name)
    )
      return handleNumber(name, value);
    setForm((s) => ({ ...s, [name]: value }));
  };

  const calcInstallments = () => {
    const price = Number(form.price) || 0;
    const dp = Number(form.downPaymentAmount) || 0;
    const remain = Math.max(0, price - dp);
    const six = Math.round(remain / 6);
    const ten = Math.round(remain / 10);
    setForm((s) => ({
      ...s,
      installment6Months: six,
      installment10Months: ten,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.brand.trim()) return alert("กรุณากรอกแบรนด์");
    if (!form.model.trim()) return alert("กรุณากรอกรุ่น");
    if (form.price < 0) return alert("ราคาไม่ถูกต้อง");
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {initial ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label="ปิด"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3"
        >
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">
              รหัสสินค้า (uniqueId)
            </label>
            <input
              name="uniqueId"
              value={form.uniqueId}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="เช่น IP13-128-BLK"
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm text-slate-600">ราคา (THB)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">แบรนด์</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="เช่น Apple, Samsung"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">รุ่น (Model)</label>
            <input
              name="model"
              value={form.model}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="เช่น iPhone 13"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">ความจุ (Capacity)</label>
            <input
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="เช่น 128GB"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">สี (Color)</label>
            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="เช่น Midnight"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-600">
              ลิงก์รูปภาพ (imageUrl)
            </label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              placeholder="https://..."
            />
            {form.imageUrl && (
              <div className="mt-2 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.imageUrl}
                  alt="preview"
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <span className="text-xs text-slate-500">พรีวิวรูปภาพ</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-600">ดาวน์ (จำนวนเงิน)</label>
            <input
              type="number"
              name="downPaymentAmount"
              value={form.downPaymentAmount}
              onChange={handleChange}
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-slate-600">ดาวน์ (%)</label>
            <input
              type="number"
              name="downPaymentPercent"
              value={form.downPaymentPercent}
              onChange={handleChange}
              min={0}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-sm text-slate-600">ผ่อน 6 เดือน</label>
              <input
                type="number"
                name="installment6Months"
                value={form.installment6Months}
                onChange={handleChange}
                min={0}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-slate-600">ผ่อน 10 เดือน</label>
              <input
                type="number"
                name="installment10Months"
                value={form.installment10Months}
                onChange={handleChange}
                min={0}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={calcInstallments}
              className="mb-0.5 inline-flex h-[38px] items-center justify-center rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50"
            >
              คำนวณผ่อน
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 md:col-span-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-lg bg-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              {initial ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มสินค้า"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================================================
   Page: Admin Manage Products (Phones)
========================================================= */
export default function AdminProductsPage() {
  const router = useRouter();

  // state
  const [items, setItems] = useState(mockProducts);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("ALL");
  const [sortKey, setSortKey] = useState("latest"); // latest | priceAsc | priceDesc | brand
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // derived brand list
  const brands = useMemo(() => {
    const set = new Set(items.map((x) => x.brand).filter(Boolean));
    return ["ALL", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    let list = [...items];
    if (brandFilter !== "ALL")
      list = list.filter((x) => x.brand === brandFilter);

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (x) =>
          (x.brand || "").toLowerCase().includes(q) ||
          (x.model || "").toLowerCase().includes(q) ||
          (x.capacity || "").toLowerCase().includes(q),
      );
    }

    if (sortKey === "latest") {
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortKey === "priceAsc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortKey === "priceDesc") {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortKey === "brand") {
      list.sort((a, b) => (a.brand || "").localeCompare(b.brand || "", "th"));
    }

    return list;
  }, [items, brandFilter, search, sortKey]);

  // actions
  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (p) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (!confirm("ยืนยันการลบสินค้านี้?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const upsertProduct = (payload) => {
    if (editing) {
      setItems((prev) =>
        prev.map((x) =>
          x.id === editing.id
            ? { ...x, ...payload, updatedAt: new Date().toISOString() }
            : x,
        ),
      );
    } else {
      const newItem = {
        id: `p_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItems((prev) => [newItem, ...prev]);
    }
    setModalOpen(false);
  };

  const clearFilters = () => {
    setBrandFilter("ALL");
    setSearch("");
    setSortKey("latest");
  };

  return (
    <div className="min-h-dvh bg-gray-50">
      {/* Container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="ย้อนกลับ"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                จัดการรุ่นมือถือ
              </h1>
              <p className="text-sm text-slate-500">
                เพิ่ม/แก้ไข/ลบสินค้า (แบรนด์, รุ่น, ราคา, ความจุ, สี,
                ผ่อน/ดาวน์)
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

        {/* Toolbar */}
        <div className="sticky top-0 z-10 -mx-4 mb-4 border-b bg-white/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="ค้นหาแบรนด์/รุ่น/ความจุ…"
                className="w-full rounded-lg border border-slate-200 py-2 pr-3 pl-9 text-sm text-slate-800 placeholder:text-slate-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              />
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                <Filter className="h-4 w-4" /> แบรนด์
              </span>
              {brands.map((b) => (
                <Chip
                  key={b}
                  active={brandFilter === b}
                  onClick={() => setBrandFilter(b)}
                >
                  {b}
                </Chip>
              ))}
            </div>

            <div className="flex w-full items-center gap-2">
              <label className="text-xs text-slate-500">เรียงโดย</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="text-bg-dark grow rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none"
              >
                <option value="latest">อัปเดตล่าสุด</option>
                <option value="priceAsc">ราคาต่ำ → สูง</option>
                <option value="priceDesc">ราคาสูง → ต่ำ</option>
                <option value="brand">แบรนด์ (A→Z)</option>
              </select>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <X className="h-4 w-4" /> ล้างตัวกรอง
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
            <table className="w-full min-w-[1050px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs text-slate-700 uppercase">
                <tr>
                  <th className="text-bg-dark sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    สินค้า
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    ความจุ/สี
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    ราคา
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    ดาวน์
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    ผ่อน
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    รหัส
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-50 px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="bg-white hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            className="h-full w-full object-cover"
                            src={p.imageUrl || "/product-placeholder.png"}
                            alt="product"
                            width={48}
                            height={48}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-slate-900">
                            {p.brand || "-"} {p.model || "-"}
                          </div>
                          <div className="text-xs text-slate-500">
                            อัปเดต:{" "}
                            {new Date(p.updatedAt).toLocaleDateString("th-TH", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.capacity || "-"} / {p.color || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatTHB(p.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>จำนวน: {formatTHB(p.downPaymentAmount)}</span>
                        <span className="text-xs text-slate-500">
                          {p.downPaymentPercent || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>6 เดือน: {formatTHB(p.installment6Months)}</span>
                        <span className="text-xs text-slate-500">
                          10 เดือน: {formatTHB(p.installment10Months)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800">
                        {p.uniqueId || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="mr-1 inline h-4 w-4" /> แก้ไข
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="mr-1 inline h-4 w-4" /> ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile List */}
        <div className="md:hidden">
          <ul className="space-y-3">
            {filtered.map((p) => (
              <li
                key={p.id}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
              >
                <div className="mb-2 flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.imageUrl || "/product-placeholder.png"}
                    alt="product"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-slate-900">
                      {p.brand || "-"} {p.model || "-"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {p.capacity || "-"} / {p.color || "-"}
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      {formatTHB(p.price)}
                    </div>
                  </div>
                </div>
                <div className="text-bg-dark grid grid-cols-2 gap-2 text-xs">
                  <div className="text-slate-500">ดาวน์</div>
                  <div className="text-right">
                    {formatTHB(p.downPaymentAmount)} (
                    {p.downPaymentPercent || 0}%)
                  </div>
                  <div className="text-slate-500">ผ่อน</div>
                  <div className="text-right">
                    6ด: {formatTHB(p.installment6Months)} / 10ด:{" "}
                    {formatTHB(p.installment10Months)}
                  </div>
                </div>
                <div className="text-bg-dark mt-3 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    ลบ
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Modal */}
      <ProductFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSubmit={upsertProduct}
      />
    </div>
  );
}
