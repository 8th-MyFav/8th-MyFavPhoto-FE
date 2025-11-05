"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Modal from "@/components/molecules/modal";
import SellPhotoModal from "@/components/organisms/sellPhotoModal";
import CardDetailSellModal from "@/components/organisms/cardDetailSellModal";
import PointModal from "@/components/molecules/pointModal";
import { PATHNAME } from "@/constants";
import { useMarketList } from "@/api/marketListings";

const ITEMS_PER_PAGE = 6;
const POINT_MODAL_KEY = "lastPointModalTime";
const LAST_LOGIN_TOKEN_KEY = "lastLoginToken";

const MarketplacePage = () => {
  const router = useRouter();

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

  /** 카드 목록 + 페이지네이션 */
  const [displayedCards, setDisplayedCards] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(undefined);

  /** 포인트 모달 */
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);

  const observer = useRef();

  /* =====================
     ✅ 로그인 체크 및 포인트 모달 로직
  ====================== */
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

  /* =====================
     ✅ API 호출 (React Query)
  ====================== */
  const { data, isLoading, isFetching, refetch } = useMarketList({
    take: ITEMS_PER_PAGE,
    cursor: nextCursor,
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

  /* =====================
     ✅ 데이터 반영 (무한 스크롤 포함)
  ====================== */
  useEffect(() => {
    if (!data) return;

    const list = data.list || [];

    setDisplayedCards((prev) => {
      // nextCursor가 존재 → 다음 페이지 append
      if (nextCursor) {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = list.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      } else {
        // 첫 페이지
        return list;
      }
    });

    setHasMore(data.hasMore);
  }, [data]);

  /* =====================
     ✅ 필터/정렬 변경 시 초기화
  ====================== */
  useEffect(() => {
    setDisplayedCards([]);
    setNextCursor(undefined);
    setHasMore(true);
    refetch();
  }, [searchText, selectedRarity, selectedCategory, selectedStatus, sortOrder]);

  /* =====================
     ✅ 무한 스크롤 옵저버
  ====================== */
  const lastCardRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && data?.nextCursor) {
          setNextCursor(data.nextCursor);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, isFetching, data?.nextCursor]
  );

  /* =====================
     ✅ 카드 데이터 변환 (Card용)
  ====================== */
  const mappedCards = displayedCards.map((card) => ({
    id: card.id,
    topImage: card.image_url || "/images/sample.svg",
    title: card.name || "제목 없음",
    rarityIcon: card.grade || "COMMON",
    category: card.genre || "기타",
    author: card.nickname || "익명",
    price: card.price ?? 0,
    remaining: card.available ?? 0,
    total: card.total ?? 0,
    favoriteImg: "/images/favorite.svg",
  }));

  /* =====================
     ✅ 핸들러
  ====================== */
  const handleCardClick = (id) => router.push(PATHNAME.MARKET_DETAIL(id));
  const handleSellButtonClick = () => setIsSellModalOpen(true);
  const handleLogin = () => router.push(PATHNAME.LOGIN);

  /* =====================
     ✅ 렌더링
  ====================== */
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
          {/* 상단 헤더 */}
          <PagesHeader buttonOnClick={handleSellButtonClick} />

          {/* 검색/필터/카드 목록 */}
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
            cards={mappedCards} // ✅ 변환된 카드 데이터 사용
            onCardClick={handleCardClick}
            lastCardRef={lastCardRef}
            isLoading={isLoading}
          />

          {/* 로딩 표시 */}
          {isFetching && hasMore && (
            <div className="text-white text-center py-4">더 불러오는 중...</div>
          )}

          {/* 판매 등록 모달 */}
          <SellPhotoModal
            isOpen={isSellModalOpen}
            onClose={() => setIsSellModalOpen(false)}
            cards={displayedCards}
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

          {/* 포인트 모달 */}
          {isPointModalOpen && (
            <PointModal onClose={() => setIsPointModalOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
