import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function GoalPhoneComponent({ handleSelected, selected, phoneDetails, formatPrice }) {
  //
  //set the goal to brand and price
  function onPhoneCardClick() {
    handleSelected({
      brand: phoneDetails.brand,
      price: phoneDetails.price,
      mobileId: phoneDetails.mobileId,
    });
  }

  const formattedPrice = formatPrice(phoneDetails.price, 2);

  return (
    <div
      className={`relative flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-all duration-300 ease-out ${
        selected
          ? "border-primary-pink bg-light-pink-bg shadow-pink-glow animate-pulse-border border-2"
          : "border border-stone-300 bg-white/90 backdrop-blur-sm"
      } p-4`}
      onClick={onPhoneCardClick}
    >
      <span className="bg-bright-green absolute -top-3 right-3 flex items-center justify-center gap-1 rounded-lg px-2 py-1 text-xs text-white drop-shadow-md drop-shadow-black/30">
        <FontAwesomeIcon icon={faStar} className="h-3 w-3" /> แนะนำ
      </span>
      <Image
        src="https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702708"
        alt="iPhone 16 Pro"
        width={100}
        height={100}
        className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-200 object-contain p-1"
      />
      <div className="flex-grow">
        <p className="text-bg-dark text-lg font-bold">{phoneDetails.brand}</p>
        <p className="text-sm text-neutral-600">฿{formattedPrice} </p>
      </div>
    </div>
  );
}
