"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Pagination from "@/components/molecules/Pagination";
import { PATHNAME, GENRE } from "@/constants";
import { useMyCards } from "@/api/myGalleryAPI";
import LoadingOverlay from "@/components/molecules/LoadingOverlay";

const PAGE_SIZE = 18;
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
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push(PATHNAME.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  // 검색 제출 핸들러 (엔터/검색 버튼 클릭 시에만 검색)
  const handleSearchSubmit = (value) => {
    setDebouncedSearchText(value);
  };

  // React Query를 사용한 포토카드 목록 조회
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
    isFetching,
    isError,
  } = useMyCards({
    page,
    pageSize: PAGE_SIZE,
    grade: selectedRarity,
    genre: selectedCategory,
    keyword: debouncedSearchText,
  });

  // API 호출 상태 확인
  useEffect(() => {
    // API 상태 모니터링 (필요시 활성화)
  }, [isLoading, isFetching, isError, data, queryError]);

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

  // 디버깅: 페이지네이션 정보 확인 및 API 응답 필드 확인
  useEffect(() => {
    // 페이지네이션 및 API 응답 필드 모니터링 (필요시 활성화)
  }, [page, totalCount, ownedItems]);

  // 필터/검색 변경 시 페이지 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedRarity, selectedCategory, debouncedSearchText]);

  // 재시도 핸들러
  const handleRetry = () => {
    setError(null);
    refetch();
  };

  // 카드 데이터 정규화
  const normalizedCards = useMemo(() => {
    return ownedItems.map((item, index) => {
      // API 응답 구조: {id, creator_id, name, grade, genre, price, image_url, createdAt, updatedAt}
      const grade = String(item.grade || "").toUpperCase();

      // 다양한 필드명 가능성 체크 (name 필드)
      // 실제 API 응답: name 필드가 없을 수 있음
      const cardName =
        item.name ||
        item.title ||
        item.card_name ||
        item.cardName ||
        item.card?.name ||
        item.card?.title ||
        `${item.genre || ""} ${item.grade || ""} 카드`.trim() || // 장르 + 등급 조합
        "포토카드";

      // 디버깅: 각 카드의 모든 필드 확인 (필요시 활성화)

      // count는 보유 개수
      const totalCountValue =
        item.count !== undefined
          ? item.count
          : item.quantity !== undefined
          ? item.quantity
          : 0;

      // remaining은 보유 개수 (count 필드)
      const remainingCount = item.count !== undefined ? item.count : 0;

      // image_url이 null이거나 없을 때 sample.svg 또는 sample2.svg 사용
      const imageUrl =
        item.image_url && item.image_url !== null && item.image_url !== ""
          ? item.image_url
          : item.imageUrl && item.imageUrl !== null && item.imageUrl !== ""
          ? item.imageUrl
          : item.image && item.image !== null && item.image !== ""
          ? item.image
          : // 인덱스 기반으로 sample.svg와 sample2.svg 번갈아 사용
          index % 2 === 0
          ? "/images/sample.svg"
          : "/images/sample2.svg";

      return {
        // UI에서 사용하는 필드
        id: item.id,
        creator_id:
          item.creator_id !== undefined ? item.creator_id : item.creatorId, // API 원본 필드 보존
        topImage: imageUrl,
        title: cardName,
        rarityIcon: grade === "SUPER_RARE" ? "SUPER RARE" : grade,
        category: item.genre || "",
        author: user?.nickname || "",
        price: item.price || 0,
        remaining: remainingCount, // 보유 개수 (count)
        total: totalCountValue, // 총 발행 개수
        quantity: remainingCount, // 마이갤러리에서는 수량으로 표시
        favoriteImg: "/images/favorite.svg",
        createdAt: item.createdAt || item.created_at,
        updatedAt:
          item.updatedAt !== undefined ? item.updatedAt : item.updated_at, // API 원본 필드 보존

        // 원본 데이터 전체 보존 (필요시 사용 가능)
        _original: item,
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

  // 에러 상태 (에러가 있어도 이전 데이터가 있으면 표시)
  const hasData = ownedItems.length > 0;
  const isSearching = debouncedSearchText.trim().length > 0;
  const hasFilters = selectedRarity || selectedCategory;

  // 빈 메시지 결정 (stale-while-revalidate 패턴: 이전 데이터가 있으면 표시하지 않음)
  const getEmptyMessage = () => {
    // keepPreviousData로 인해 이전 데이터가 있으면 isLoading은 false, isFetching만 true
    // 따라서 hasData가 true면 백그라운드에서 데이터를 가져오는 중이어도 메시지 표시 안 함
    if (isLoading && !hasData) {
      // 초기 로딩 중이고 데이터가 없을 때만
      if (isSearching || hasFilters) {
        return; // 검색 중일 때
      }
      return; // 초기 로딩 중일 때
    }
    // isFetching && hasData인 경우는 백그라운드에서 업데이트 중이므로 메시지 표시 안 함
    if (isSearching || hasFilters) {
      return "검색 결과가 없습니다."; // 검색어나 필터가 있을 때
    }
    return "보유한 카드가 없습니다."; // 일반적인 경우
  };

  return (
    <div className="bg-black">
      <LoadingOverlay show={isFetching} />
      <div className="bg-black page-wrapper">
        <PagesHeader
          showPhotoCardSummary={true}
          ownerName={user?.nickname || ""}
          totalCount={totalCount}
          gradeCounts={gradeCounts}
        />

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
            sortOrder={sortOrder}
            showStatusFilter={false}
            showSortDropdown={false}
            categoryOptions={GENRE_OPTIONS}
            onSearchChange={setSearchText}
            onSearchSubmit={handleSearchSubmit}
            onRarityChange={setSelectedRarity}
            onCategoryChange={setSelectedCategory}
            onSortOrderChange={setSortOrder}
            cards={sortedCards.map((card) => ({
              ...card,
              showRemainingAsFraction: true,
            }))}
            cardGridClass="grid grid-cols-3 gap-x-xl gap-y-xl my-3xl cursor-default [&_div]:cursor-default"
            emptyMessage={getEmptyMessage()}
            showPagination={true}
            onCardClick={() => {}}
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
