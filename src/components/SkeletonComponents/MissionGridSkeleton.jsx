import React from "react";
import MyMissionCardSkeleton from "./MyMissionCardSkeleton";

export default function MissionGridSkeleton({ count = 6, variant = "my" }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <MyMissionCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
