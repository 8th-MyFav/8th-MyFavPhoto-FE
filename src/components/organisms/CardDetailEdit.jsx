"use client";

import React, { useState } from "react";
import Button from "../atoms/Button";
import { GRADE } from "@/constants";
import CardMeta from "../molecules/CardMeta";

const CardDetailEdit = ({ isOpen, onClose, card }) => {
  if (!isOpen || !card) return null;

  // 임시 author (하드코딩)
  const TEMP_AUTHOR = "코드잇";

  const [selectedRarity, setSelectedRarity] = useState(card.rarity || "");
  const [selectedCategory, setSelectedCategory] = useState(card.category || "");
  const [description, setDescription] = useState(card.description || "");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(card.price || 1);

  const increaseQuantity = () => {
    if (quantity < card.remaining) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increasePrice = () => setPrice(price + 1);
  const decreasePrice = () => {
    if (price > 1) setPrice(price - 1);
  };

  const handleSave = () => {
    const isValid =
      quantity > 0 &&
      selectedRarity &&
      selectedCategory &&
      description.trim().length > 0;

    // TODO: 나중에 API 요청 추가
    onClose();
  };

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
        {/* 닫기 버튼 */}
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute top-[30px] right-[30px] w-[24px] h-[24px] cursor-pointer"
          onClick={onClose}
        />

        {/* 헤더 */}
        <div className="flex flex-col mb-[40px]">
          <h2 className="text-[24px] text-gray-400 font-[BR B] mb-[10px]">
            수정하기
          </h2>
          <h3 className="text-[40px] font-bold text-white mb-[40px] border-b border-white pb-[10px]">
            {card.title}
          </h3>
        </div>

        {/* 메인 정보 */}
        <div className="flex justify-start gap-[20px] mb-[30px]">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-[380px] h-[260px] object-cover rounded"
          />
          <div className="flex flex-col text-white items-start w-full">
            {/* CardMeta 적용 */}
            <CardMeta
              rarityText={selectedRarity}
              category={selectedCategory}
              point={price}
              author={TEMP_AUTHOR}
              variant="withAuthor"
              sizeVariant="base"
              className="mb-[30px]"
            />

            {/* 회색선 */}
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
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <span className="text-[18px]">{quantity}</span>
                  <button
                    className="text-white text-[20px]"
                    onClick={increaseQuantity}
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
              <span className="font-bold text-[16px] mr-[126px]">
                장당 가격
              </span>
              <div className="flex items-center">
                <div className="flex items-center justify-between w-[176px] h-[50px] border border-gray-300 bg-[#161616] rounded-[2px] flex-shrink-0 px-[10px]">
                  <button
                    className="text-white text-[20px]"
                    onClick={decreasePrice}
                  >
                    -
                  </button>
                  <span className="text-[18px]">{price}</span>
                  <button
                    className="text-white text-[20px]"
                    onClick={increasePrice}
                  >
                    +
                  </button>
                </div>
                <span className="text-[18px] text-white ml-[10px]">P</span>
              </div>
            </div>
          </div>
        </div>

        {/* 교환 희망 정보 */}
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
                <option value="" disabled>
                  등급을 선택해 주세요
                </option>
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
                <option value="" disabled>
                  장르를 선택해 주세요
                </option>
                <option value="풍경">풍경</option>
                <option value="인물">인물</option>
                <option value="동물">동물</option>
                <option value="추상">추상</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-[8px] font-bold text-[16px]">
              교환 희망 설명
            </label>
            <textarea
              className="w-full h-[120px] p-3 rounded border border-white/20 bg-transparent text-white placeholder-gray-400 resize-none"
              placeholder="설명을 입력해 주세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          />
          <Button
            text="수정하기"
            width="400px"
            height="60px"
            backgroundColor="#EFFF04"
            color="#0F0F0F"
            onClick={handleSave}
          />
        </div>
      </div>
    </>
  );
};

export default CardDetailEdit;
