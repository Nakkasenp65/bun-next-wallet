"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { FaApple } from "react-icons/fa6";
import { SiSamsung, SiOppo, SiVivo, SiXiaomi } from "react-icons/si";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdAutoAwesome } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import Image from "next/image";
import FramerButton from "../../../../components/framerComponents/FramerButton";
import GridSelectorComponent from "./GridSelectorComponent";
import Poco from "../../../../components/logos/Poco";
import Realme from "../../../../components/logos/Realme";
import { Product } from "../../../../hooks/useProduct";

// --- Shadcn UI Imports ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn setup

interface GoalSetterProps {
  products: Product[]; // Updated to use the Product type
  onGoalChange: (goal: { mobileId: string; planId: string }) => void;
  onBack?: () => void;
  showBack?: boolean;
}

type GoalKey = {
  mobileId: string;
  planId: string;
};

export type DeviceCondition = "มือหนึ่ง" | "มือสอง";

const brandLogos: Record<string, React.ReactNode> = {
  Apple: <FaApple />,
  Samsung: <SiSamsung />,
  Oppo: <SiOppo />,
  Vivo: <SiVivo />,
  Xiaomi: <SiXiaomi />,
  Poco: <Poco />,
  Realme: <Realme />,
  Default: <HiOutlineViewfinderCircle />,
};

const conditionOptions: Array<{
  id: DeviceCondition;
  name: string;
  icon: React.ReactNode;
}> = [
  { id: "มือหนึ่ง", name: "มือหนึ่ง", icon: <MdAutoAwesome /> },
  { id: "มือสอง", name: "มือสอง", icon: <FaExchangeAlt /> },
];

export default function GoalSetter({
  products,
  onGoalChange,
  onBack,
  showBack = true,
}: GoalSetterProps) {
  const [selectedCondition, setSelectedCondition] = useState<
    DeviceCondition | string
  >("มือหนึ่ง");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("daily");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCondition === "มือสอง") {
      return products.filter((p) => p.uniqueId && p.uniqueId.includes("2nd"));
    }
    return products.filter((p) => !p.uniqueId || !p.uniqueId.includes("2nd"));
  }, [products, selectedCondition]);

  const groupedData: Record<
    string,
    Record<string, Record<string, Product[]>>
  > = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return {};

    return filteredProducts.reduce((acc: any, product) => {
      const { brand, model, capacity } = product;
      if (!acc[brand]) acc[brand] = {};
      if (!acc[brand][model]) acc[brand][model] = {};
      if (!acc[brand][model][capacity]) acc[brand][model][capacity] = [];
      acc[brand][model][capacity].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  const brands: string[] = useMemo(
    () => Object.keys(groupedData),
    [groupedData],
  );

  const models: string[] = useMemo(
    () => (selectedBrand ? Object.keys(groupedData[selectedBrand] || {}) : []),
    [selectedBrand, groupedData],
  );

  const capacities = useMemo(
    () =>
      selectedBrand && selectedModel
        ? Object.keys(groupedData[selectedBrand]?.[selectedModel] || {})
        : [],
    [selectedBrand, selectedModel, groupedData],
  );

  const availableProductsInVariant = useMemo(
    () =>
      selectedBrand && selectedModel && selectedCapacity
        ? groupedData[selectedBrand]?.[selectedModel]?.[selectedCapacity] || []
        : [],
    [selectedBrand, selectedModel, selectedCapacity, groupedData],
  );

  const colors = useMemo(
    () => [
      ...new Set(
        availableProductsInVariant.map((p) => p.color).filter((c) => c),
      ),
    ],
    [availableProductsInVariant],
  );

  const brandOptions = useMemo(
    () =>
      brands.map((brandName) => ({
        id: brandName,
        name: brandName,
        icon: brandLogos[brandName] || brandLogos.Default,
      })),
    [brands],
  );

  const handleBrandChange = useCallback(
    (newBrand: string) => {
      // 1. Set the brand
      setSelectedBrand(newBrand);

      // 2. Calculate defaults synchronously to prevent "null" flash
      const brandData = groupedData[newBrand] || {};
      const firstModel = Object.keys(brandData)[0] || "";

      const modelData = brandData[firstModel] || {};
      const firstCapacity = Object.keys(modelData)[0] || "";

      const products = modelData[firstCapacity] || [];
      const firstProduct = products[0] || null;

      // 3. Set all states at once
      setSelectedModel(firstModel);
      setSelectedCapacity(firstCapacity);
      setSelectedProduct(firstProduct);
    },
    [groupedData],
  );

  const handleModelChange = useCallback((newModel: string) => {
    setSelectedModel(newModel);
    setSelectedCapacity("");
    setSelectedProduct(null);
  }, []);

  const handleCapacityChange = useCallback((newCapacity: string) => {
    setSelectedCapacity(newCapacity);
    setSelectedProduct(null);
  }, []);

  const handleColorChange = useCallback(
    (newColor: string) => {
      const product = availableProductsInVariant.find(
        (p) => p.color === newColor,
      );
      if (product) setSelectedProduct(product);
    },
    [availableProductsInVariant],
  );

  // Auto-selection logic
  useEffect(() => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedCapacity("");
    setSelectedProduct(null);

    if (brands.length > 0) {
      setTimeout(() => {
        setSelectedBrand(brands[0]);
      }, 0);
    }
  }, [selectedCondition, brands]);

  useEffect(() => {
    if (selectedBrand && models.length > 0 && !selectedModel) {
      setSelectedModel(models[0]);
    } else if (!selectedBrand || models.length === 0) {
      setSelectedModel("");
      setSelectedCapacity("");
      setSelectedProduct(null);
    }
  }, [selectedBrand, models, selectedModel]);

  useEffect(() => {
    if (
      selectedBrand &&
      selectedModel &&
      capacities.length > 0 &&
      !selectedCapacity
    ) {
      setSelectedCapacity(capacities[0]);
    } else if (!selectedModel || capacities.length === 0) {
      setSelectedCapacity("");
      setSelectedProduct(null);
    }
  }, [selectedBrand, selectedModel, capacities, selectedCapacity]);

  useEffect(() => {
    if (
      selectedBrand &&
      selectedModel &&
      selectedCapacity &&
      availableProductsInVariant.length > 0 &&
      !selectedProduct
    ) {
      setSelectedProduct(availableProductsInVariant[0]);
    } else if (!selectedCapacity || availableProductsInVariant.length === 0) {
      setSelectedProduct(null);
    }
  }, [
    selectedBrand,
    selectedModel,
    selectedCapacity,
    availableProductsInVariant,
    selectedProduct,
  ]);

  const savingPlans = useMemo(() => {
    if (!selectedProduct) return [];
    const plansConfig = [
      {
        id: "daily",
        planId: "6881f45dca2899c984e09cf8",
        label: "ออมรายวัน",
        divisor: 180,
        unit: "วัน",
      },
      {
        id: "weekly",
        planId: "6881f45dca2899c984e09cf9",
        label: "ออมรายสัปดาห์",
        divisor: 24,
        unit: "สัปดาห์",
      },
      {
        id: "biweekly",
        planId: "6881f45eca2899c984e09cfa",
        label: "ออมรายครึ่งเดือน",
        divisor: 12,
        unit: "งวด",
      },
      {
        id: "monthly",
        planId: "6881f45eca2899c984e09cfb",
        label: "ออมรายเดือน",
        divisor: 6,
        unit: "งวด",
      },
    ];
    return plansConfig.map((plan) => {
      const calculatedAmount = Math.ceil(
        selectedProduct.downPaymentAmount / plan.divisor,
      );
      return {
        ...plan,
        displayValue: calculatedAmount.toLocaleString("en-US"),
      };
    });
  }, [selectedProduct]);

  useEffect(() => {
    const planData = savingPlans.find((p) => p.id === selectedPlan);
    if (selectedProduct?.id && planData?.planId && onGoalChange) {
      const goal: GoalKey = {
        mobileId: selectedProduct.id,
        planId: planData.planId,
      };
      onGoalChange(goal);
    }
  }, [selectedProduct?.id, selectedPlan, onGoalChange, savingPlans]);

  return (
    <div className="w-full max-w-md bg-white p-4">
      {showBack && onBack && (
        <FramerButton
          onClick={onBack}
          className="text-md bg-primary-pink mb-4 rounded-md px-2 py-1 text-white"
        >
          ย้อนกลับ
        </FramerButton>
      )}

      <div className="rounded-xl bg-white">
        <h1 className="text-bg-dark mb-2 font-bold">เลือกประเภทสินค้า</h1>
        <GridSelectorComponent
          name="condition"
          value={selectedCondition}
          onChange={(value) => setSelectedCondition(value)}
          options={conditionOptions}
          containerClassName="grid-cols-2 gap-3"
          itemClassName="hover:bg-pink-50/50 shadow-sm"
          activeItemClassName="border-pink-500 bg-pink-50"
        />

        {!selectedProduct && brands.length > 0 ? (
          <div className="flex h-96 items-center justify-center">
            <p className="animate-pulse text-center text-slate-500">
              กำลังโหลดข้อมูลสินค้า...
            </p>
          </div>
        ) : !selectedProduct && brands.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center text-slate-500">ไม่มีสินค้าประเภทนี้</p>
          </div>
        ) : selectedProduct ? (
          <>
            <h1 className="text-bg-dark mt-5 mb-2 font-bold">
              เลือกแบรนด์ที่ต้องการดาวน์
            </h1>
            <GridSelectorComponent
              labelClassName="text-bg-dark mb-2 block font-bold"
              name="brand"
              value={selectedBrand}
              onChange={handleBrandChange}
              options={brandOptions}
              containerClassName="grid-cols-4 gap-3 md:grid-cols-4"
              itemClassName="hover:bg-pink-50/50 shadow-sm"
              activeItemClassName="border-pink-500 bg-pink-50"
            />
            <div className="my-5 flex h-48 items-center justify-center">
              {selectedProduct.imageUrl ? (
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.model}
                  width={180}
                  height={180}
                  className="max-h-full w-auto object-contain"
                  priority
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-slate-100 p-2 text-center text-sm text-slate-400">
                  NO1Money+ Product:{selectedProduct.model}
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-xl">
              {/* --- MODEL SELECTION --- */}
              <div>
                <h1 className="text-bg-dark mb-1 font-black">
                  เลือกรุ่นที่ต้องการดาวน์
                </h1>
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger
                    className={cn(
                      "w-full rounded-lg border p-2 text-base font-bold shadow-sm transition-all focus:ring-2 focus:ring-pink-200",
                      // Custom styles from your previous component
                      "border-pink-400 text-pink-400",
                    )}
                  >
                    <SelectValue placeholder="เลือกรุ่น" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {models.map((model) => (
                      <SelectItem
                        key={model}
                        value={model}
                        className="font-medium"
                      >
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* --- CAPACITY SELECTION --- */}
              <div>
                <Select
                  value={selectedCapacity}
                  onValueChange={handleCapacityChange}
                  disabled={!selectedModel}
                >
                  <SelectTrigger
                    className={cn(
                      "w-full rounded-lg border p-2 text-base font-bold shadow-sm transition-all focus:ring-2 focus:ring-pink-200",
                      // Custom styles from your previous component
                      "border-pink-400 text-pink-400",
                      !selectedModel && "cursor-not-allowed opacity-50",
                    )}
                  >
                    <SelectValue placeholder="เลือกความจุ" />
                  </SelectTrigger>
                  <SelectContent>
                    {capacities.map((cap) => (
                      <SelectItem key={cap} value={cap} className="font-medium">
                        {cap}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* --- COLOR SELECTION --- */}
              {colors.length > 1 && (
                <div className="flex flex-col items-start justify-between gap-2">
                  <span className="font-medium text-slate-600">สี:</span>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-max shrink rounded-lg px-3 py-1 text-sm font-semibold transition-all ${
                          selectedProduct.color === color
                            ? "bg-pink-500 text-white shadow"
                            : "bg-white text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* --- PRICE DISPLAY --- */}
              <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
                <span className="font-medium text-slate-600">ราคาดาวน์:</span>
                <span className="text-2xl font-bold text-slate-900">
                  {selectedProduct.downPaymentAmount.toLocaleString("en-US")}
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* --- PLAN SELECTION --- */}
      {selectedProduct && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-slate-800">
            เลือกเป้าหมายการออมของคุณ
          </h3>
          <div className="grid w-full grid-cols-2 gap-3 overflow-x-auto px-2 pb-4">
            {savingPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`flex min-w-[130px] flex-shrink-0 flex-col items-center justify-center rounded-xl p-3 text-center transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "bg-pink-500 text-white shadow-md shadow-pink-500/30"
                    : "border border-gray-200 bg-white text-slate-700 hover:bg-pink-50"
                }`}
              >
                <span className="font-semibold">{plan.label}</span>
                <div className="my-1.5 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold">{plan.displayValue}</span>
                  <span className="text-sm font-medium opacity-80">บาท</span>
                </div>
                <span className="text-xs opacity-80">{`/ ${plan.unit}`}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
