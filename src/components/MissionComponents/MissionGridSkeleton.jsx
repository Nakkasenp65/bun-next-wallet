import React from "react";
import MissionCardSkeleton from "./MissionCardSkeleton";

export default function MissionGridSkeleton({ count = 6, variant = "my" }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <MissionCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
