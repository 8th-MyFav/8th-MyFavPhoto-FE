"use client";

import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { GRADE } from "@/constants";
import CardMeta from "../molecules/CardMeta";
import { useMarketUpdateListing } from "@/api/marketListings";

const CardDetailEdit = ({ isOpen, onClose, listing }) => {
  if (!isOpen || !listing) return null;

  // ✅ listing.card 기준으로 수정
  const card = listing.card || {};

  // 기본 카드 정보
  const cardGrade = card?.grade || "COMMON";
  const cardGenre = card?.genre || "기타";
  const authorName = card?.nickname || "익명";

  // 상태 초기화
  const [selectedRarity, setSelectedRarity] = useState(listing.trade_grade || "");
  const [selectedCategory, setSelectedCategory] = useState(listing.trade_genre || "");
  const [description, setDescription] = useState(listing.trade_note || "");
  const [quantity, setQuantity] = useState(listing.left_count || 1);
  const [price, setPrice] = useState(listing.price || 1);

  const { mutate: updateListing, isPending } = useMarketUpdateListing();

  // listing 변경 시 상태 동기화
  useEffect(() => {
    if (listing) {
      setSelectedRarity(listing.trade_grade || "");
      setSelectedCategory(listing.trade_genre || "");
      setDescription(listing.trade_note || "");
      setQuantity(listing.left_count || 1);
      setPrice(listing.price || 1);
    }
  }, [listing]);

  // 수량 & 가격 조정
  const increaseQuantity = () => setQuantity(prev => Math.min(prev + 1, listing.total_count));
  const decreaseQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));
  const increasePrice = () => setPrice(prev => prev + 1);
  const decreasePrice = () => setPrice(prev => Math.max(prev - 1, 1));

  // 저장
  const handleSave = () => {
    const isValid =
      quantity > 0 &&
      selectedRarity &&
      selectedCategory &&
      description.trim().length > 0 &&
      price > 0;

    if (!isValid) {
      alert("모든 필드를 올바르게 입력해주세요.");
      return;
    }

    const payload = {
      price,
      trade_grade: selectedRarity,
      trade_genre: selectedCategory,
      trade_note: description,
      left_count: quantity,
    };

    updateListing(
      { cardId: listing.id, data: payload },
      {
        onSuccess: () => {
          alert("수정이 완료되었습니다!");
          onClose();
        },
        onError: () => {
          alert("수정 중 오류가 발생했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  const GENRES = ["KPOP", "ACTOR", "ESPORTS", "KBO", "ANIMATION"];

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

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
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute top-[30px] right-[30px] w-[24px] h-[24px] cursor-pointer"
          onClick={onClose}
        />

        <div className="flex flex-col mb-[40px]">
          <h2 className="text-[24px] text-gray-400 font-[BR B] mb-[10px]">수정하기</h2>
          <h3 className="text-[40px] font-bold text-white mb-[40px] border-b border-white pb-[10px]">
            {card?.name || "이름 없음"}
          </h3>
        </div>

        <div className="flex justify-start gap-[20px] mb-[30px]">
          <img
            src={card?.image_url || "/images/default-card.png"}
            alt={card?.name}
            className="w-[380px] h-[260px] object-cover rounded"
          />
          <div className="flex flex-col text-white items-start w-full">
            <CardMeta
              rarityText={cardGrade}
              category={cardGenre}
              author={authorName}
              point={price}
              variant="withAuthor"
              sizeVariant="base"
              className="mb-[30px]"
            />

            <div className="w-full border-b border-gray-600 mb-[30px]" />

            <div className="flex items-center mb-[20px]">
              <span className="font-bold text-[16px] mr-[108px]">총 판매 수량</span>
              <div className="flex items-center">
                <div className="flex items-center justify-between w-[176px] h-[50px] border border-gray-300 bg-[#161616] rounded-[2px] flex-shrink-0 px-[10px]">
                  <button className="text-white text-[20px]" onClick={decreaseQuantity}>-</button>
                  <span className="text-[18px]">{quantity}</span>
                  <button className="text-white text-[20px]" onClick={increaseQuantity}>+</button>
                </div>
                <div className="flex flex-col items-center justify-center ml-[10px] leading-tight">
                  <span className="text-[20px]" style={{ color: "#FFF" }}>/ {listing.total_count}</span>
                  <span className="text-[12px]" style={{ color: "#DDD" }}>최대 {listing.total_count}장</span>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-[30px]">
              <span className="font-bold text-[16px] mr-[126px]">장당 가격</span>
              <div className="flex items-center">
                <div className="flex items-center justify-between w-[176px] h-[50px] border border-gray-300 bg-[#161616] rounded-[2px] flex-shrink-0 px-[10px]">
                  <button className="text-white text-[20px]" onClick={decreasePrice}>-</button>
                  <span className="text-[18px]">{price}</span>
                  <button className="text-white text-[20px]" onClick={increasePrice}>+</button>
                </div>
                <span className="text-[18px] text-white ml-[10px]">P</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-white mb-[30px] pt-[30px]">
          <h4 className="text-[20px] font-bold mb-[20px]">교환 희망 정보</h4>
          <div className="border-b-[2px] border-[#EEE] mb-[20px]" />

          <div className="flex gap-[30px] mb-[20px]">
            <div className="flex-1 flex flex-col">
              <label className="text-white font-bold mb-[8px]">등급</label>
              <select
                className="h-[48px] bg-black border border-white/30 rounded px-2 text-gray-400 outline-none"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                <option value="" disabled>등급을 선택해 주세요</option>
                <option value={GRADE.COMMON}>{GRADE.COMMON}</option>
                <option value={GRADE.RARE}>{GRADE.RARE}</option>
                <option value={GRADE.SUPER_RARE}>{GRADE.SUPER_RARE}</option>
                <option value={GRADE.LEGENDARY}>{GRADE.LEGENDARY}</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-white font-bold mb-[8px]">장르</label>
              <select
                className="h-[48px] bg-black border border-white/30 rounded px-2 text-gray-400 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled>장르를 선택해 주세요</option>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-[8px] font-bold text-[16px]">교환 희망 설명</label>
            <textarea
              className="w-full h-[120px] p-3 rounded border border-white/20 bg-transparent text-white placeholder-gray-400 resize-none"
              placeholder="설명을 입력해 주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-[20px]">
          <Button text="취소하기" width="400px" height="60px" backgroundColor="transparent" color="#FFF" border="1px solid #FFF" onClick={onClose} />
          <Button text={isPending ? "수정 중..." : "수정하기"} width="400px" height="60px" backgroundColor="#EFFF04" color="#0F0F0F" onClick={handleSave} disabled={isPending} />
        </div>
      </div>
    </>
  );
};

export default CardDetailEdit;
