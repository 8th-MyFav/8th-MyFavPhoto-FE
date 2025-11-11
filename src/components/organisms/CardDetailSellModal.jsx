"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../atoms/Button";
import CardMeta from "../molecules/CardMeta";
import { PATHNAME, GRADE } from "@/constants";
import { useMarketCreateListing } from "@/api/marketListings";

const CardDetailSellModal = ({ isOpen, onClose, card }) => {
  const router = useRouter();
  const { mutateAsync: createListing, isPending } = useMarketCreateListing();

  if (!isOpen || !card) return null;

  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0);

  /** 수량 조절 */
  const increase = () => {
    if (quantity < card.remaining) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  /** ✅ 판매 처리 (React Query 사용) */
  const handleSell = async () => {
    const isValid =
      quantity > 0 &&
      selectedRarity &&
      selectedCategory &&
      description.trim().length > 0;

    if (!isValid) {
      router.push(
        `${PATHNAME.SELL_FAIL}?rarity=${card.rarity}&title=${encodeURIComponent(
          card.title
        )}&quantity=${quantity}&error=${encodeURIComponent(
          "입력값이 올바르지 않습니다."
        )}`
      );
      onClose();
      return;
    }

    try {
      const response = await createListing({
        cardId: card.id,
        total_count: quantity, 
        trade_grade: selectedRarity,
        trade_genre: selectedCategory,
        trade_note: description,
      });

      const tradePostId = response.id || response.trade_post_id;

      router.push(
        `${PATHNAME.SELL_SUCCESS}?rarity=${
          card.rarity
        }&title=${encodeURIComponent(card.title)}&quantity=${quantity}&tradePostId=${
          tradePostId || ""
        }`
      );
    } catch (error) {
      console.error("판매 등록 실패:", error);

      router.push(
        `${PATHNAME.SELL_FAIL}?rarity=${card.rarity}&title=${encodeURIComponent(
          card.title
        )}&quantity=${quantity}&error=${encodeURIComponent(
          error.message || "판매 등록에 실패했습니다."
        )}`
      );
    } finally {
      onClose();
    }
  };

  return (
    <>
      {/* 배경 */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

      {/* 모달 */}
      <div
        className="fixed left-1/2 top-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
        style={{
          width: "918px",
          height: "676px",
          borderRadius: "2px",
          background: "#0F0F0F",
          border: "1px solid rgba(255,255,255,0.10)",
          padding: "40px",
        }}
      >
        {/* 닫기 버튼 */}
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute top-[30px] right-[30px] w-[24px] h-[24px] cursor-pointer"
          onClick={onClose}
        />

        {/* 헤더 */}
        <div className="flex flex-col mb-[40px]">
          <h2
            className="text-[24px] text-gray-400 font-[BR B] mb-[10px]"
            style={{ fontFamily: "var(--font-br)" }}
          >
            나의 포토카드 판매하기
          </h2>
          <h3
            className="text-[40px] text-white mb-[40px] border-b border-white pb-[10px]"
            style={{ fontFamily: "var(--font-br)" }}
          >
            {card.title}
          </h3>
        </div>

        {/* 메인 정보 섹션 */}
        <div className="flex justify-start gap-[20px] mb-[30px]">
          {/* 이미지 */}
          <img
            src={card.topImage}
            alt={card.title}
            className="w-[380px] h-[260px] object-cover rounded"
          />

          {/* 정보 텍스트 */}
          <div className="flex flex-col text-white items-start">
            <div className="mb-[36px] w-full">
              <CardMeta
                rarityText={card.rarity || "COMMON"}
                category={card.category}
                author={card.author}
                variant="withAuthor"
                sizeVariant="base"
              />
            </div>

            <div className="w-full border-b border-gray-600 mb-[30px]" />

            {/* 총 판매 수량 */}
            <div className="flex items-center mb-[20px]">
              <span className="font-bold text-[16px] mr-[108px]">
                총 판매 수량
              </span>

              <div className="flex items-center">
                <div className="flex items-center justify-between w-[176px] h-[50px] border border-gray-300 bg-[#161616] rounded-[2px] flex-shrink-0 px-[10px]">
                  <button
                    className="text-white text-[20px]"
                    onClick={decrease}
                    disabled={isPending}
                  >
                    -
                  </button>
                  <span className="text-[18px]">{quantity}</span>
                  <button
                    className="text-white text-[20px]"
                    onClick={increase}
                    disabled={isPending}
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col items-center justify-center ml-[10px] leading-tight">
                  <span className="text-[20px]" style={{ color: "#FFF" }}>
                    / {card.remaining}
                  </span>
                  <span className="text-[12px]" style={{ color: "#DDD" }}>
                    최대 {card.remaining}장
                  </span>
                </div>
              </div>
            </div>

            {/* 장당 가격 */}
            <div className="flex items-center mb-[30px]">
              <span className="font-bold text-[16px] mr-[127px]">장당 가격</span>
              <div className="flex items-center justify-center w-[230px] h-[50px] border border-gray-300 bg-[#161616] rounded-[2px] text-[18px]">
                {card.price}P
              </div>
            </div>
          </div>
        </div>

        {/* 교환 희망 정보 섹션 */}
        <div className="text-white mb-[30px] pt-[30px]">
          <h4 className="text-[20px] font-bold mb-[20px]">교환 희망 정보</h4>
          <div className="border-b-[2px] border-[#EEE] mb-[20px]" />

          <div className="flex gap-[30px] mb-[20px]">
            {/* 등급 */}
            <div className="flex-1 flex flex-col">
              <label className="text-white font-bold mb-[8px]">등급</label>
              <select
                className="h-[48px] bg-black border border-white/30 rounded px-2 text-gray-400 outline-none"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                disabled={isPending}
              >
                <option value="" disabled>
                  등급을 선택해 주세요
                </option>
                <option value={GRADE.COMMON}>{GRADE.COMMON}</option>
                <option value={GRADE.RARE}>{GRADE.RARE}</option>
                <option value={GRADE.SUPER_RARE}>{GRADE.SUPER_RARE}</option>
                <option value={GRADE.LEGENDARY}>{GRADE.LEGENDARY}</option>
              </select>
            </div>

            {/* 장르 */}
            <div className="flex-1 flex flex-col">
              <label className="text-white font-bold mb-[8px]">장르</label>
              <select
                className="h-[48px] bg-black border border-white/30 rounded px-2 text-gray-400 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isPending}
              >
                <option value="" disabled>
                  장르를 선택해 주세요
                </option>
                <option value="KPOP">KPOP</option>
                <option value="ACTOR">ACTOR</option>
                <option value="ESPORTS">ESPORTS</option>
                <option value="KBO">KBO</option>
                <option value="ANIMATION">ANIMATION</option>
              </select>
            </div>
          </div>

          {/* 설명 */}
          <div className="flex flex-col">
            <label className="mb-[8px] font-bold text-[16px]">
              교환 희망 설명
            </label>
            <textarea
              className="w-full h-[120px] p-3 rounded border border-white/20 bg-transparent text-white placeholder-gray-400 resize-none"
              placeholder="설명을 입력해 주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-[20px]">
          <Button
            text="취소하기"
            width="400px"
            height="60px"
            backgroundColor="transparent"
            color="#FFF"
            border="1px solid #FFF"
            onClick={onClose}
            disabled={isPending}
          />
          <Button
            text={isPending ? "등록 중..." : "판매하기"}
            width="400px"
            height="60px"
            backgroundColor="#EFFF04"
            color="#0F0F0F"
            onClick={handleSell}
            disabled={isPending}
          />
        </div>
      </div>
    </>
  );
};

export default CardDetailSellModal;
