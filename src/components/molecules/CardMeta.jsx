"use client";

import React from "react";

// UI-only molecule extracted from card.jsx (69-74)
// Props:
// - rarityText: string (e.g., "SUPER RARE")
// - rarityStyle: React.CSSProperties (style object for rarity badge)
// - category: string (e.g., "풍경")
// - variant: one of ['5xs','4xs','3xs','2xs','xs','sm','base']
// - showRarity?: boolean (default true)
// - showCategory?: boolean (default true)
// - showDivider?: boolean (default true)

const CardMeta = ({
  rarityText,
  rarityStyle,
  category,
  variant = "2xs",
  className = "",
  showRarity = true,
  showCategory = true,
  showDivider = true,
}) => {
  const allowed = new Set([
    "5xs", // 10
    "4xs", // 12
    "3xs", // 14
    "2xs", // 16
    "xs", // 18
    "sm", // 20
    "base", // 24
  ]);
  const safeVariant = allowed.has(variant) ? variant : "2xs";
  const sizeClass = `text-noto-${safeVariant}`;
  return (
    <div
      className={`w-[360px] flex justify-between items-center mt-2xs h-[23px] ${className}`}
    >
      <div className="flex items-center gap-[10px] h-[23px]">
        {showRarity && <span style={rarityStyle}>{rarityText}</span>}
        {showDivider && showRarity && showCategory && (
          <span
            className={`text-gray-400 flex items-center h-[23px] ${sizeClass}`}
          >
            |
          </span>
        )}
        {showCategory && (
          <span
            className={`text-gray-300 flex items-center h-[23px] ${sizeClass}`}
          >
            {category}
          </span>
        )}
      </div>
    </div>
  );
};

export default CardMeta;
