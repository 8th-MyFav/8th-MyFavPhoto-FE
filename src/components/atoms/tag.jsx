"use client";

import React from "react";

export default function Tag({ type = "sale", size = "medium" }) {
  // 상태별 텍스트 및 색상
  const STATUS = {
    sale: {
      text: "판매 중",
      textColor: "text-white",
      bgColor: "bg-[#1C1C1C]",
      borderColor: "border-[#1C1C1C]",
    },
    trade: {
      text: "교환 제시 대기 중",
      textColor: "text-[#EFFF04]",
      bgColor: "bg-[#1C1C1C]",
      borderColor: "border-[#EFFF04]",
    },
  };

  // 크기별 스타일
  const SIZE = {
    large: "text-[18px] px-4 py-2 rounded-md",
    medium: "text-[16px] px-3 py-1.5 rounded-md",
    small: "text-[13px] px-2 py-1 rounded-sm",
  };

  const s = STATUS[type];
  const sz = SIZE[size];

  return (
    <div
      className={`inline-block font-semibold border ${s.textColor} ${s.bgColor} ${s.borderColor} ${sz}`}
    >
      {s.text}
    </div>
  );
}