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
  sizeVariant = "2xs",
  className = "",
  sellStatus,
  showSellStatus = false,
}) => {
  // sizeVariant -> responsive text classes (mobile/tablet/desktop)
  const sizeMap = {
    "5xs": "mobile:text-[10px] tablet:text-[11px] desktop:text-[12px]",
    "4xs": "mobile:text-[11px] tablet:text-[12px] desktop:text-[13px]",
    "3xs": "mobile:text-[12px] tablet:text-[13px] desktop:text-[14px]",
    "2xs": "mobile:text-[13px] tablet:text-[14px] desktop:text-[15px]",
    xs: "mobile:text-[14px] tablet:text-[15px] desktop:text-[16px]",
    sm: "mobile:text-[15px] tablet:text-[16px] desktop:text-[17px]",
    base: "mobile:text-[16px] tablet:text-[18px] desktop:text-[20px]",
  };

  const textSizeClass = sizeMap[sizeVariant] || sizeMap["2xs"];

  // left items: rarity | category | (optional point / purchase)
  const leftItems = [{ type: "rarity", content: rarityText, style: rarityStyle }];
  if (category) leftItems.push({ type: "category", content: category });
  if (variant === "full" && point !== undefined) leftItems.push({ type: "point", content: `${point} P` });
  if (variant === "full" && purchaseText) leftItems.push({ type: "purchase", content: purchaseText });

  return (
    <div className={`w-full flex items-center justify-between gap-2 mt-1 ${textSizeClass} ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {leftItems.map((item, idx) => (
          <React.Fragment key={idx}>
            {item.type === "rarity" ? (
              <span style={item.style} className="font-bold whitespace-nowrap">
                {item.content}
              </span>
            ) : (
              <span className="text-gray-300 truncate">{item.content}</span>
            )}
            {idx < leftItems.length - 1 && <span className="text-gray-400 px-1">|</span>}
          </React.Fragment>
        ))}
      </div>

      <div className="flex items-center gap-2 min-w-0">
        {(variant === "withAuthor" || variant === "full") && author && (
          <span className={`text-white truncate ${textSizeClass}`} style={{ maxWidth: "140px" }}>
            {author}
          </span>
        )}
        {showSellStatus && sellStatus && (
          <span className={`text-sm text-gray-400 ${textSizeClass}`}>{sellStatus}</span>
        )}
      </div>
    </div>
  );
};

export default CardMeta;
