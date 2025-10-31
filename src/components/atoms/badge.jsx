"use client";

import React from "react";
 feat-김성준2
// Badge 컴포넌트.
export default function Badge({ type = "COMMON", count = 0 }) {
  const COLORS = {
    COMMON: "var(--color-main)", // #EFFF04
    RARE: "var(--color-blue)", // #29C9F9
    "SUPER RARE": "var(--color-purple)", // #A77EFF
    LEGENDARY: "var(--color-pink)", // #FF2A6A

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
 develop
  };

  const color = COLORS[type.toUpperCase()];
  const fontSize = SIZE[size];

  return (
    <div
 feat-김성준2
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

      className={`font-semibold ${fontSize}`}
      style={{ color }}
    >
      {type.toUpperCase()}
    </div>
  );
}
 develop
