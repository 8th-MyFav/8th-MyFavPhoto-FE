"use client";

import React from "react";

// Badge 컴포넌트
export default function Badge({ type = "COMMON", count = 0, size = "large" }) {
  // 등급별 색상
  const COLORS = {
    COMMON: "#EFFF04",
    RARE: "#29C9F9",
    "SUPER RARE": "#A77EFF",
    LEGENDARY: "#FF2A6A",
  };

  // 크기별 텍스트 크기
  const SIZE = {
    large: "text-[22px]",
    small: "text-[15px]",
  };

  const color = COLORS[type.toUpperCase()] || "#EFFF04";
  const fontSize = SIZE[size] || SIZE.large;

  return (
    <div
      className={`flex flex-col items-center justify-center border rounded-none text-center px-[20px] py-[8px] font-light ${fontSize}`}
      style={{
        borderColor: color,
        color,
        border: `1px solid ${color}`,
        fontFamily: "var(--font-noto)",
      }}
    >
      <span>
        {type.toUpperCase()} {count}장
      </span>
    </div>
  );
}
