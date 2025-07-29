import React from "react";

const Loading = ({ textColor = "text-white" }) => {
  return (
    <div
      id="loading-overlay"
      className="flex flex-col items-center justify-center gap-2"
    >
      <div className="h-12 w-12 animate-[spin_1.5s_linear_infinite] rounded-full border-[5px] border-solid border-[rgba(255,255,255,0.3)] border-t-[var(--primary-pink)] border-r-[var(--vibrant-purple)] border-b-[var(--primary-orange)] border-l-[var(--bright-cyan)]" />
      <span className={`${textColor}`}>กำลังประมวลผล...</span>
    </div>
  );
};

export default Loading;
