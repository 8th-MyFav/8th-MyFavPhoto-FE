"use client";

import React from "react";

const TradeCard = ({
  proposal,
  onApprove,
  onReject,
  onCancel, // 구매 페이지용 취소 버튼 콜백
  mode = "trade", // "trade" = 승인/거절, "purchase" = 취소 버튼
}) => {
  if (!proposal) return null;

  const rarityText = proposal.rarity || "COMMON";
  const rarityStyle = {
    fontFamily: "var(--font-noto)",
    fontSize: "14px",
    fontWeight: 400,
  };

  if (rarityText === "COMMON")
    rarityStyle.color = "var(--yellow-yellow, #EFFF04)";
  else if (rarityText === "RARE")
    rarityStyle.color = "var(--blue-blue, #29C9F9)";
  else if (rarityText === "SUPER RARE")
    rarityStyle.color = "var(--purple-purple, #A77EFF)";
  else if (rarityText === "LEGENDARY")
    rarityStyle.color = "var(--pink-pink, #FF2A6A)";
  else rarityStyle.color = "var(--color-white)";

  return (
    <div
      className="w-full lg:w-[360px] bg-[#111] border border-gray-700 rounded-[4px] flex flex-col"
      style={{ minHeight: "520px", padding: "30px" }}
    >
      {/* 이미지 영역 */}
      <img
        src={proposal.imageUrl || "/images/sample.svg"}
        alt={proposal.title || "교환 제시 이미지"}
        className="w-full h-[220px] object-cover rounded-[4px] mb-[20px]"
      />

      {/* 내용 영역 */}
      <div className="flex flex-col">
        {/* 카드 제목 */}
        <h3
          style={{
            color: "var(--color-white)",
            fontFamily: "var(--font-noto)",
            fontSize: "22px",
            fontWeight: 700,
          }}
          className="mb-[8px]"
        >
          {proposal.title || "스페인 여행"}
        </h3>

        {/* 카드 기본 정보 */}
        <div
          className="flex justify-between items-center mb-[20px]"
          style={{
            borderBottom: "1px solid var(--gray-gray400, #5A5A5A)",
            paddingBottom: "20px",
          }}
        >
          <div className="flex items-center gap-[10px]">
            <span style={rarityStyle}>{rarityText}</span>
            <span style={{ color: "var(--color-gray-300)", fontSize: "14px" }}>|</span>
            <span
              style={{
                color: "var(--color-gray-300)",
                fontSize: "14px",
              }}
            >
              {proposal.category || "풍경"}
            </span>
            <span style={{ color: "var(--color-gray-300)", fontSize: "14px" }}>|</span>

            <span
              style={{
                color: "var(--color-white)",
                fontFamily: "var(--font-noto)",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              {proposal.price || "4"} P
            </span>

            <span
              style={{
                color: "var(--color-gray-300)",
                fontFamily: "var(--font-noto)",
                fontSize: "14px",
                fontWeight: 400,
              }}
            >
              에 구매
            </span>
          </div>

          <span
            className="underline"
            style={{
              fontFamily: "var(--font-noto)",
              fontSize: "14px",
              fontWeight: 400,
            }}
          >
            {proposal.sellerName || "프로 여행러"}
          </span>
        </div>

        {/* 설명 */}
        <p
          style={{
            color: "var(--color-white)",
            fontFamily: "var(--font-noto)",
            fontSize: "16px",
            fontWeight: 400,
          }}
          className="mb-[40px]"
        >
          {proposal.description ||
            "스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고 싶습니다!"}
        </p>

        {/* 버튼 영역 */}
        {mode === "trade" ? (
          <div className="flex gap-[20px]">
            <button
              onClick={() => onReject?.(proposal.id)}
              style={{
                display: "flex",
                width: "100%",
                height: "60px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "2px",
                border: "1px solid var(--color-gray-100)",
                background: "var(--color-gray-500)",
                color: "var(--color-white)",
                fontFamily: "var(--font-noto)",
                fontSize: "18px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              거절하기
            </button>
            <button
              onClick={() => onApprove?.(proposal.id)}
              style={{
                display: "flex",
                width: "100%",
                height: "60px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "2px",
                background: "var(--color-main)",
                color: "var(--color-black)",
                fontFamily: "var(--font-noto)",
                fontSize: "18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              승인하기
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => onCancel?.(proposal.id)}
              style={{
                display: "flex",
                width: "100%",       
                height: "60px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "2px",
                border: "1px solid var(--color-gray-100)", 
                background: "var(--color-gray-500)",       
                color: "var(--color-white)",               
                fontFamily: "var(--font-noto)",
                fontSize: "18px",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              취소하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradeCard;
