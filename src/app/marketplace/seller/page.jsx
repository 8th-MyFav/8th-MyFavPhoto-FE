// 나의 판매 포토카드 페이지 (판매 중인 포토카드 페이지)
"use client";
feat-김성준2
// 판매자 페이지
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MarketplaceHeader from "@/components/molecules/marketplaceHeader";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SellerHeader from "@/components/molecules/sellerHeader";
develop
import SearchMolecule from "@/components/molecules/search";
import Dropdown from "@/components/molecules/dropDown";
import Card from "@/components/organisms/card";
//import Modal from "@/components/molecules/modal";
import SellPhotoModal from "@/components/organisms/sellPhotoModal";
import CardDetailSellModal from "@/components/organisms/cardDetailSellModal";
import Tag from "@/components/atoms/tag";
feat-김성준2
import Badge from "@/components/atoms/badge";
=======
develop

// 더미 카드 데이터
const cardDataServer = Array.from({ length: 30 }, (_, i) => ({
  topImage: "/images/sample.svg",
  title: `아름다운 풍경 ${i + 1}`,
  rarityIcon:
    i % 4 === 0
      ? "COMMON"
      : i % 4 === 1
      ? "RARE"
      : i % 4 === 2
      ? "SUPER RARE"
      : "LEGENDARY",
  category: i % 3 === 0 ? "풍경" : i % 3 === 1 ? "인물" : "동물",
  author: `글쓴이 ${i + 1}`,
  price: (i + 1) * 10,
  remaining: i % 3 === 0 ? 0 : 2,
  total: 5,
  favoriteImg: "/images/favorite.svg",
}));

const ITEMS_PER_PAGE = 6; // 한 번에 로드할 카드 수

const SellerPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [displayedCards, setDisplayedCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // 로그인 모달 (나중에 사용할 예정)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedSellCard, setSelectedSellCard] = useState(null);

  const observer = useRef();

  // 필터링 + 정렬 적용
  const filteredCards = cardDataServer
    .filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchText.toLowerCase()) ||
        card.author.toLowerCase().includes(searchText.toLowerCase());
      const matchesRarity = selectedRarity ? card.rarityIcon === selectedRarity : true;
      const matchesCategory = selectedCategory ? card.category === selectedCategory : true;
      const matchesStatus =
        selectedStatus === "판매중"
          ? card.remaining > 0
          : selectedStatus === "매진"
          ? card.remaining === 0
          : true;
      return matchesSearch && matchesRarity && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "낮은 가격순") return a.price - b.price;
      if (sortOrder === "높은 가격순") return b.price - a.price;
      if (sortOrder === "최신순") return b.title.localeCompare(a.title);
      return 0;
    });

  // 초기 카드 로딩
  useEffect(() => {
    setDisplayedCards(filteredCards.slice(0, ITEMS_PER_PAGE));
    setHasMore(filteredCards.length > ITEMS_PER_PAGE);
  }, [searchText, selectedRarity, selectedCategory, selectedStatus, sortOrder]);

  // 무한 스크롤 마지막 카드 감지
  const lastCardRef = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  };

  // 더 불러오기
  const loadMore = () => {
    const currentLength = displayedCards.length;
    const more = filteredCards.slice(currentLength, currentLength + ITEMS_PER_PAGE);
    setDisplayedCards((prev) => [...prev, ...more]);
    if (currentLength + more.length >= filteredCards.length) setHasMore(false);
  };

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = (index) => {
    router.push(`/marketplace/detail/${index}`);
  };

  const handleSellButtonClick = () => setIsSellModalOpen(true);

  return (
 feat-김성준2
<div className="bg-black min-h-screen px-[80px] py-[40px] text-white relative">
      {/* 상단 제목 */}
      <h1 className="flex items-center text-white text-[62px] font-normal tracking-[-1.86px] flex justify-between items-center w-full pb-5 border-b border-white
    fontFamily">나의 판매 포토카드</h1>
    
      <p className="text-[24px] text-white-300 mb-[20px] mt-[32px]">
        유디님이 보유한 포토카드 <span className="text-[20px] text-gray-300">({filteredCards.length}장)</span>
      </p>
      
<div className="flex gap-4 mb-[28px] ">
  <Badge type="COMMON" count={20} />
  <Badge type="RARE" count={8} />
  <Badge type="SUPER RARE" count={3} />
  <Badge type="LEGENDARY" count={5} />
</div>
      <div className="flex justify-between items-center mt-5 w-full tracking-[-1.86px] flex justify-between items-center w-full pb-5 border-t border-gray-400 mt-[40px] pt-[20px]">

    <div className="bg-black min-h-screen px-[80px] relative">
      <SellerHeader onSellClick={handleSellButtonClick} />

      <div className="flex justify-between items-center mt-5 w-full">
 develop
        <div className="flex items-center">
          <div className="mr-[60px]">
            <SearchMolecule onSearch={(text) => setSearchText(text)} />
          </div>
 feat-김성준2


develop
          <div className="flex gap-[45px]">
            <Dropdown
              placeholder="등급"
              options={["COMMON", "RARE", "SUPER RARE", "LEGENDARY"]}
              onChange={(value) => setSelectedRarity(value)}
            />
            <Dropdown
              placeholder="장르"
              options={["풍경", "인물", "동물", "추상"]}
              onChange={(value) => setSelectedCategory(value)}
            />
feat-김성준2
             <Dropdown
              placeholder="판매방법"
              options={["판매", "교환"]}
              onChange={(value) => setSelectedStatus(value)}
            />
 develop
            <Dropdown
              placeholder="매진여부"
              options={["판매중", "매진"]}
              onChange={(value) => setSelectedStatus(value)}
            />
          </div>
        </div>

        <Dropdown
          placeholder="낮은 가격순"
          options={["낮은 가격순", "높은 가격순", "최신순"]}
          height="50px"
          width="123px"
          onChange={(value) => setSortOrder(value)}
          customStyles={{
            container: { border: "1px solid #FFF", padding: "12px" },
            optionList: { padding: "10px 24px" },
          }}
        />
      </div> 
      <div className="grid grid-cols-3 gap-x-[80px] gap-y-[80px] mt-[80px]">
        {displayedCards.length > 0 ? (
          displayedCards.map((card, index) => (
            <div
              key={index}
              ref={index === displayedCards.length - 1 ? lastCardRef : null}
              onClick={() => handleCardClick(index)}
              className="cursor-pointer"
            >
              <Card {...card} showRemainingAsFraction={true} />
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-300 text-[18px] mt-[100px]">
            조건에 맞는 포토카드가 없습니다.
          </div>
        )}
      </div>

      {/*
      // 로그인 모달 (나중에 사용할 예정)
      {isLoginModalOpen && (
        <Modal
          title={modalTitle}
          content={modalContent}
          buttonText="확인"
          onClose={() => setIsLoginModalOpen(false)}
          onButtonClick={() => setIsLoginModalOpen(false)}
        />
      )}
      */}
feat-김성준2


develop
      {/* 판매 모달 */}
      <SellPhotoModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        cards={cardDataServer}
        onCardSelect={(card) => setSelectedSellCard(card)}
      />

      {/* 카드 상세 판매 모달 */}
      {selectedSellCard && (
        <CardDetailSellModal
          isOpen={!!selectedSellCard}
          onClose={() => setSelectedSellCard(null)}
          card={selectedSellCard}
        />
      )}
    </div>
  );
};

export default SellerPage;