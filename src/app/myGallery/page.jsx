"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Pagination from "@/components/molecules/Pagination";
import { PATHNAME, GENRE } from "@/constants";

const PAGE_SIZE = 15;
const GENRE_OPTIONS = [
  GENRE.KPOP,
  GENRE.ACTOR,
  GENRE.ESPORTS,
  GENRE.KBO,
  GENRE.ANIMATION,
];

/**
 * 내 포토카드 목록 조회 API
 */
const fetchMyCards = async ({
  page,
  pageSize,
  grade,
  genre,
  keyword,
  signal,
} = {}) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("인증 토큰이 없습니다.");
  }

  const gradeParam = grade
    ? grade.replace("SUPER RARE", "SUPER_RARE").toUpperCase()
    : "";

  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    grade: gradeParam,
    genre: genre || "",
    keyword: keyword || "",
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cards/me?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal,
    }
  );

  if (!res.ok) {
    // 상태 코드별 에러 메시지
    if (res.status === 401) {
      throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
    } else if (res.status === 403) {
      throw new Error("접근 권한이 없습니다.");
    } else if (res.status === 404) {
      throw new Error("요청한 페이지를 찾을 수 없습니다.");
    } else if (res.status >= 500) {
      throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } else {
      throw new Error(`카드 목록 조회 실패 (${res.status})`);
    }
  }

  const data = await res.json();
  return {
    items: Array.isArray(data.lists) ? data.lists : [],
    totalCount: Number(data.totalCount) || 0,
    gradeCounts: {
      COMMON: Number(data.gradeCounts?.COMMON) || 0,
      RARE: Number(data.gradeCounts?.RARE) || 0,
      SUPER_RARE: Number(data.gradeCounts?.SUPER_RARE) || 0,
      LEGENDARY: Number(data.gradeCounts?.LEGENDARY) || 0,
    },
  };
};

export default function MyGalleryPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  // 상태 관리
  const [ownedItems, setOwnedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [page, setPage] = useState(1);
  const [gradeCounts, setGradeCounts] = useState({
    COMMON: 0,
    RARE: 0,
    SUPER_RARE: 0,
    LEGENDARY: 0,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // 로그인 체크
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push(PATHNAME.LOGIN);
    }
  }, [isAuthenticated, loading, router]);

  // 포토카드 목록 조회
  useEffect(() => {
    if (!isAuthenticated || loading) return;

    const controller = new AbortController();

    const loadCards = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchMyCards({
          page,
          pageSize: PAGE_SIZE,
          grade: selectedRarity,
          genre: selectedCategory,
          keyword: searchText,
          signal: controller.signal,
        });

        setOwnedItems(result.items);
        setTotalCount(result.totalCount);
        setGradeCounts(result.gradeCounts);
      } catch (e) {
        if (e.name === "AbortError") {
          return; // 요청 취소는 무시
        }
        console.error("카드 목록 조회 실패:", e);

        // 에러 타입별 처리
        let errorMessage = "카드 목록을 불러오는데 실패했습니다.";

        if (e.message.includes("401") || e.message.includes("인증")) {
          // 인증 에러 시 로그인 페이지로 리다이렉트
          router.push(PATHNAME.LOGIN);
          return;
        } else if (e.message.includes("403")) {
          errorMessage = "접근 권한이 없습니다.";
        } else if (e.message.includes("404")) {
          errorMessage = "요청한 페이지를 찾을 수 없습니다.";
        } else if (e.message.includes("500") || e.message.includes("서버")) {
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (
          e.message.includes("네트워크") ||
          e.message.includes("fetch")
        ) {
          errorMessage = "네트워크 연결을 확인해주세요.";
        } else if (e.message) {
          errorMessage = e.message;
        }

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(loadCards, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    isAuthenticated,
    loading,
    page,
    selectedRarity,
    selectedCategory,
    searchText,
    retryCount, // 재시도 시 다시 실행
  ]);

  // 필터/검색 변경 시 페이지 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedRarity, selectedCategory, searchText]);

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
        remaining: item.total_count || 0,
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
    return <div>로딩중...</div>;
  }

  // 재시도 핸들러
  const handleRetry = () => {
    setError(null);
    setRetryCount((prev) => prev + 1);
    // useEffect가 다시 실행되도록 상태 변경
    setPage((prev) => prev);
  };

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
            sortOrder={sortOrder}
            showStatusFilter={false}
            showSortDropdown={false}
            categoryOptions={GENRE_OPTIONS}
            onSearchChange={setSearchText}
            onRarityChange={setSelectedRarity}
            onCategoryChange={setSelectedCategory}
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
