"use client";

import React from "react";
import CardMeta from "@/components/molecules/CardMeta";
import Tag from "@/components/atoms/tag";

const Card = ({
  topImage = "/images/sample.svg",
  title = "아름다운 풍경",
  rarityIcon = "LEGENDARY",
  category = "풍경",
  author = "글쓴이",
  price = 40,
  remaining = 2,
  total = 5,
  favoriteImg = "/images/favorite.svg",
  quantity = null,
  variant = "withAuthor",
  sizeVariant = "2xs",
  point,
  purchaseText,
  showSellStatus = false,
  sellStatus,
  showTag = false,
}) => {
  const isSoldOut = remaining === 0;
  const tagType = isSoldOut ? "trade" : "sale";

  const rarityText = String(rarityIcon || "").toUpperCase();
  let rarityStyle = { color: "var(--main-main, #EFFF04)", fontFamily: "Noto Sans KR", fontWeight: 700 };
  if (rarityText === "RARE") rarityStyle.color = "var(--blue-blue, #29C9F9)";
  else if (rarityText === "SUPER RARE") rarityStyle.color = "var(--purple-purple, #A77EFF)";
  else if (rarityText === "LEGENDARY") rarityStyle.color = "var(--pink-pink, #FF2A6A)";

  return (
    <article
      className={`
        w-full max-w-[440px]
        mobile:max-w-[calc(50vw-24px)]
        tablet:max-w-[340px]
        aspect-[3/4]
        flex flex-col items-center
        rounded-[8px] border box-border overflow-visible
      `}
      style={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "var(--color-gray-500)" }}
    >
      {/* 이미지(가로 기준으로 비율 유지) */}
      <div className="w-full relative aspect-[4/3]">
        {showTag && (
          <div className="absolute top-2 left-2 z-10">
            <Tag type={tagType} size="small" />
          </div>
        )}

        <img
          src={topImage}
          alt={title}
          className={`w-full h-full object-cover ${isSoldOut ? "opacity-40" : ""}`}
        />

        {isSoldOut && (
          <img
            src="/images/soldOut.svg"
            alt="sold out"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />
        )}
      </div>

      {/* 본문 (이미지 아래, 가변 높이) */}
      <div className="w-[92%] mt-3 flex flex-col justify-between flex-1">
        {/* 제목: 반응형 폰트 */}
        <h3
          className="truncate text-white font-bold mobile:text-[14px] tablet:text-[16px] desktop:text-[18px] leading-tight"
          title={title}
        >
          {title}
        </h3>

        {/* 메타: CardMeta에 반응형 폰트 클래스 전달 (sizeVariant 활용 가능) */}
        <div className="mt-2">
          <CardMeta
            rarityText={rarityText}
            rarityStyle={rarityStyle}
            category={category}
            author={author}
            variant={variant}
            sizeVariant={sizeVariant}
            point={point}
            purchaseText={purchaseText}
            showSellStatus={showSellStatus}
            sellStatus={sellStatus}
          />
        </div>

        {/* 구분선 */}
        <div className="w-full mt-3" style={{ borderTop: "1px solid var(--color-gray-400)" }} />

        {/* 가격 / 잔여: 반응형 텍스트 */}
        <div className="flex justify-between items-center mt-3">
          <div className="text-gray-300 mobile:text-[12px] tablet:text-[14px] desktop:text-[16px]">
            가격
          </div>
          <div className="text-white mobile:text-[13px] tablet:text-[15px] desktop:text-[16px]">
            {price} P
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-gray-300 mobile:text-[12px] tablet:text-[14px] desktop:text-[16px]">
            {quantity !== null ? "수량" : "잔여"}
          </div>
          <div className="text-white mobile:text-[13px] tablet:text-[15px] desktop:text-[16px]">
            {quantity !== null ? quantity : `${remaining} / ${total}`}
          </div>
        </div>

        {/* favorite 아이콘 */}
        <div className="mt-3 mb-2">
          <img src={favoriteImg} alt="favorite" className="w-[72px] sm:w-[80px] object-contain" />
        </div>
      </div>
    </article>
  );
};

export default Card;
