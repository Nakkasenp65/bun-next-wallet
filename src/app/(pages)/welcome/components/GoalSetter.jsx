"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { FaApple } from "react-icons/fa6";
import { SiSamsung, SiOppo, SiVivo, SiXiaomi } from "react-icons/si";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";
import { MdAutoAwesome } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import Image from "next/image";
import DropDownComponent from "../../../../components/ui/DropDownComponent";
import FramerButton from "../../../../components/framerComponents/FramerButton";
import GridSelectorComponent from "./GridSelectorComponent";
import Poco from "../../../../components/logos/Poco";
import Realme from "../../../../components/logos/Realme";

const brandLogos = {
  Apple: <FaApple />,
  Samsung: <SiSamsung />,
  Oppo: <SiOppo />,
  Vivo: <SiVivo />,
  Xiaomi: <SiXiaomi />,
  Poco: <Poco />,
  Realme: <Realme />,
  Default: <HiOutlineViewfinderCircle />,
};

const conditionOptions = [
  { id: "มือหนึ่ง", name: "มือหนึ่ง", icon: <MdAutoAwesome /> },
  { id: "มือสอง", name: "มือสอง", icon: <FaExchangeAlt /> },
];

export default function GoalSetter({ products, onGoalChange = () => {}, onBack, showBack = true }) {
  const [selectedCondition, setSelectedCondition] = useState("มือหนึ่ง");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCapacity, setSelectedCapacity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("daily");

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCondition === "มือสอง") {
      return products.filter((p) => p.uniqueId && p.uniqueId.includes("2nd"));
    }
    return products.filter((p) => !p.uniqueId || !p.uniqueId.includes("2nd"));
  }, [products, selectedCondition]);

  const groupedData = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return {};

    return filteredProducts.reduce((acc, product) => {
      const { brand, model, capacity } = product;
      if (!acc[brand]) acc[brand] = {};
      if (!acc[brand][model]) acc[brand][model] = {};
      if (!acc[brand][model][capacity]) acc[brand][model][capacity] = [];
      acc[brand][model][capacity].push(product);
      return acc;
    }, {});
  }, [filteredProducts]);

  const brands = useMemo(() => Object.keys(groupedData), [groupedData]);
  const models = useMemo(
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

  // --- FIXED LOGIC ---
  // Use `new Set()` to ensure the `colors` array contains only unique values.
  // This prevents the "duplicate key" error in React when rendering the color buttons.
  const colors = useMemo(
    () => [...new Set(availableProductsInVariant.map((p) => p.color).filter((c) => c))],
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

  const handleBrandChange = useCallback((newBrand) => {
    setSelectedBrand(newBrand);
    setSelectedModel("");
    setSelectedCapacity("");
    setSelectedProduct(null);
  }, []);

  const handleModelChange = useCallback((newModel) => {
    setSelectedModel(newModel);
    setSelectedCapacity("");
    setSelectedProduct(null);
  }, []);

  const handleCapacityChange = useCallback((newCapacity) => {
    setSelectedCapacity(newCapacity);
    setSelectedProduct(null);
  }, []);

  const handleColorChange = useCallback(
    (newColor) => {
      const product = availableProductsInVariant.find((p) => p.color === newColor);
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
    if (selectedBrand && selectedModel && capacities.length > 0 && !selectedCapacity) {
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
  }, [selectedBrand, selectedModel, selectedCapacity, availableProductsInVariant, selectedProduct]);

  console.log(selectedPlan);

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

  useEffect(() => {
    const planData = savingPlans.find((p) => p.id === selectedPlan);
    console.log(planData?.planId);
    if (selectedProduct?.id && planData?.planId) {
      onGoalChange({
        mobileId: selectedProduct.id,
        planId: planData.planId,
      });
    }
  }, [selectedProduct?.id, selectedPlan]);

  useEffect(() => {
    console.log("GoalSetter Debug:", {
      brands: brands.length,
      selectedBrand,
      models: models.length,
      selectedModel,
      capacities: capacities.length,
      selectedCapacity,
      availableProducts: availableProductsInVariant.length,
      selectedProduct: selectedProduct?.id || "none",
    });
  }, [
    brands,
    selectedBrand,
    models,
    selectedModel,
    capacities,
    selectedCapacity,
    availableProductsInVariant,
    selectedProduct,
  ]);

  return (
    <div className="w-full max-w-md bg-white p-4">
      {showBack && (
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
            <p className="animate-pulse text-center text-slate-500">กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        ) : !selectedProduct && brands.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <p className="text-center text-slate-500">ไม่มีสินค้าประเภทนี้</p>
          </div>
        ) : selectedProduct ? (
          <>
            <h1 className="text-bg-dark mt-5 mb-2 font-bold">เลือกแบรนด์ที่ต้องการดาวน์</h1>
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
              <h1 className="text-bg-dark font-black">เลือกรุ่นที่ต้องการดาวน์</h1>
              <DropDownComponent
                name="model"
                value={selectedModel}
                onChange={handleModelChange}
                options={models}
                buttonClassName="w-full text-md font-bold border-pink-400 text-pink-400  border p-2 rounded-lg"
                optionsContainerClassName="p-2"
                optionClassName="rounded-lg font-semibold"
              />
              <DropDownComponent
                name="capacity"
                value={selectedCapacity}
                onChange={handleCapacityChange}
                options={capacities}
                buttonClassName="w-full text-md font-bold border-pink-400 text-pink-400  border p-2 rounded-lg"
                optionsContainerClassName="p-2"
                optionClassName="rounded-lg font-semibold"
              />
              {colors.length > 1 && (
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
          </>
        ) : null}
      </div>
      {selectedProduct && (
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-bold text-slate-800">เลือกเป้าหมายการออมของคุณ</h3>
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
                <span className="textz-xs opacity-80">{`/ ${plan.unit}`}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
