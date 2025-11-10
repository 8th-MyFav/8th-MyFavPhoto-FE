"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Modal from "@/components/molecules/Modal";
import SellPhotoModal from "@/components/organisms/SellPhotoModal";
import CardDetailSellModal from "@/components/organisms/CardDetailSellModal";
import PointModal from "@/components/molecules/PointModal";
import LoadingOverlay from "@/components/molecules/LoadingOverlay";
import { PATHNAME, GENRE } from "@/constants";
import { useInfiniteMarketList } from "@/api/marketListings";
import { useAuth } from "@/contexts/AuthContext"; 

const CATEGORY_OPTIONS = Object.values(GENRE);

const SORT_ORDER_MAP = {
  "낮은 가격순": "price_asc",
  "높은 가격순": "price_desc",
  최신순: "created_desc",
};

export default function MarketplacePage() {
  const router = useRouter();
  const loadMoreRef = useRef(null);
  const { user, isAuthenticated, loading } = useAuth(); 

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedSellCard, setSelectedSellCard] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("price_asc");
  const [isPointModalOpen, setIsPointModalOpen] = useState(false);

  // ✅ 로그인 상태 확인
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setModalTitle("로그인이 필요합니다");
      setModalContent("마켓플레이스를 이용하시려면 로그인 해주세요.");
      setIsLoginModalOpen(true);
    }
  }, [isAuthenticated, loading]);

  // ✅ 무한 스크롤 데이터
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteMarketList({
    take: 5,
    grade: selectedRarity || undefined,
    genre: selectedCategory || undefined,
    isSoldOut:
      selectedStatus === "매진"
        ? "true"
        : selectedStatus === "판매중"
        ? "false"
        : undefined,
    orderBy: sortOrder || undefined,
    keyword: debouncedSearchText || undefined,
  });

  // 검색어 디바운스
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  // 무한 스크롤 트리거
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 모든 카드 데이터 합치기
  const cards = data?.pages?.flatMap((page) => page.list) || [];

  const mappedCards = cards.map((card) => ({
    id: card.id,
    topImage: card.image_url || "/images/sample.svg",
    title: card.name || "제목 없음",
    rarityIcon: card.grade || "COMMON",
    category: card.genre || "기타",
    author:
      card.creator?.nickname || card.nickname || card.creator_name || "익명",
    price: card.price ?? 0,
    remaining: card.available ?? 0,
    total: card.total ?? 0,
    favoriteImg: "/images/favorite.svg",
  }));

  // 카드 클릭 시 내 카드면 seller/[id], 아니면 detail/[id]
  // ✅ 판매 완료(remaining === 0) 카드 클릭 방지
  const handleCardClick = (card) => {
    if (card.remaining === 0) return; // 판매 완료면 클릭 무시

    const authorNickname = card.author?.trim();
    const currentNickname = user?.nickname?.trim();

    if (authorNickname && currentNickname && authorNickname === currentNickname) {
      router.push(PATHNAME.MPSELLER_DETAIL(card.id)); // 내 카드
    } else {
      router.push(PATHNAME.MARKET_DETAIL(card.id)); // 남의 카드
    }
  };

  if (loading) {
    return <LoadingOverlay show={true} />;
  }

  return (
    <div className="bg-black">
      {!isAuthenticated ? (
        isLoginModalOpen && (
          <Modal
            title={modalTitle}
            content={modalContent}
            buttonText="로그인하기"
            onClose={() => setIsLoginModalOpen(false)}
            onButtonClick={() => router.push(PATHNAME.LOGIN)}
          />
        )
      ) : (
        <div className="bg-black mx-x-desktop">
          <PagesHeader buttonOnClick={() => setIsSellModalOpen(true)} />

          {error && (
            <div className="mb-4 p-4 rounded bg-red-500/10 border border-red-400/30 text-red-400 text-sm">
              {error.message || "카드를 불러오지 못했습니다."}
            </div>
          )}

          <CardSearchContainer
            searchText={searchText}
            selectedRarity={selectedRarity}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            sortOrder={sortOrder}
            categoryOptions={CATEGORY_OPTIONS}
            onSearchChange={setSearchText}
            onRarityChange={setSelectedRarity}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onSortOrderChange={(label) =>
              setSortOrder(SORT_ORDER_MAP[label] || "price_asc")
            }
            cards={mappedCards}
            onCardClick={handleCardClick} // 수정된 클릭 이벤트
            isLoading={isLoading}
          />

          <LoadingOverlay show={isLoading || isFetchingNextPage} />
          <div ref={loadMoreRef} style={{ height: "120px" }} />

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

          {isPointModalOpen && (
            <PointModal onClose={() => setIsPointModalOpen(false)} />
          )}
        </div>
      )}
    </div>
  );
}
