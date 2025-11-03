"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PagesHeader from "@/components/organisms/PagesHeader";
import CardSearchContainer from "@/components/organisms/CardSearchContainer";
import Pagination from "@/components/molecules/pagination";
import Modal from "@/components/molecules/modal";
import { PATHNAME, GENRE } from "@/constants";

// sample-auth-needed
// 이 페이지는 무조건 로그인이 돼야만 들어올 수 있는 페이지
// 이 페이지를 가이드
export default function MyGalleryPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [ownedItems, setOwnedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState(""); // COMMON | RARE | SUPER RARE | LEGENDARY (UI)
  const [selectedCategory, setSelectedCategory] = useState(""); // KPOP | ACTOR | ESPORTS | KBO | ANIMATION
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [page, setPage] = useState(1);
  const pageSize = 15; // 페이지당 아이템 수

  const [gradeCounts, setGradeCounts] = useState({
    COMMON: 0,
    RARE: 0,
    SUPER_RARE: 0,
    LEGENDARY: 0,
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(
    function () {
      // 로그인 여부를 판단함
      if (!isAuthenticated && !loading) {
        // 로딩이 끝났는데, 로그인도 안된 경우 모달 노출
        setLoginModalOpen(true);
      } else {
        // 로딩이 끝나지 않았거나, 로그인이 된 경우
      }
    },
    [isAuthenticated, loading]
  );

  // 내 포토카드 목록 조회 (페이지네이션/필터/검색)
  useEffect(
    function () {
      if (!isAuthenticated || loading) return;
      const controller = new AbortController();
      const token = localStorage.getItem("accessToken");

      async function fetchOwned() {
        try {
          const gradeParam = selectedRarity
            ? selectedRarity.replace("SUPER RARE", "SUPER_RARE").toUpperCase()
            : "";
          const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            grade: gradeParam,
            genre: selectedCategory || "",
            keyword: searchText,
          });

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/cards/me?${params.toString()}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              signal: controller.signal,
            }
          );

          if (!res.ok) {
            console.error("/cards/me error", res.status);
            return;
          }

          const data = await res.json();

          // API 응답 구조: { totalCount, gradeCounts, lists }
          const items = Array.isArray(data.lists) ? data.lists : [];
          const gradeCountsFromApi = data.gradeCounts || {};

          setOwnedItems(items);
          setTotalCount(Number(data.totalCount) || 0);
          setGradeCounts({
            COMMON: Number(gradeCountsFromApi.COMMON) || 0,
            RARE: Number(gradeCountsFromApi.RARE) || 0,
            SUPER_RARE: Number(gradeCountsFromApi.SUPER_RARE) || 0,
            LEGENDARY: Number(gradeCountsFromApi.LEGENDARY) || 0,
          });
        } catch (e) {
          if (e.name !== "AbortError") {
            console.error("/cards/me fetch failed", e);
          }
        }
      }

      const t = setTimeout(fetchOwned, 300);
      return () => {
        clearTimeout(t);
        controller.abort();
      };
    },
    [
      isAuthenticated,
      loading,
      page,
      pageSize,
      selectedRarity,
      selectedCategory,
      searchText,
    ]
  );

  // 필터/검색 변경 시 페이지 1로 초기화
  useEffect(() => {
    setPage(1);
  }, [selectedRarity, selectedCategory, searchText]);

  if (loading) {
    // 아직 로그인 여부가 판단이 안된 상태
    return <div>로딩중...</div>;
  }

  // 카드 컴포넌트용으로 정규화 (API 응답: { id, name, grade, genre, price, total_count, image_url, ... })
  const normalized = ownedItems.map((item) => {
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

  // 클라이언트 사이드 정렬
  const sorted = [...normalized].sort((a, b) => {
    if (sortOrder === "낮은 가격순") return a.price - b.price;
    if (sortOrder === "높은 가격순") return b.price - a.price;
    if (sortOrder === "최신순" && a.createdAt && b.createdAt) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const pageCards = sorted;

  return (
    <div className="bg-black">
      {loginModalOpen && (
        <Modal
          title="로그인이 필요합니다"
          content="로그인 후 이용해 주세요."
          buttonText="로그인하기"
          onClose={() => setLoginModalOpen(false)}
          onButtonClick={() => router.push(PATHNAME.LOGIN)}
        />
      )}
      <div className="bg-black">
        <div className="bg-black mx-x-desktop">
          <div>
            <PagesHeader
              showPhotoCardSummary={true}
              ownerName={user?.nickname || ""}
              totalCount={totalCount}
              gradeCounts={gradeCounts}
            />
          </div>
          <CardSearchContainer
            searchText={searchText}
            selectedRarity={selectedRarity}
            selectedCategory={selectedCategory}
            sortOrder={sortOrder}
            showStatusFilter={false}
            showSortDropdown={false}
            categoryOptions={[
              GENRE.KPOP,
              GENRE.ACTOR,
              GENRE.ESPORTS,
              GENRE.KBO,
              GENRE.ANIMATION,
            ]}
            onSearchChange={(text) => setSearchText(text)}
            onRarityChange={(value) => setSelectedRarity(value)}
            onCategoryChange={(value) => setSelectedCategory(value)}
            onSortOrderChange={(value) => setSortOrder(value)}
            cards={pageCards.map((card) => ({
              ...card,
              showRemainingAsFraction: true,
            }))}
            cardGridClass="grid grid-cols-3 gap-x-xl gap-y-xl my-3xl"
            emptyMessage="보유한 카드가 없습니다."
            showPagination={true}
            paginationComponent={
              <Pagination
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onChange={(next) => setPage(next)}
              />
            }
          />
        </div>
      </div>
    </div>
  );
}
