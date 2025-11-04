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
    throw new Error(`카드 목록 조회 실패 (${res.status})`);
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
        setError(e.message);
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

  // 에러 상태
  if (error) {
    return (
      <div className="bg-black text-white p-4">
        <p>오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-black">
      <div className="bg-black mx-x-desktop">
        <PagesHeader
          showPhotoCardSummary={true}
          ownerName={user?.nickname || ""}
          totalCount={totalCount}
          gradeCounts={gradeCounts}
        />

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
      </div>
    </div>
  );
}
