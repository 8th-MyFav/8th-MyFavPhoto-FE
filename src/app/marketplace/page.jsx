"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import SearchMolecule from "@/components/molecules/search";
import Dropdown from "@/components/molecules/dropDown";
import Card from "@/components/organisms/card";
import Modal from "@/components/molecules/modal";
import SellPhotoModal from "@/components/organisms/sellPhotoModal";
import CardDetailSellModal from "@/components/organisms/cardDetailSellModal";
import PointModal from "@/components/molecules/pointModal";
import { PATHNAME, GRADE } from "@/constants";
import { useMarketList } from "@/api/marketListings";

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

const MarketplacePage = () => {
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

  const [initialized, setInitialized] = useState(false);

  // ✅ 로그인 상태 확인 및 포인트 모달 처리
  useEffect(() => {

    if (!initialized) setInitialized(true);

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
  }, [initialized]);


  const { data, isLoading, isError } = useMarketList({
    take: 12,         // 한 번에 가져올 개수
    cursor: null,     // 다음 페이지 커서
    grade: selectedRarity || undefined,
    genre: selectedCategory || undefined,
    isSoldOut:
      selectedStatus === "판매중"
        ? false
        : selectedStatus === "매진"
        ? true
        : undefined,
    orderBy:
      sortOrder === "낮은 가격순"
        ? "PRICE_ASC"
        : sortOrder === "높은 가격순"
        ? "PRICE_DESC"
        : "CREATED_DESC",
    keyword: searchText || undefined,
  });

  const handleCardClick = (index) => {
    router.push(PATHNAME.MARKET_DETAIL(index));
  };

  const handleSellButtonClick = () => setIsSellModalOpen(true);

  const handleLogin = () => router.push(PATHNAME.LOGIN);

  return (
    <div className="bg-black">
      {!isLoggedIn ? (
        <>
          {isLoginModalOpen && (
            <Modal
              title={modalTitle}
              content={modalContent}
              buttonText="로그인하기"
              onClose={() => setIsLoginModalOpen(false)}
              onButtonClick={handleLogin}
            />
          )}
        </>
      ) : (
        <>
          <div className="bg-black mx-x-desktop">
            <div>
              <PagesHeader buttonOnClick={handleSellButtonClick} />
            </div>
            <div className="flex justify-between items-center mt-5 w-full">
              <div className="flex items-center">
                <div className="mr-[60px]">
                  <SearchMolecule onSearch={(text) => setSearchText(text)} />
                </div>
                <div className="flex gap-[45px]">
                  <Dropdown
                    placeholder="등급"
                    options={[
                      GRADE.COMMON,
                      GRADE.RARE,
                      GRADE.SUPER_RARE,
                      GRADE.LEGENDARY,
                    ]}
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
                width="180px"
                onChange={(value) => setSortOrder(value)}
                customStyles={{
                  container: { border: "1px solid #FFF", padding: "12px" },
                  optionList: { padding: "10px 20px" },
                }}
              />
            </div>

            <div className="grid grid-cols-3 gap-x-[80px] gap-y-[80px] mt-[80px]">
              {displayedCards.length > 0 ? (
                displayedCards.map((card, index) => (
                  <div
                    key={index}
                    ref={
                      index === displayedCards.length - 1 ? lastCardRef : null
                    }
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

            <SellPhotoModal
              isOpen={isSellModalOpen}
              onClose={() => setIsSellModalOpen(false)}
              cards={cardDataServer}
              onCardSelect={(card) => setSelectedSellCard(card)}
            />

            {selectedSellCard && (
              <CardDetailSellModal
                isOpen={!!selectedSellCard}
                onClose={() => setSelectedSellCard(null)}
                card={selectedSellCard}
              />
            )}

            {/* ✅ 포인트 모달 */}
            {isPointModalOpen && (
              <PointModal onClose={() => setIsPointModalOpen(false)} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
