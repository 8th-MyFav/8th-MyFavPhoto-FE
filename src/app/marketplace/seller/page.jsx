// 나의 판매 포토카드 페이지 (판매 중인 포토카드 페이지)
"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerHeader from "@/components/molecules/SellerHeader";
import SearchMolecule from "@/components/molecules/Search";
import Dropdown from "@/components/molecules/DropDown";
import Card from "@/components/organisms/SellerCard";
import SellPhotoModal from "@/components/organisms/SellPhotoModal";
import CardDetailSellModal from "@/components/organisms/CardDetailSellModal";
import Tag from "@/components/atoms/Tag";
import Badge from "@/components/atoms/Badge";

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
const POINT_MODAL_KEY = "lastPointModalTime"; // localStorage 키
const LAST_LOGIN_TOKEN_KEY = "lastLoginToken"; // 마지막 로그인 토큰 체크용

const SellerPage = () => {
  const router = useRouter();

  // 로그인 여부 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 모달 관련 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedSellCard, setSelectedSellCard] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [displayedCards, setDisplayedCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const [isPointModalOpen, setIsPointModalOpen] = useState(false);

  const observer = useRef();

  // ✅ 로그인 상태 확인 및 포인트 모달 처리
  useEffect(() => {
    const token = localStorage.getItem("accessToken"); // 실제 로그인 토큰 사용
    if (token) {
      setIsLoggedIn(true);

      // 시연용: 로그아웃 후 새 로그인 시 포인트 모달 초기화
      const lastLoginToken = localStorage.getItem(LAST_LOGIN_TOKEN_KEY);
      if (lastLoginToken !== token) {
        localStorage.removeItem(POINT_MODAL_KEY);
        localStorage.setItem(LAST_LOGIN_TOKEN_KEY, token);
      }

      // 포인트 모달 처리
      const lastTime = localStorage.getItem(POINT_MODAL_KEY);
      const now = Date.now();
      if (!lastTime || now - parseInt(lastTime, 10) >= 3600 * 1000) {
        setIsPointModalOpen(true);
        localStorage.setItem(POINT_MODAL_KEY, now.toString());
      }
    } else {
      setIsLoggedIn(false);
      setModalTitle("로그인이 필요합니다");
      setModalContent("마켓플레이스를 이용하시려면 로그인 해주세요.");
      setIsLoginModalOpen(true);
    }
  }, []);

  // 필터링 + 정렬 적용
  const filteredCards = cardDataServer
    .filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchText.toLowerCase()) ||
        card.author.toLowerCase().includes(searchText.toLowerCase());
      const matchesRarity = selectedRarity
        ? card.rarityIcon === selectedRarity
        : true;
      const matchesCategory = selectedCategory
        ? card.category === selectedCategory
        : true;
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

  // 무한 스크롤
  const lastCardRef = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) loadMore();
    });
    if (node) observer.current.observe(node);
  };

  // 추가 카드 로드
  const loadMore = () => {
    const currentLength = displayedCards.length;
    const more = filteredCards.slice(
      currentLength,
      currentLength + ITEMS_PER_PAGE
    );
    setDisplayedCards((prev) => [...prev, ...more]);
    if (currentLength + more.length >= filteredCards.length) setHasMore(false);
  };

  // 카드 클릭 시 상세 페이지 이동
  const handleCardClick = (index) => {
    router.push(`/marketplace/seller/${index}`);
  };

  const handleSellButtonClick = () => setIsSellModalOpen(true);

  return (
    <div className="bg-black min-h-screen px-[80px] py-[40px] text-white relative">
      {/* 상단 제목 */}
      <SellerHeader onSellClick={handleSellButtonClick} />

      {/* 보유 현황 */}
      <p className="text-[24px] text-white mb-[20px] mt-[32px]">
        유디님이 보유한 포토카드{" "}
        <span className="text-[20px] text-gray-300">
          ({filteredCards.length}장)
        </span>
      </p>

      {/* 등급별 뱃지 */}
      <div className="flex gap-4 mb-[28px]">
        <Badge type="COMMON" count={20} />
        <Badge type="RARE" count={8} />
        <Badge type="SUPER RARE" count={3} />
        <Badge type="LEGENDARY" count={5} />
      </div>

      {/* 필터 및 정렬 */}
      <div className="flex justify-between items-center mt-5 w-full border-t border-gray-400 pt-[20px]">
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
              placeholder="판매 상태"
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

      {/* 판매 등록 모달 */}
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
