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
}) => {
  // fontSize variant 설정
  const allowedSizes = new Set([
    "5xs", // 10
    "4xs", // 12
    "3xs", // 14
    "2xs", // 16
    "xs", // 18
    "sm", // 20
    "base", // 24
  ]);
  const safeSizeVariant = allowedSizes.has(sizeVariant) ? sizeVariant : "2xs";
  const sizeClass = `text-noto-${safeSizeVariant}`;

  // 왼쪽 섹션: grade | genre (항상) | point P 에 구매 (full일 때만)
  const leftItems = [];
  // 항상 표시: rarity와 category
  leftItems.push({ type: "rarity", content: rarityText, style: rarityStyle });
  if (category) {
    leftItems.push({ type: "category", content: category });
  }
  // full variant일 때만 표시
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
              <span style={item.style}>{item.content}</span>
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
    </div>
  );
};

export default CardMeta;
