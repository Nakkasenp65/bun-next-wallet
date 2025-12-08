import React, { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard"; // อย่าลืม import ProductCard ของคุณ

export default function ProductTabs({ products }) {
  const groupedProducts = useMemo(() => {
    if (!products || products.length === 0) return {};
    return products.reduce((acc, product) => {
      const brand = product.brand;
      if (!acc[brand]) {
        acc[brand] = [];
      }
      acc[brand].push(product);
      return acc;
    }, {});
  }, [products]);

  const brands = Object.keys(groupedProducts);

  const [selectedBrand, setSelectedBrand] = useState(null);

  useEffect(() => {
    if (!selectedBrand && brands.length > 0) {
      setSelectedBrand(brands[0]);
    }
  }, [brands, selectedBrand]);

  if (brands.length === 0) {
    return <p className="mt-8 text-center text-slate-500">ไม่พบสินค้าที่ตรงตามเงื่อนไขของคุณ</p>;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full border-b border-slate-200">
        <div className="flex flex-row overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`flex-shrink-0 px-5 py-3 text-sm font-medium transition-all duration-300 ${
                selectedBrand === brand
                  ? "text-primary-pink border-primary-pink border-b-2"
                  : "text-slate-500 hover:text-slate-800"
              } `}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {selectedBrand && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {groupedProducts[selectedBrand].map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
