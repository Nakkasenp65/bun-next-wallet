import React from "react";
import clsx from "clsx";

export default function MissionCardSkeleton({ variant = "my" }) {
  const bg = clsx(
    "rounded-3xl p-4 text-white animate-pulse",
    variant === "my"
      ? "bg-gradient-to-br from-slate-600 to-slate-800"
      : "bg-gradient-to-br from-zinc-500 to-neutral-700",
  );

  return (
    <div className={clsx("flex flex-col gap-2", bg)} aria-busy="true">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-black/20" />
        <div className="h-5 w-40 rounded-md bg-white/30" />
      </div>

      {/* Progress */}
      <div className="my-2">
        <div className="flex justify-between text-xs text-white/80">
          <div className="h-3 w-16 rounded bg-white/20" />
          <div className="h-3 w-16 rounded bg-white/20" />
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/25">
          <div className="h-2 w-1/2 bg-white/60" />
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
        <div className="h-3 w-3 rounded-full bg-white/30" />
        <div className="h-3 w-28 rounded bg-white/20" />
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-end justify-between gap-4 pt-2">
        <div className="flex flex-col gap-1">
          <div className="h-3 w-8 rounded bg-white/30" />
          <div className="flex items-baseline gap-2">
            <div className="h-5 w-5 rounded bg-white/30" />
            <div className="h-6 w-20 rounded bg-amber-200/50" />
          </div>
        </div>
        <div className="w-32">
          <div className="h-10 w-full rounded-xl bg-white/70" />
        </div>
      </div>
    </div>
  );
}
