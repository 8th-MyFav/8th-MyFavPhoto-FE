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
        src={proposal.imageUrl}
        alt={proposal.title}
        className="w-full h-[220px] object-cover rounded-[4px] mb-[20px]"
      />

      {/* CardMeta 영역 */}
      <div className="mb-[15px]">
        <CardMeta
          rarityText={proposal.rarity}
          category={proposal.category}
          point={proposal.price}
          author={proposal.sellerName}
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
        {proposal.description}
      </p>

      {/* 버튼 영역 */}
      {mode === "trade" ? (
        <div className="flex gap-[20px]">
          <button
            onClick={() => onReject?.(proposal)}
            className="flex w-full h-[60px] justify-center items-center border border-[var(--color-gray-100)] rounded-[2px] bg-[var(--color-gray-500)] text-white font-medium text-[18px] cursor-pointer"
          >
            거절하기
          </button>
          <button
            onClick={() => onApprove?.(proposal)}
            className="flex w-full h-[60px] justify-center items-center rounded-[2px] bg-[var(--color-main)] text-[var(--color-black)] font-bold text-[18px] cursor-pointer"
          >
            승인하기
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => onCancel?.(proposal)}
            className="flex w-full h-[60px] justify-center items-center border border-[var(--color-gray-100)] rounded-[2px] bg-[var(--color-gray-500)] text-white font-medium text-[18px] cursor-pointer"
          >
            취소하기
          </button>
        </div>
      )}
    </div>
  );
};

export default TradeCard;
