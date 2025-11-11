"use client";

import React from "react";
import CardMeta from "@/components/molecules/CardMeta";
import Tag from "@/components/atoms/Tag";

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
  let rarityStyle = {
    color: "var(--main-main, #EFFF04)",
    fontFamily: "Noto Sans KR",
    fontWeight: 700,
  };
  if (rarityText === "RARE") rarityStyle.color = "var(--blue-blue, #29C9F9)";
  else if (rarityText === "SUPER RARE")
    rarityStyle.color = "var(--purple-purple, #A77EFF)";
  else if (rarityText === "LEGENDARY")
    rarityStyle.color = "var(--pink-pink, #FF2A6A)";

  return (
    <article
      className={`
        w-full max-w-[440px]
        mobile:max-w-[calc(50vw-24px)]
        tablet:max-w-[340px]
        flex-shrink-0
        flex flex-col
        rounded-[2px] border box-border overflow-hidden
      `}
      style={{
        borderColor: "rgba(255,255,255,0.10)",
        backgroundColor: "var(--color-gray-500)",
        aspectRatio: "440/600",
      }}
    >
      {/* 이미지 영역 */}
      <div
        className="relative w-full"
        style={{
          height: "50%",
          paddingLeft: "9%",
          paddingRight: "9%",
          paddingTop: "9%",
        }}
      >
        {showTag && (
          <div className="absolute z-10" style={{ top: "16%", left: "10%" }}>
            <Tag type={tagType} size="small" />
          </div>
        )}

        <img
          src={topImage}
          alt={title}
          className={`w-full h-full object-cover rounded-[2px] ${
            isSoldOut ? "opacity-40" : ""
          }`}
        />

        {isSoldOut && (
          <img
            src="/images/soldOut.svg"
            alt="sold out"
            className="absolute w-full h-full object-contain pointer-events-none"
            style={{ top: 0, left: 0 }}
          />
        )}
      </div>

      {/* 본문 영역 */}
      <div
        className="flex-1 flex flex-col"
        style={{
          paddingLeft: "9.09%",
          paddingRight: "9.09%",
          paddingTop: "3.33%",
        }}
      >
        {/* 제목 */}
        <h3
          className="truncate text-white font-bold desktop:text-[18px] tablet:text-[16px] mobile:text-[14px] leading-tight"
          title={title}
        >
          {title}
        </h3>

        {/* 메타 정보 */}
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
        <div
          className="w-full desktop:mt-4 tablet:mt-3 mobile:mt-2"
          style={{ borderTop: "1px solid var(--color-gray-400)" }}
        />

        {/* 가격 정보 */}
        <div className="flex justify-between items-center desktop:mt-4 tablet:mt-3 mobile:mt-2">
          <div className="text-gray-300 desktop:text-[16px] tablet:text-[13px] mobile:text-[10px]">
            가격
          </div>
          <div className="text-white desktop:text-[16px] tablet:text-[14px] mobile:text-[11px]">
            {price} P
          </div>
        </div>

        {/* 잔여/수량 정보 */}
        <div className="flex justify-between items-center desktop:mt-2 tablet:mt-2 mobile:mt-1">
          <div className="text-gray-300 desktop:text-[16px] tablet:text-[13px] mobile:text-[10px]">
            {quantity !== null ? "수량" : "잔여"}
          </div>
          <div className="text-white desktop:text-[16px] tablet:text-[14px] mobile:text-[11px]">
            {quantity !== null ? quantity : `${remaining} / ${total}`}
          </div>
        </div>
      </div>

      {/* 하단 로고: 상하 padding 6.67% (600px 기준 40px), 중앙 정렬 */}
      <div
        className="flex justify-center items-center"
        style={{ paddingTop: "10%", paddingBottom: "10%" }}
      >
        <img
          src={favoriteImg}
          alt="favorite"
          className="object-contain"
          style={{ width: "20%" }}
        />
      </div>
    </article>
  );
};

export default Card;
