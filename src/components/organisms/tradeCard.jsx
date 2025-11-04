"use client";

import React from "react";
import CardMeta from "@/components/molecules/CardMeta";

const TradeCard = ({
  proposal,
  onApprove,
  onReject,
  onCancel, // 구매 페이지용 취소 버튼 콜백
  mode = "trade", // "trade" = 승인/거절, "purchase" = 취소 버튼
}) => {
  if (!proposal) return null;

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

      {/* CardMeta 영역 */}
      <div style={{ marginBottom: "15px" }}>
        <CardMeta
          rarityText={proposal.rarity || "COMMON"} 
          category={proposal.category || "풍경"}
          point={proposal.price || 4}
          author={proposal.sellerName || "프로 여행러"}
          variant="withAuthor"
        />
      </div>

      {/* 회색 구분선 */}
      <div
        style={{
          borderBottom: "1px solid var(--gray-gray400, #5A5A5A)",
          marginBottom: "15px",
        }}
      ></div>

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
  );
};

export default TradeCard;
