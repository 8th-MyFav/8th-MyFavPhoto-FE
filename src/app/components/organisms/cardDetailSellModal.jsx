"use client";

import React, { useState } from "react";
import Button from "../atoms/button";

const CardDetailSellModal = ({ isOpen, onClose, card }) => {
  if (!isOpen || !card) return null;

  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(0); 

  const getRarityColor = (rarity) => {
    switch (rarity?.toUpperCase()) {
      case "COMMON":
        return "#EFFF04";
      case "RARE":
        return "#29C9F9";
      case "SUPER RARE":
        return "#A77EFF";
      case "LEGENDARY":
        return "#FF2A6A";
      default:
        return "#A4A4A4";
    }
  };

  const increase = () => {
    if (quantity < card.remaining) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
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
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute top-[30px] right-[30px] w-[24px] h-[24px] cursor-pointer"
          onClick={onClose}
        />

        <div className="flex flex-col mb-[40px]">
          <h2 className="text-[24px] text-gray-400 font-[BR B] mb-[10px]">
            나의 포토카드 판매하기
          </h2>
          <h3 className="text-[40px] font-bold text-white mb-[40px] border-b border-white pb-[10px]">
            {card.title}
          </h3>
        </div>

        <div className="flex justify-start gap-[20px] mb-[30px]">
          <img
            src={card.topImage}
            alt={card.title}
            className="w-[380px] h-[260px] object-cover rounded"
          />

          <div className="flex flex-col text-white items-start">
            <div className="flex items-center gap-[8px] mb-[20px]">
              <span style={{ color: getRarityColor(card.rarityIcon), fontWeight: 700 }}>
                {card.rarityIcon}
              </span>
              <span className="text-gray-400">|</span>
              <span>{card.category}</span>
              <span className="text-gray-400 ml-[4px]">|</span>
              <span>{card.author}</span>
            </div>

            <div className="border-t border-white/20 mb-[16px]" />

            {/* 수량: Detail 모달에서는 1부터 보유 수량까지 */}
            <div className="flex items-center mb-[12px]">
              <span className="font-bold mr-[8px]">수량</span>
              <div className="flex items-center border border-white/30 rounded px-[6px]">
                <button className="px-[10px] text-white" onClick={decrease}>-</button>
                <span className="mx-[10px] w-[10px] text-center">{quantity}</span>
                <button className="px-[10px] text-white" onClick={increase}>+</button>
              </div>
              <span className="text-gray-400 text-sm ml-[6px]">
                (보유 {card.remaining}장)
              </span>
            </div>

            <div className="flex items-center gap-[8px]">
              <span className="font-bold">장당 가격</span>
              <span className="w-[120px] h-[36px] flex items-center justify-center bg-transparent border border-white/30 rounded text-center text-white">
                {card.price}P
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/30 mb-[30px]" />

        <div className="text-white mb-[30px]">
          <h4 className="text-[20px] font-bold mb-[20px]">교환 희망 정보</h4>

          <div className="flex gap-[30px] mb-[20px]">
            <div className="flex-1 flex flex-col">
              <label className="text-white font-bold mb-[8px]">등급</label>
              <select
                className="h-[48px] bg-black border border-white/30 rounded px-2 text-gray-400 outline-none"
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
              >
                <option value="" disabled className="bg-black text-gray-400">등급을 선택해 주세요</option>
                <option value="COMMON" className="bg-black text-gray-400">COMMON</option>
                <option value="RARE" className="bg-black text-gray-400">RARE</option>
                <option value="SUPER RARE" className="bg-black text-gray-400">SUPER RARE</option>
                <option value="LEGENDARY" className="bg-black text-gray-400">LEGENDARY</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-white font-bold mb-[8px]">장르</label>
              <select
                className="h-[48px] bg-black border border-white/30 rounded px-2 text-gray-400 outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="" disabled className="bg-black text-gray-400">장르를 선택해 주세요</option>
                <option value="풍경" className="bg-black text-gray-400">풍경</option>
                <option value="인물" className="bg-black text-gray-400">인물</option>
                <option value="동물" className="bg-black text-gray-400">동물</option>
                <option value="추상" className="bg-black text-gray-400">추상</option>
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

        <div className="flex justify-end gap-[20px] border-t border-white/20 pt-[30px]">
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
            text="판매하기"
            width="400px"
            height="60px"
            backgroundColor="#EFFF04"
            color="#0F0F0F"
            onClick={() => {
              alert(`판매 등록 완료!\n수량: ${quantity}장\n가격: ${card.price}P`);
              onClose();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CardDetailSellModal;
