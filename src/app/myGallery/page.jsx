"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Pagination from "@/components/molecules/Pagination";
import { PATHNAME, GENRE } from "@/constants";
import { useMyCards } from "@/api/myGalleryAPI";

const PAGE_SIZE = 15;
const DEBOUNCE_DELAY = 500; // 디바운스 지연 시간 (500ms)
const GENRE_OPTIONS = [
  GENRE.KPOP,
  GENRE.ACTOR,
  GENRE.ESPORTS,
  GENRE.KBO,
  GENRE.ANIMATION,
];

export default function MyGalleryPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  // 상태 관리
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const debounceTimerRef = useRef(null);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push(PATHNAME.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  // 검색어 디바운싱 (타이핑 시)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText]);

  // 검색 제출 핸들러 (엔터/검색 버튼 클릭 시)
  const handleSearchSubmit = (value) => {
    // 디바운싱 타이머 취소 후 즉시 검색
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setDebouncedSearchText(value);
  };

  // 매진여부 필터 변환 (판매중 -> false, 매진 -> true)
  const isSoldOut = useMemo(() => {
    if (selectedStatus === "매진") return true;
    if (selectedStatus === "판매중") return false;
    return undefined;
  }, [selectedStatus]);

  // React Query를 사용한 포토카드 목록 조회
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useMyCards({
    page,
    pageSize: PAGE_SIZE,
    grade: selectedRarity,
    genre: selectedCategory,
    keyword: debouncedSearchText,
    isSoldOut,
  });

  // 에러 처리
  useEffect(() => {
    if (queryError) {
      const errorMessage =
        queryError?.message || "카드 목록을 불러오는데 실패했습니다.";

      // 401 에러 시 로그인 페이지로 리다이렉트
      if (errorMessage.includes("401") || errorMessage.includes("인증")) {
        router.push(PATHNAME.LOGIN);
        return;
      }

      setError(errorMessage);
    } else {
      setError(null);
    }
  }, [queryError, router]);

  // 데이터 추출
  const ownedItems = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const gradeCounts = data?.gradeCounts || {
    COMMON: 0,
    RARE: 0,
    SUPER_RARE: 0,
    LEGENDARY: 0,
  };

  // 디버깅: 페이지네이션 정보 확인
  useEffect(() => {
    console.log("🟡 Page State:", {
      currentPage: page,
      totalCount,
      itemsCount: ownedItems.length,
      items: ownedItems.map((item) => ({
        id: item.id,
        name: item.name,
      })),
    });
  }, [page, totalCount, ownedItems]);

  // 필터/검색 변경 시 페이지 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedRarity, selectedCategory, debouncedSearchText, selectedStatus]);

  // 재시도 핸들러
  const handleRetry = () => {
    setError(null);
    refetch();
  };

  // 카드 데이터 정규화
  const normalizedCards = useMemo(() => {
    return ownedItems.map((item) => {
      const grade = String(item.grade || "").toUpperCase();
      return {
        topImage: item.image_url || "/images/sample.svg",
        title: item.name || "포토카드",
        rarityIcon: grade === "SUPER_RARE" ? "SUPER RARE" : grade,
        category: item.genre || "",
        author: user?.nickname || "",
        price: item.price || 0,
        remaining: item.count || item.total_count || 0,
        total: item.total_count || 0,
        favoriteImg: "/images/favorite.svg",
        createdAt: item.createdAt,
      };
    });
  }, [ownedItems, user?.nickname]);

  // 정렬된 카드 목록
  const sortedCards = useMemo(() => {
    return [...normalizedCards].sort((a, b) => {
      if (sortOrder === "낮은 가격순") return a.price - b.price;
      if (sortOrder === "높은 가격순") return b.price - a.price;
      if (sortOrder === "최신순" && a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  }, [normalizedCards, sortOrder]);

  // 로딩 상태
  if (loading || isLoading) {
    return <div>불러오는 중</div>;
  }

  // 에러 상태 (에러가 있어도 이전 데이터가 있으면 표시)
  const hasData = ownedItems.length > 0;

  return (
    <div className="bg-black">
      <div className="bg-black mx-x-desktop">
        <PagesHeader
          showPhotoCardSummary={true}
          ownerName={user?.nickname || ""}
          totalCount={totalCount}
          gradeCounts={gradeCounts}
        />

        {/* 에러 메시지 표시 (데이터가 있을 때는 상단에 표시) */}
        {error && (
          <div
            className="mb-4 p-4 rounded"
            style={{
              backgroundColor: "rgba(255, 72, 61, 0.1)",
              border: "1px solid rgba(255, 72, 61, 0.3)",
            }}
          >
            <div className="flex items-center justify-between">
              <p className="text-red-400 text-sm">{error}</p>
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

        {/* 에러가 있고 데이터가 없을 때만 전체 에러 화면 표시 */}
        {error && !hasData ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 rounded font-medium"
              style={{
                backgroundColor: "var(--color-main, #EFFF04)",
                color: "var(--color-black)",
              }}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <CardSearchContainer
            searchText={searchText}
            selectedRarity={selectedRarity}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            sortOrder={sortOrder}
            showStatusFilter={true}
            showSortDropdown={false}
            categoryOptions={GENRE_OPTIONS}
            onSearchChange={setSearchText}
            onSearchSubmit={handleSearchSubmit}
            onRarityChange={setSelectedRarity}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
            onSortOrderChange={setSortOrder}
            cards={sortedCards.map((card) => ({
              ...card,
              showRemainingAsFraction: true,
            }))}
            cardGridClass="grid grid-cols-3 gap-x-xl gap-y-xl my-3xl"
            emptyMessage="보유한 카드가 없습니다."
            showPagination={true}
            paginationComponent={
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                totalCount={totalCount}
                onChange={setPage}
              />
            }
          />
        )}
      </div>
    </div>
  );
}
