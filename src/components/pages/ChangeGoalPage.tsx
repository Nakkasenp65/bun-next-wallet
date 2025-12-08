"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import CtaButton from "../ui/CtaButton";
import FramerDiv from "../framerComponents/FramerDiv";
import GoalSetter from "../../app/(pages)/welcome/components/GoalSetter";
import { useUpdateGoal } from "@/hooks/useUser";
import { useGetProducts } from "@/hooks/useProduct"; // <-- 1. Import Hook ที่ถูกต้อง
import toast from "react-hot-toast";

/* ---------------- Skeletons ---------------- */
// ส่วนนี้ไม่มีการเปลี่ยนแปลง
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
// ส่วนนี้ไม่มีการเปลี่ยนแปลง
const ModeSwitch = ({ mode, onChange }) => {
  const items = useMemo(
    () => [
      { key: "all", label: "ทั้งหมด" },
      { key: "upgrade", label: "เปลี่ยนรุ่น" },
      { key: "affordable", label: "ตามยอดการออม" },
    ],
    [],
  );

  return (
    <div className="my-2">
      <div className="grid grid-cols-3 rounded-full bg-gray-100">
        {items.map((it) => {
          const active = mode === it.key;
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`"rounded-full font-semibold" py-2 text-sm ${active ? "rounded-full bg-black text-white" : "text-gray-700"}`}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- Main Controller Component ---------------- */
export default function ChangeGoalPage({ isEditing, setIsEditing, userData, balance = 0 }) {
  interface Goal {
    mobileId?: string;
    planId?: string;
  }
  const [newGoal, setNewGoal] = useState<Goal>({});

  // --- STAGE 1: การกำหนดนโยบายการ Query (Query Policy Definition) ---
  // --- STAGE 1: การกำหนดนโยบายการ Query (Query Policy Definition) ---
  type ProductQueryMode = "all" | "affordable" | "upgrade";

  interface ProductQuery {
    mode: ProductQueryMode;
    minPrice: number | null;
    maxPrice: number | null;
    sort: "asc" | "desc";
  }

  const [productQuery, setProductQuery] = useState<ProductQuery>({
    mode: "upgrade",
    minPrice: balance,
    maxPrice: null,
    sort: "asc",
  });

  // --- STAGE 2: การมอบหมายภารกิจ (Task Delegation) ---
  // มอบหมายภารกิจการดึงข้อมูลทั้งหมดให้กับ Hook ที่เชี่ยวชาญ
  const {
    data: productsData,
    isLoading: isFetching,
    isError,
    error,
  } = useGetProducts(
    productQuery.mode,
    productQuery.minPrice,
    productQuery.maxPrice,
    productQuery.sort,
  ); // เปิดใช้งาน Hook นี้ก็ต่อเมื่อ Component นี้กำลังถูกแสดงผล

  console.log(productsData);

  // --- STAGE 3: การปรับเปลี่ยนนโยบาย (Policy Adjustment) ---
  // useEffect นี้จะทำงานเมื่อผู้ใช้เปลี่ยน 'mode' หรือ 'balance' เปลี่ยนแปลง
  useEffect(() => {
    // ไม่ทำงานถ้า component ไม่ได้ถูกเปิดใช้งาน
    if (!isEditing) return;

    const potentialPrice = Number(balance || 0);

    setProductQuery((prevQuery) => {
      let newMinPrice: number | null = null;
      let newMaxPrice: number | null = null;
      let newSort: "asc" | "desc" = "asc";

      if (prevQuery.mode === "affordable") {
        newMaxPrice = potentialPrice;
        newSort = "desc"; // Show most expensive affordable items first (closest to budget)
      } else if (prevQuery.mode === "upgrade") {
        newMinPrice = potentialPrice;
        newSort = "asc"; // Show cheapest upgrade items first (closest to budget)
      } else {
        // All mode
        newSort = "asc";
      }

      // คืนค่า query object ใหม่ ซึ่งจะทำให้ useGetProducts refetch โดยอัตโนมัติ
      return {
        ...prevQuery,
        minPrice: newMinPrice,
        maxPrice: newMaxPrice,
        sort: newSort,
      };
    });
  }, [productQuery.mode, balance, isEditing]);

  // --- STAGE 4: การจัดการ UI และ Logic ที่เหลือ ---
  const closePage = () => {
    setIsEditing(false);
    setTimeout(() => {
      setNewGoal({});
      // ไม่จำเป็นต้อง reset state อื่นๆ เพราะมันจะถูก re-initialize เมื่อเปิดใหม่
    }, 300);
  };

  const handleGoalUpdate = useCallback((goal) => {
    setNewGoal(goal);
  }, []);

  const { mutate: updateGoal, isPending: isUpdatingGoal } = useUpdateGoal();
  const handleSaveChanges = () => {
    if (!newGoal.mobileId || !newGoal.planId) {
      return toast.error("กรุณาเลือกเป้าหมายและแผนการออมให้ครบถ้วน");
    }
    updateGoal(
      {
        userId: userData.id,
        line_user_id: userData.line_user_id,
        productId: newGoal.mobileId,
        planId: newGoal.planId,
      },
      { onSuccess: () => closePage() },
    );
  };

  // แสดงข้อผิดพลาดจาก Hook
  useEffect(() => {
    if (isError) {
      toast.error(error.message || "เกิดข้อผิดพลาดในการค้นหาสินค้า");
    }
  }, [isError, error]);

  if (!isEditing) return null;

  const suggestedPhone = productsData || [];
  const hasProducts = !isFetching && Array.isArray(suggestedPhone) && suggestedPhone.length > 0;

  return (
    <FramerDiv
      isOpen={isEditing}
      id="change-goal-overlay"
      className="fixed inset-0 z-50 flex flex-col bg-white p-2"
    >
      {/* Header */}
      <header className="flex flex-shrink-0 items-center border-b border-gray-200 px-5 pt-4 pb-4">
        <button
          onClick={closePage}
          className="text-2xl text-gray-600 transition-colors hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <h2 className="flex-grow text-center text-xl font-bold text-gray-800">แก้ไขเป้าหมาย</h2>
        <div className="w-6"></div>
      </header>

      <div className="rounded-lg py-2 text-center text-sm text-gray-600">
        ยอดเงินที่ใช้ได้
        <span className="text-bg-dark ml-2 font-bold">
          ฿
          {balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>

      {/* Mode Switch */}
      <ModeSwitch
        mode={productQuery.mode}
        onChange={(m) => setProductQuery((q) => ({ ...q, mode: m }))}
      />

      {/* Content */}
      <div className="relative flex-grow overflow-y-auto">
        {isFetching && <ProductGridSkeleton count={6} />}

        {!isFetching && hasProducts && (
          <>
            <GoalSetter
              showBack={false}
              products={suggestedPhone}
              onGoalChange={handleGoalUpdate}
              onBack={closePage} // สามารถใช้ closePage ได้โดยตรง
            />
            <footer className="bottom-0 flex w-full items-center justify-center bg-white p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
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

        {!isFetching && !hasProducts && (
          <div className="flex flex-col items-center justify-center p-10 text-center text-gray-600">
            <p className="text-base">ยังไม่พบสินค้าที่ตรงเงื่อนไข</p>
            <p className="mt-1 text-sm">ลองเปลี่ยนโหมดการค้นหา</p>
          </div>
        )}
      </div>
    </FramerDiv>
  );
}
