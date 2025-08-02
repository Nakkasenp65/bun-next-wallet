"use client";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import DropDownComponent from "@/components/Ui/DropDownComponent";
import FramerButton from "../framerComponents/FramerButton";

// This component now accepts an `onGoalChange` prop function
// to communicate its state back to the parent component.
export default function GoalSetter({ products, onGoalChange = () => {}, onBack }) {
  // Data Grouping Logic - No changes needed
  const groupedData = useMemo(() => {
    if (!products || products.length === 0) return {};
    return products.reduce((acc, product) => {
      const { brand, model, capacity } = product;
      if (!acc[brand]) acc[brand] = {};
      if (!acc[brand][model]) acc[brand][model] = {};
      if (!acc[brand][model][capacity]) acc[brand][model][capacity] = [];
      acc[brand][model][capacity].push(product);
      return acc;
    }, {});
  }, [products]);

  // State Management - No changes needed
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("daily"); // Default plan
  console.log("SELCTED PRODUCT: ", selectedProduct);
  // console.log("SELCTED PLAN: ", selectedPlan);

  // Dynamic Options for Dropdowns - No changes needed
  const brands = useMemo(() => Object.keys(groupedData), [groupedData]);
  const models = useMemo(
    () => (selectedBrand ? Object.keys(groupedData[selectedBrand]) : []),
    [selectedBrand, groupedData],
  );
  // --- THIS IS THE CORRECTED LINE ---
  const capacities = useMemo(
    () =>
      selectedBrand && selectedModel ? Object.keys(groupedData[selectedBrand][selectedModel]) : [],
    [selectedBrand, selectedModel, groupedData],
  );
  const availableProductsInVariant = useMemo(
    () =>
      selectedBrand && selectedModel && selectedCapacity
        ? groupedData[selectedBrand][selectedModel][selectedCapacity]
        : [],
    [selectedBrand, selectedModel, selectedCapacity, groupedData],
  );
  const colors = useMemo(
    () => availableProductsInVariant.map((p) => p.color),
    [availableProductsInVariant],
  );

  // State Update Logic - No changes needed
  useEffect(() => {
    if (brands.length > 0 && !selectedBrand) {
      handleBrandChange(brands[0]);
    }
  }, [brands, selectedBrand, groupedData]);

  const handleBrandChange = (newBrand) => {
    setSelectedBrand(newBrand);
    const newModels = Object.keys(groupedData[newBrand]);
    handleModelChange(newModels[0] || "", newBrand);
  };

  const handleModelChange = (newModel, currentBrand) => {
    setSelectedModel(newModel);
    const newCapacities = newModel ? Object.keys(groupedData[currentBrand][newModel]) : [];
    handleCapacityChange(newCapacities[0] || "", currentBrand, newModel);
  };

  const handleCapacityChange = (newCapacity, currentBrand, currentModel) => {
    setSelectedCapacity(newCapacity);
    const productsInVariant = newCapacity
      ? groupedData[currentBrand][currentModel][newCapacity]
      : [];
    if (productsInVariant.length > 0) {
      setSelectedProduct(productsInVariant[0]);
    } else {
      setSelectedProduct(null);
    }
  };

  const handleColorChange = (newColor) => {
    const product = availableProductsInVariant.find((p) => p.color === newColor);
    if (product) setSelectedProduct(product);
  };

  // --- MODIFIED: Saving plans now include the backend planId ---
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
      const calculatedAmount = Math.ceil(selectedProduct.downPaymentAmount / plan.divisor);
      return {
        ...plan,
        displayValue: calculatedAmount.toLocaleString("en-US"),
      };
    });
  }, [selectedProduct]);

  // --- NEW: Effect to notify parent component of changes ---
  useEffect(() => {
    const planObject = savingPlans.find((p) => p.id === selectedPlan);

    // Ensure both a product and a plan are selected before notifying the parent.
    // selectedProduct._id is assumed to be the mobileId.
    if (selectedProduct?.id && planObject?.planId) {
      onGoalChange({
        mobileId: selectedProduct.id,
        planId: planObject.planId,
      });
    }
    // This effect runs whenever the selected product or plan changes.
  }, [selectedProduct, selectedPlan]);

  if (!selectedProduct) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="animate-pulse text-center text-slate-500">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white p-5">
      <FramerButton
        onClick={onBack}
        className="text-md bg-primary-pink mb-4 rounded-md px-2 py-1 text-white"
      >
        ย้อนกลับ
      </FramerButton>
      <div className="rounded-xl bg-white p-4 shadow-inner shadow-slate-200">
        <DropDownComponent
          name="brand"
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
          options={brands}
          buttonClassName="w-full rounded-xl border-2 border-pink-400 bg-white p-3 text-center text-lg font-bold text-pink-500 focus:ring-4 focus:ring-pink-200 focus:outline-none"
          optionsContainerClassName="p-2"
          optionClassName="rounded-lg text-center font-semibold"
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
        <div className="space-y-4 rounded-xl bg-slate-100/70 p-4">
          <DropDownComponent
            name="model"
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value, selectedBrand)}
            options={models}
            buttonClassName="w-full text-md font-bold text-slate-800"
            optionsContainerClassName="p-2"
            optionClassName="rounded-lg font-semibold"
          />
          <DropDownComponent
            name="capacity"
            value={selectedCapacity}
            onChange={(e) => handleCapacityChange(e.target.value, selectedBrand, selectedModel)}
            options={capacities}
            buttonClassName="w-full -mt-4 text-slate-500 font-medium"
            optionsContainerClassName="p-2"
            optionClassName="rounded-lg font-semibold"
          />
          {colors.length > 1 && colors[0] !== "N/A" && (
            <div className="flex flex-col items-start justify-between gap-2">
              <span className="font-medium text-slate-600">สี:</span>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className={`w-max shrink rounded-lg px-3 py-1 text-sm font-semibold transition-all ${selectedProduct.color === color ? "bg-pink-500 text-white shadow" : "bg-white text-slate-700 hover:bg-slate-200"}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
            <span className="font-medium text-slate-600">ราคาดาวน์:</span>
            <span className="text-2xl font-bold text-slate-900">
              {selectedProduct.downPaymentAmount.toLocaleString("en-US")}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <h3 className="mb-3 text-lg font-bold text-slate-800">เลือกเป้าหมายการออมของคุณ</h3>
        <div className="grid w-full grid-cols-2 gap-3 overflow-x-auto px-2 pb-4">
          {savingPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`flex min-w-[130px] flex-shrink-0 flex-col items-center justify-center rounded-xl p-3 text-center transition-all duration-200 ${
                selectedPlan === plan.id
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-500/30"
                  : "bg-white text-slate-700 shadow-md shadow-slate-500/10 hover:bg-pink-50"
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
    </div>
  );
}
