"use client";

import React, { useState, useMemo } from "react";
import Search from "../molecules/search";
import Dropdown from "../molecules/dropDown";
import Card from "../organisms/card";

const CardTradeModal = ({ isOpen, onClose, onCardSelect }) => {
  if (!isOpen) return null;

  // MyGallery용 더미 카드 데이터
  const myCardList = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    topImage: "/images/sample.svg",
    title: `내 포토카드 ${i + 1}`,
    rarity: i % 4 === 0 ? "COMMON" : i % 4 === 1 ? "RARE" : i % 4 === 2 ? "SUPER RARE" : "LEGENDARY",
    category: i % 3 === 0 ? "풍경" : i % 3 === 1 ? "인물" : "동물",
    author: "나 자신",
    remaining: 3,
  }));

  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredCards = useMemo(() => {
    return myCardList.filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchText.toLowerCase()) ||
        card.author.toLowerCase().includes(searchText.toLowerCase());
      const matchesRarity = selectedRarity ? card.rarity === selectedRarity : true;
      const matchesCategory = selectedCategory ? card.category === selectedCategory : true;
      return matchesSearch && matchesRarity && matchesCategory;
    });
  }, [myCardList, searchText, selectedRarity, selectedCategory]);

  return (
    <>
      {/* 배경 */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />

      {/* 모달 본체 */}
      <div
        className="fixed left-1/2 z-50 flex flex-col items-center"
        style={{
          height: "calc(100vh - 80px)",
          top: "40px",
          transform: "translateX(-50%)",
          borderRadius: "2px",
          background: "var(--gray-gray500, #161616)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "40px 50px",
          overflowY: "auto",
        }}
      >
        {/* 닫기 버튼 */}
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute top-[30px] right-[30px] w-[24px] h-[24px] cursor-pointer"
          onClick={onClose}
        />

        {/* 타이틀 */}
        <div className="w-full text-left mb-[40px]">
          <h2
            style={{
              color: "var(--gray-gray300, #A4A4A4)",
              fontFamily: "BR B",
              fontSize: "24px",
              marginBottom: "0px",
            }}
          >
            마이 갤러리
          </h2>
          <h3
            style={{
              color: "#FFF",
              fontFamily: "BR B",
              fontSize: "46px",
              borderBottom: "1px solid #FFF",
              paddingBottom: "20px",
              marginTop: "20px",
            }}
          >
            포토카드 교환하기
          </h3>
        </div>

        {/* 검색 + 드롭다운 */}
        <div className="flex w-full items-center mb-[30px]">
          <div className="mr-[60px]">
            <Search onSearch={(value) => setSearchText(value)} />
          </div>
          <div className="flex gap-[45px]">
            <Dropdown
              options={["COMMON", "RARE", "SUPER RARE", "LEGENDARY"]}
              placeholder="등급"
              height="48px"
              maxWidth="300px"
              onChange={(value) => setSelectedRarity(value)}
            />
            <Dropdown
              options={["풍경", "인물", "동물"]}
              placeholder="장르"
              height="48px"
              maxWidth="300px"
              onChange={(value) => setSelectedCategory(value)}
            />
          </div>
        </div>

        {/* 카드 리스트 */}
        <div
          className="grid gap-[24px] justify-center"
          style={{ gridTemplateColumns: "repeat(2, 1fr)", width: "100%" }}
        >
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  onClose();
                  onCardSelect?.(card);
                }}
                className="cursor-pointer"
              >
                <Card
                  {...card}
                  rarityIcon={card.rarity} 
                  quantity={card.remaining || 0}
                  showRemainingAsFraction={false}
                />
              </div>
            ))
          ) : (
            <div className="text-center text-gray-300 col-span-2 mt-[100px] text-[18px]">
              조건에 맞는 포토카드가 없습니다.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CardTradeModal;
