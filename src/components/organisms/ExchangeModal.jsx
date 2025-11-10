"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "./Card";
import { PATHNAME } from "@/constants";
import { useMarketTradeCreate } from "@/api/marketTrades";

const ExchangeModal = ({ selectedCard, onClose, tradePostId, targetCard }) => {
  const [offerText, setOfferText] = useState("");
  const router = useRouter();
  const tradeCreateMutation = useMarketTradeCreate();

  if (!selectedCard) return null;

  // ✅ 교환 버튼 클릭 시 API 호출
  const handleExchange = async () => {
    try {
      await tradeCreateMutation.mutateAsync({
        tradePostId: tradePostId,      // 교환 대상 카드 ID
        offeredCardId: selectedCard.id,  // 내가 제시하는 카드 ID
        content: offerText,              // 교환 제시 내용
      });

      // 성공 시 이동
      router.push(
        `${PATHNAME.EXCHANGE_SUCCESS}?title=${encodeURIComponent(
          targetCard.title
        )}&my=${encodeURIComponent(selectedCard.title)}`
      );
    } catch (error) {
      console.error(error);

      // 실패 시 이동
      router.push(
        `${PATHNAME.EXCHANGE_FAIL}?title=${encodeURIComponent(
          targetCard.title
        )}&my=${encodeURIComponent(selectedCard.title)}`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-start bg-[rgba(0,0,0,0.8)] z-50 overflow-y-auto"
      style={{ paddingTop: "89px" }}
    >
      <div
        className="relative flex flex-col rounded-[4px]"
        style={{
          width: "1160px",
          backgroundColor: "var(--color-black)",
          paddingBottom: "60px",
          marginBottom: "89px",
        }}
      >
        {/* 닫기 버튼 */}
        <img
          src="/images/close.svg"
          alt="close"
          onClick={onClose}
          className="absolute right-[30px] top-[30px] cursor-pointer"
          style={{ width: "32px", height: "32px" }}
        />

        {/* 상단 텍스트 */}
        <div className="flex flex-col" style={{ margin: "60px 120px 0" }}>
          <h2
            style={{
              color: "var(--color-gray-300)",
              fontFamily: "var(--font-br)",
              fontSize: "24px",
              marginBottom: "40px",
            }}
          >
            포토카드 교환하기
          </h2>

          <h1
            style={{
              color: "var(--color-white)",
              fontFamily: "var(--font-noto)",
              fontSize: "40px",
              fontWeight: 700,
              marginBottom: "20px",
            }}
          >
            {selectedCard.title}
          </h1>

          <hr
            style={{
              borderTop: "2px solid var(--color-gray-100)",
              marginBottom: "50px",
            }}
          />
        </div>

        {/* 카드 + 폼 */}
        <div
          className="flex justify-center"
          style={{
            gap: "40px",
            marginLeft: "120px",
            marginRight: "120px",
          }}
        >
          {/* 왼쪽 카드 */}
          <Card
            {...selectedCard}
            rarityIcon={selectedCard.rarity}
            category={selectedCard.category}
            author={selectedCard.author}
          />

          {/* 오른쪽 입력 */}
          <div className="flex flex-col">
            <label
              htmlFor="exchange"
              style={{
                color: "var(--color-white)",
                fontFamily: "var(--font-noto)",
                fontSize: "20px",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              교환 제시 내용
            </label>

            <textarea
              id="exchange"
              placeholder="내용을 입력해 주세요"
              className="resize-none placeholder-gray-200"
              value={offerText}
              onChange={(e) => setOfferText(e.target.value)}
              style={{
                width: "440px",
                height: "125px",
                padding: "18px 20px",
                borderRadius: "2px",
                border: "1px solid var(--color-gray-200)",
                background: "transparent",
                color: "var(--color-white)",
                fontFamily: "var(--font-noto)",
                fontSize: "16px",
                marginBottom: "60px",
              }}
            />

            <div className="flex gap-[20px]">
              <button
                onClick={onClose}
                className="cursor-pointer"
                style={{
                  width: "210px",
                  height: "60px",
                  borderRadius: "2px",
                  border: "1px solid var(--color-gray-100)",
                  background: "var(--color-gray-500)",
                  color: "var(--color-white)",
                  fontFamily: "var(--font-noto)",
                  fontSize: "18px",
                  fontWeight: 500,
                }}
              >
                취소하기
              </button>

              <button
                onClick={handleExchange}
                className="cursor-pointer"
                style={{
                  width: "210px",
                  height: "60px",
                  borderRadius: "2px",
                  background: "var(--color-main)",
                  color: "var(--color-black)",
                  fontFamily: "var(--font-noto)",
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                교환하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangeModal;
