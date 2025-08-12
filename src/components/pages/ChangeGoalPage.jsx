"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../Ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import GoalSetter from "../Ui/GoalSetter";
import Loading from "../StatusComponents/Loading";
import UserInputMonthly from "../pages/UserInputMonthly"; // 1. Import UserInputMonthly
import { useUpdateGoal } from "@/hooks/useUser"; // 2. Import the correct hook
import axios from "@/lib/axios";
import toast from "react-hot-toast";

/* ---------------- Skeletons ---------------- */

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="h-32 w-full animate-pulse rounded-xl bg-gray-200" />
      <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-gray-200" />
      <div className="mt-3 h-8 w-full animate-pulse rounded-lg bg-gray-200" />
    </div>
  );
}

function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ---------------- Segmented Mode Switch ---------------- */

function ModeSwitch({ mode, onChange }) {
  const items = useMemo(
    () => [
      { key: "all", label: "ทั้งหมด" },
      { key: "upgrade", label: "อัปเกรด" },
      { key: "affordable", label: "ตามงบ" },
    ],
    [],
  );

  return (
    <div className="px-5 pt-3 pb-2">
      <div className="grid grid-cols-3 rounded-full bg-gray-100 p-1">
        {items.map((it) => {
          const active = mode === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={
                "rounded-full px-3 py-2 text-sm font-semibold transition-colors " +
                (active
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-white")
              }
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ChangeGoalPage({ isEditing, setIsEditing, userData }) {
  const [uiStep, setUiStep] = useState("input"); // 'input' | 'calculate' | 'main' | 'final'
  const [newGoal, setNewGoal] = useState({});
  const [suggestedPhone, setSuggestedPhone] = useState(null);
  const [facets, setFacets] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  console.log(suggestedPhone);

  // keep for future; only monthlyPayment is relevant to your “capacity” math
  const [inputData] = useState({
    monthlyPayment: userData?.monthlyPayment || "",
    age: userData?.ageRange || "",
    occupation: userData?.occupation || "",
    customOccupation: "",
  });

  // Query config for backend
  const [productQuery, setProductQuery] = useState({
    mode: "upgrade", // all | upgrade | affordable
    minPrice: userData?.wallet?.balance ?? null,
    maxPrice: null,
    topPerBrand: false, // best model per brand (nicer grid)
    sort: "asc",
    take: 100,
    skip: 0,
  });

  const closePage = () => {
    setIsEditing(false);
    // reset after exit animation
    setTimeout(() => {
      setUiStep("input");
      setNewGoal({});
      setSuggestedPhone(null);
      setFacets(null);
    }, 300);
  };

  // ---- fetch products only when opened (and when mode changes while open) ----
  const fetchProducts = async () => {
    try {
      const balance = Number(userData?.wallet?.balance || 0);
      if (!Number.isFinite(balance) || balance < 0) {
        toast.error("ไม่สามารถคำนวณงบประมาณได้");
        return;
      }

      setIsFetching(true);
      setUiStep("calculate");
      const toastId = toast.loading("กำลังค้นหาสินค้าที่เหมาะสม…");

      let { mode, minPrice, maxPrice, topPerBrand, take, skip, sort } =
        productQuery;

      // Derive min/max by mode (upgrade shows pricier targets than current balance)
      if (mode === "affordable") {
        minPrice = null;
        maxPrice = maxPrice ?? balance;
      } else if (mode === "upgrade") {
        minPrice = minPrice ?? balance;
        maxPrice = null;
      } else {
        // all
        minPrice = null;
        maxPrice = null;
      }

      const { data } = await axios.get("/product", {
        params: {
          mode,
          minPrice,
          maxPrice,
          topPerBrand,
          take,
          skip,
          sort,
        },
      });

      console.log("data", data);
      const items = Array.isArray(data?.items) ? data.items : [];
      setSuggestedPhone(items);
      setFacets(data?.facets ?? null);

      if (!items.length) {
        toast("ยังไม่พบสินค้าที่ตรงเงื่อนไข ลองเปลี่ยนโหมดหรือช่วงราคา");
        setUiStep("input");
      } else {
        toast.success("คัดสินค้าที่เหมาะสมให้แล้ว ✨");
        setUiStep("main");
      }

      toast.dismiss(toastId);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาดในการค้นหาสินค้า");
      setUiStep("input");
    } finally {
      setIsFetching(false);
    }
  };

  // Only fire when showing; refetch when mode changes (while open)
  useEffect(() => {
    if (isEditing) fetchProducts();
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && uiStep !== "calculate") {
      // Re-query on mode change while the modal is open
      fetchProducts();
    }
  }, [productQuery.mode]);

  // Receive goal from GoalSetter
  const handleGoalUpdate = (goal) => setNewGoal(goal);

  // Save changes
  const { mutate: updateGoal, isPending: isUpdatingGoal } = useUpdateGoal();
  const handleSaveChanges = () => {
    if (!newGoal.mobileId || !newGoal.planId) {
      return toast.error("กรุณาเลือกเป้าหมายและแผนการออมให้ครบถ้วน");
    }
    updateGoal(
      {
        userId: userData.id,
        productId: newGoal.mobileId,
        planId: newGoal.planId,
      },
      { onSuccess: () => closePage() },
    );
  };

  // ---- RENDER ----
  // Only render the overlay when asked to show
  if (!isEditing) return null;

  const hasProducts =
    Array.isArray(suggestedPhone) && suggestedPhone.length > 0;

  return (
    <FramerDiv
      isOpen={isEditing}
      id="change-goal-overlay"
      className="fixed inset-0 z-50 flex flex-col bg-white"
    >
      {/* Header */}
      <header className="flex flex-shrink-0 items-center border-b border-gray-200 px-5 pt-10 pb-4">
        <button
          onClick={closePage}
          className="text-2xl text-gray-600 transition-colors hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="flex-grow text-center text-xl font-bold text-gray-800">
          แก้ไขเป้าหมาย
        </h2>
        <div className="w-6"></div>
      </header>

      {/* Mode Switch */}
      <ModeSwitch
        mode={productQuery.mode}
        onChange={(m) => setProductQuery((q) => ({ ...q, mode: m }))}
      />

      <div className="mx-auto w-5/6 rounded-full bg-gray-100 p-3 text-center text-sm text-gray-600">
        ยอดเงินที่ใช้ได้
        <span className="text-bg-dark ml-2 font-bold">
          ฿
          {userData?.wallet.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Content */}
      <div className="relative flex-grow overflow-y-auto">
        {/* Skeleton while fetching */}
        {isFetching && <ProductGridSkeleton count={6} />}

        {/* Main content once loaded */}
        {!isFetching && hasProducts && (
          <>
            <GoalSetter
              showBack={false}
              products={suggestedPhone}
              onGoalChange={handleGoalUpdate}
              onBack={() => setUiStep("input")}
            />
            <footer className="sticky bottom-0 flex w-full items-center justify-center bg-white p-6 pb-12 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
              <CtaButton
                onClick={handleSaveChanges}
                disabled={!newGoal.planId || isUpdatingGoal}
                className="z-10 w-48 rounded-xl p-4 text-base font-bold"
              >
                {isUpdatingGoal ? "กำลังบันทึก..." : "ยืนยันเป้าหมายใหม่"}
              </CtaButton>
            </footer>
          </>
        )}

        {/* Empty state if loaded but no products */}
        {!isFetching && !hasProducts && (
          <div className="flex flex-col items-center justify-center p-10 text-center text-gray-600">
            <p className="text-base">ยังไม่พบสินค้าที่ตรงเงื่อนไข</p>
            <p className="mt-1 text-sm">
              ลองเปลี่ยนโหมดการค้นหา หรือกลับไปแก้ยอดออม
            </p>
          </div>
        )}
      </div>
    </FramerDiv>
  );
}
