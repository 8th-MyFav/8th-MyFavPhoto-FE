"use client";

import React from "react";

const CardMeta = ({
  rarityText,
  rarityStyle,
  category,
  point,
  purchaseText = "에 구매",
  author,
  variant = "default", // "default" | "withAuthor" | "full"
  sizeVariant = "2xs", // fontSize variant
  className = "",
  sellStatus, // 판매 상태 텍스트 (예: "판매중", "매진")
  showSellStatus = false, // <-- 추가 (기본 false)
}) => {
  // rarity 색상 계산
  const getRarityStyle = (rarity) => {
    if (!rarity) return {};
    const normalized = rarity.replace(/\s+/g, "_").toUpperCase();
    const base = { fontFamily: "var(--font-noto)", fontWeight: 700 };

    switch (normalized) {
      case "COMMON":
        return { ...base, color: "var(--yellow-yellow, #EFFF04)" };
      case "RARE":
        return { ...base, color: "var(--blue-blue, #29C9F9)" };
      case "SUPER_RARE":
        return { ...base, color: "var(--purple-purple, #A77EFF)" };
      case "LEGENDARY":
        return { ...base, color: "var(--pink-pink, #FF2A6A)" };
      default:
        return { ...base, color: "var(--color-white)" };
    }
  };

  // fontSize variant 설정
  const allowedSizes = new Set([
    "5xs", // 10
    "4xs", // 12
    "3xs", // 14
    "2xs", // 16
    "xs",  // 18
    "sm",  // 20
    "base", // 24
  ]);
  const safeSizeVariant = allowedSizes.has(sizeVariant) ? sizeVariant : "2xs";
  const sizeClass = `text-noto-${safeSizeVariant}`;

  // 왼쪽 섹션: rarity | category (항상) | point P 에 구매 (full일 때만)
  const leftItems = [];
  leftItems.push({
    type: "rarity",
    content: rarityText,
    style: rarityStyle || getRarityStyle(rarityText),
  });
  if (category) {
    leftItems.push({ type: "category", content: category });
  }
  if (variant === "full" && point !== undefined) {
    leftItems.push({ type: "point", content: `${point} P` });
  }
  if (variant === "full" && purchaseText) {
    leftItems.push({ type: "purchase", content: purchaseText });
  }

  return (
    <div
      className={`w-full flex items-center justify-between gap-2xs mt-2xs h-[23px] ${className}`}
    >
      <div className="flex items-center gap-2xs h-[23px]">
        {leftItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === "rarity" ? (
              // rarity에도 sizeClass 적용됨
              <span style={item.style} className={`${sizeClass}`}>
                {item.content}
              </span>
            ) : (
              <span
                className={`${
                  item.type === "point"
                    ? "text-white font-bold"
                    : "text-gray-300"
                } flex items-center h-[23px] ${sizeClass}`}
              >
                {item.content}
              </span>
            )}
            {index < leftItems.length - 1 && (
              <span
                className={`text-gray-400 flex items-center h-[23px] ${sizeClass}`}
              >
                |
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {(variant === "withAuthor" || variant === "full") && author && (
        <span
          className={`flex underline underline-offset-4 h-[23px] ${sizeClass} text-white justify-end`}
        >
          {author}
        </span>
      )}
      {showSellStatus && sellStatus && ( // 👈 판매 상태 표시
        <span className="text-sm text-gray-400 ml-2">
          {sellStatus}
        </span>
      )}
    </div>  
  );
};

export default CardMeta;
