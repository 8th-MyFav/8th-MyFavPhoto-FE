"use client";

import React from "react";
// Badge 컴포넌트
export default function Badge({ type = "COMMON", count = 0 }) {
  const COLORS = {
    COMMON: "var(--color-main)", // #EFFF04
    RARE: "var(--color-blue)", // #29C9F9
    "SUPER RARE": "var(--color-purple)", // #A77EFF
    LEGENDARY: "var(--color-pink)", // #FF2A6A
  };

  const color = COLORS[type.toUpperCase()];

  return (
    <div
      className="flex flex-col items-center justify-center border rounded-none text-center px-[20px] py-[8px]"
      style={{
        borderColor: color,
        color: color,
        border : "0px solid ${color}",
        fontFamily: "var(--font-noto)",
        fontSize: "18px", // Tailwind 설정에서 br-18과 동일
        fontWeight: 300,
      }}
    >
      <span>
        {type.toUpperCase()} {count}장
      </span>
    </div>
  );
}
