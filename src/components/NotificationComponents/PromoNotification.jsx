import React from "react";

export default function PromoNotification({ promo, displayIcon: IconComponent }) {
  return (
    <li
      className={`relative flex items-start gap-4 rounded-lg p-3 transition-colors hover:bg-gray-100 ${
        !promo.isRead && "bg-pink-50"
      }`}
    >
      <div className="bg-vibrant-purple/20 text-vibrant-purple mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xl">
        {IconComponent && <IconComponent />}
      </div>
      <div>
        <p className="font-bold text-gray-800">{promo.title}</p>
        <p className="text-sm text-gray-600">{promo.body}</p>
        <p className="mt-1 text-xs text-gray-400">{promo.time}</p>
      </div>
      {!promo.isRead && <div className="bg-primary-pink absolute top-3 right-3 h-2 w-2 rounded-full" />}
    </li>
  );
}
