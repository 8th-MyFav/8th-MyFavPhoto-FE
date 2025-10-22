"use client";

import React from "react";

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
}) => {
  // 레어도 텍스트 스타일 결정
  let rarityText = rarityIcon.toUpperCase();
  let rarityStyle = {
    color: "var(--main-main, #EFFF04)",
    fontFamily: "Noto Sans KR",
    fontSize: "16px",
    fontWeight: 300,
  };

  if (rarityText === "RARE") rarityStyle.color = "var(--blue-blue, #29C9F9)";
  else if (rarityText === "SUPER RARE") rarityStyle.color = "var(--purple-purple, #A77EFF)";
  else if (rarityText === "LEGENDARY") rarityStyle.color = "var(--pink-pink, #FF2A6A)";

  return (
    <div
      className="w-[400px] h-[600px] flex-shrink-0 flex flex-col items-center pt-[40px] rounded-[2px] border"
      style={{
        borderColor: "rgba(255, 255, 255, 0.10)",
        backgroundColor: "var(--color-gray-500)",
      }}
    >
      {/* 상단 이미지 + Sold Out 처리 */}
      <div className="relative w-[360px] h-[270px]">
        <img
          src={topImage}
          alt="Top Image"
          className={`w-full h-full object-cover ${remaining === 0 ? "opacity-40" : ""}`}
        />
        {remaining === 0 && (
          <img
            src="/images/soldOut.svg"
            alt="Sold Out"
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        )}
      </div>

      {/* 제목 */}
      <h2
        className="w-[360px] mt-[25px] truncate"
        style={{
          color: "var(--color-white)",
          fontFamily: "var(--font-noto-bold-22)",
          fontSize: "22px",
          fontWeight: "bold",
          lineHeight: "normal",
        }}
      >
        {title}
      </h2>

      {/* 레어도 영역 */}
      <div className="w-[360px] flex justify-between items-center mt-[10px] h-[23px]">
        {/* 왼쪽: rarity + 구분선 + category */}
        <div className="flex items-center gap-[10px] h-[23px]">
          <span style={rarityStyle}>{rarityText}</span>
          <span className="text-gray-400 text-[16px] flex items-center h-[23px]">|</span>
          <span className="text-gray-300 text-[16px] flex items-center h-[23px]">{category}</span>
        </div>

        {/* 오른쪽 글쓴이 */}
        <span
          className="underline text-[16px]"
          style={{ color: "var(--color-white)", fontFamily: "var(--font-noto-regular-16)" }}
        >
          {author}
        </span>
      </div>

      {/* 구분선 */}
      <div className="w-[360px] h-0 mt-[20px]" style={{ borderTop: "1px solid var(--color-gray-400)" }} />

      {/* 가격 */}
      <div className="w-[360px] flex justify-between mt-[20px] items-center">
        <span className="text-gray-300 text-[16px]" style={{ fontFamily: "var(--font-noto-regular-16)" }}>
          가격
        </span>
        <span className="text-white text-[18px]" style={{ fontFamily: "var(--font-noto-regular-18)" }}>
          {price} P
        </span>
      </div>

      {/* 잔여 */}
      <div className="w-[360px] flex justify-between mt-[10px] items-center">
        <span className="text-gray-300 text-[16px]" style={{ fontFamily: "var(--font-noto-regular-16)" }}>
          잔여
        </span>
        <div className="flex items-center">
          <span className="text-white text-[18px] font-normal">{remaining}</span>
          <span className="w-[5px]" />
          <span className="text-gray-300 text-[18px] font-light">/ {total}</span>
        </div>
      </div>

      {/* 최애 이미지 */}
      <img
        src={favoriteImg}
        alt="Favorite Photo"
        className="object-contain mt-[20px]"
        style={{ width: "99.246px", height: "18px", flexShrink: 0 }}
      />
    </div>
  );
};

export default Card;
