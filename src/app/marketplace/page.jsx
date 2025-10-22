"use client";

import React, { useState, useEffect, useRef } from "react";
import MarketplaceHeader from "../components/molecules/marketplaceHeader";
import SearchMolecule from "../components/molecules/search";
import Dropdown from "../components/molecules/dropDown";
import Card from "../components/organisms/card";
import Modal from "../components/molecules/modal";
import GNB from "../components/organisms/gnb";

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

const MarketplacePage = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [displayedCards, setDisplayedCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const observer = useRef();

  // 초기 카드 세팅
  useEffect(() => {
    const clientCards = cardDataServer.map((c) => ({ ...c, remaining: c.remaining }));
    setDisplayedCards(clientCards.slice(0, 9));
  }, []);

  // 무한 스크롤
  const lastCardRef = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  };

  const loadMore = () => {
    const currentLength = displayedCards.length;
    const more = cardDataServer.slice(currentLength, currentLength + 9);
    setDisplayedCards((prev) => [...prev, ...more]);
    if (displayedCards.length + more.length >= cardDataServer.length)
      setHasMore(false);
  };

  // 필터링 + 정렬
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

  // 카드 클릭 시 모달
  const handleCardClick = (card) => {
    setModalTitle("로그인이 필요합니다");
    setModalContent(
      <>
        로그인 하시겠습니까?<br />
        다양한 서비스를 편리하게 이용할 수 있습니다.
      </>
    );
    setIsModalOpen(true);
  };

  // 판매 버튼 클릭 시 모달
  const handleSellButtonClick = () => {
    setModalTitle("로그인이 필요합니다");
    setModalContent(
      <>
        로그인 하시겠습니까?<br />
        다양한 서비스를 편리하게 이용할 수 있습니다.
      </>
    );
    setIsModalOpen(true);
  };

  return (
    <div className="bg-black min-h-screen px-[80px] relative">
      {/*GNB*/}
      <GNB />
      {/* 헤더 */}
      <MarketplaceHeader onSellClick={handleSellButtonClick} />

      {/* 필터 바 */}
      <div className="flex justify-between items-center mt-5 w-full">
        <div className="flex items-center">
          <div className="mr-[60px]">
            <SearchMolecule onSearch={(text) => setSearchText(text)} />
          </div>
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

      {/* 카드 리스트 */}
      <div className="grid grid-cols-3 gap-x-[80px] gap-y-[80px] mt-[80px]">
        {filteredCards.map((card, index) => (
          <div
            key={index}
            ref={index === filteredCards.length - 1 ? lastCardRef : null}
            onClick={() => handleCardClick(card)}
            className="cursor-pointer"
          >
            <Card {...card} />
          </div>
        ))}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <Modal
          title={modalTitle}
          content={modalContent}
          buttonText="확인"
          onClose={() => setIsModalOpen(false)}
          onButtonClick={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MarketplacePage;
