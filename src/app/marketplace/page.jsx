"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Modal from "@/components/molecules/Modal";
import SellPhotoModal from "@/components/organisms/SellPhotoModal";
import CardDetailSellModal from "@/components/organisms/CardDetailSellModal";
import PointModal from "@/components/molecules/PointModal";
import { PATHNAME } from "@/constants";
import { useMarketList } from "@/api/marketListings";

const POINT_MODAL_KEY = "lastPointModalTime";
const LAST_LOGIN_TOKEN_KEY = "lastLoginToken";

export default function MarketplacePage() {
  const router = useRouter();
  const pathname = usePathname();

  /** 로그인 관련 상태 */
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  /** 판매 관련 모달 */
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedSellCard, setSelectedSellCard] = useState(null);

  /** 필터/정렬/검색 상태 */
  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("price_asc");

  /** 카드 목록 */
  const [cards, setCards] = useState([]);

  /** 포인트 모달 */
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);

  /* ✅ 로그인 및 포인트 모달 로직 */
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      setIsLoggedIn(true);

      const lastLoginToken = localStorage.getItem(LAST_LOGIN_TOKEN_KEY);
      if (lastLoginToken !== token) {
        localStorage.removeItem(POINT_MODAL_KEY);
        localStorage.setItem(LAST_LOGIN_TOKEN_KEY, token);
      }

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

  /* ✅ API 호출 (전체 데이터 불러오기) */
  const { data, isLoading, refetch, error } = useMarketList({
    take: 9999,
    cursor: undefined,
    grade: selectedRarity || undefined,
    genre: selectedCategory || undefined,
    isSoldOut:
      selectedStatus === "매진"
        ? "true"
        : selectedStatus === "판매중"
        ? "false"
        : undefined,
    orderBy: sortOrder,
    keyword: searchText || undefined,
  });

  /* ✅ 데이터 반영 */
  useEffect(() => {
    if (data?.list) {
      setCards(data.list);
    }
  }, [data]);

  /* ✅ 필터나 검색 변경 시 다시 불러오기 */
  useEffect(() => {
    refetch();
  }, [searchText, selectedRarity, selectedCategory, selectedStatus, sortOrder, refetch]);

  /* ✅ 페이지 이동 시 리셋 */
  useEffect(() => {
    if (pathname === PATHNAME.MARKET) {
      refetch();
    }
  }, [pathname, refetch]);

  /* ✅ 카드 매핑 */
  const mappedCards = cards.map((card) => ({
    id: card.id, // ✅ 중요: 실제 id 사용
    topImage: card.image_url || "/images/sample.svg",
    title: card.name || "제목 없음",
    rarityIcon: card.grade || "COMMON",
    category: card.genre || "기타",
    author:
      card.creator?.nickname ||
      card.nickname ||
      card.creator_name ||
      "익명",
    price: card.price ?? 0,
    remaining: card.available ?? 0,
    total: card.total ?? 0,
    favoriteImg: "/images/favorite.svg",
  }));

  /* ✅ 핸들러 */
  const handleCardClick = (id) => {
    // console.log("✅ 클릭된 카드 id:", id);
    router.push(PATHNAME.MARKET_DETAIL(id));
  };
  const handleSellButtonClick = () => setIsSellModalOpen(true);
  const handleLogin = () => router.push(PATHNAME.LOGIN);
  const handleRetry = () => refetch();

  /* ✅ 렌더링 */
  return (
    <div className="bg-black">
      {!isLoggedIn ? (
        isLoginModalOpen && (
          <Modal
            title={modalTitle}
            content={modalContent}
            buttonText="로그인하기"
            onClose={() => setIsLoginModalOpen(false)}
            onButtonClick={handleLogin}
          />
        )
      ) : (
        <div className="bg-black mx-x-desktop">
          {/* 헤더 */}
          <PagesHeader buttonOnClick={handleSellButtonClick} />

          {/* 에러 표시 */}
          {error && (
            <div
              className="mb-4 p-4 rounded"
              style={{
                backgroundColor: "rgba(255, 72, 61, 0.1)",
                border: "1px solid rgba(255, 72, 61, 0.3)",
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-red-400 text-sm">
                  {error.message || "카드를 불러오지 못했습니다."}
                </p>
                <button
                  onClick={handleRetry}
                  className="ml-4 px-4 py-2 rounded text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-main, #EFFF04)",
                    color: "var(--color-black)",
                  }}
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* 카드 검색/필터 영역 */}
          <CardSearchContainer
            searchText={searchText}
            selectedRarity={selectedRarity}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            sortOrder={sortOrder}
            onSearchChange={setSearchText}
            onRarityChange={setSelectedRarity}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onSortOrderChange={setSortOrder}
            cards={mappedCards}
            onCardClick={(card) => handleCardClick(card.id)} // ✅ 수정: id 전달
            isLoading={isLoading}
          />

          {isLoading && (
            <div className="text-white text-center py-4">불러오는 중...</div>
          )}

          {/* 판매 관련 모달 */}
          <SellPhotoModal
            isOpen={isSellModalOpen}
            onClose={() => setIsSellModalOpen(false)}
            onCardSelect={(card) => setSelectedSellCard(card)}
          />
          {selectedSellCard && (
            <CardDetailSellModal
              isOpen={!!selectedSellCard}
              onClose={() => setSelectedSellCard(null)}
              card={selectedSellCard}
            />
          )}

          {/* 포인트 모달 */}
          {isPointModalOpen && (
            <PointModal onClose={() => setIsPointModalOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}
