"use client";

import React from "react";

export default function Badge({ type = "COMMON", size = "large" }) {
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

  const color = COLORS[type.toUpperCase()];
  const fontSize = SIZE[size];

  return (
    <div
      className={`font-semibold ${fontSize}`}
      style={{ color }}
    >
      {type.toUpperCase()}
    </div>
  );
}
