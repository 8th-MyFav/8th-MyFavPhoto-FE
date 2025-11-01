"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MyGalleryHeader from "@/components/molecules/myGalleryHeader";
import Card from "@/components/organisms/card";
import SearchMolecule from "@/components/molecules/search";
import Dropdown from "@/components/molecules/dropDown";
import Pagination from "@/components/molecules/pagination";
import Modal from "@/components/molecules/modal";
import { PATHNAME } from "@/constants";

// sample-auth-needed
// 이 페이지는 무조건 로그인이 돼야만 들어올 수 있는 페이지
// 이 페이지를 가이드
export default function MyGalleryPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [ownedItems, setOwnedItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedRarity, setSelectedRarity] = useState(""); // COMMON | RARE | SUPER RARE | LEGENDARY (UI)
  const [selectedCategory, setSelectedCategory] = useState(""); // KPOP | ACTOR | ESPORTS | KBO | ANIMATION
  const [sortOrder, setSortOrder] = useState("낮은 가격순");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [gradeCounts, setGradeCounts] = useState({
    COMMON: 0,
    RARE: 0,
    SUPER_RARE: 0,
    LEGENDARY: 0,
  });

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
      const USE_STATIC = true; // 하드코딩 모드
      if (USE_STATIC) return;
      if (!isAuthenticated || loading) return;
      const controller = new AbortController();
      const token = localStorage.getItem("accessToken");
      async function fetchOwned() {
        try {
          const gradeParam = selectedRarity
            ? selectedRarity.replace("SUPER RARE", "SUPER_RARE").toUpperCase()
            : "";
          const genreParam = selectedCategory || "";
          const params = new URLSearchParams({
            page: String(page),
            pageSize: String(pageSize),
            grade: gradeParam,
            genre: genreParam,
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
          console.log("/cards/me data", data);

          // 명세 고정 매핑
          const total = Number(data.totalCount) || 0;
          const items = Array.isArray(data.list) ? data.list : [];
          const gradeObj = data.grade || {};
          const counts = {
            COMMON: Number(gradeObj.COMMON) || 0,
            RARE: Number(gradeObj.RARE) || 0,
            SUPER_RARE: Number(gradeObj.SUPER_RARE) || 0,
            LEGENDARY: Number(gradeObj.LEGENDARY) || 0,
          };

          setTotalCount(total);
          setGradeCounts(counts);
          setOwnedItems(items);
        } catch (e) {
          // ignore abort (navigation/unmount)
          console.error("/cards/me fetch failed", e);
        }
      }

      const t = setTimeout(fetchOwned, 300); // 디바운싱
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

  console.log("isAuthenticated", isAuthenticated);
  console.log("loading", loading);

  // 초기에는 필터를 적용하지 않고 전체 노출. 사용자가 값 입력/선택 시에만 필터 적용
  const hasAnyFilter =
    (searchText && searchText.trim().length > 0) ||
    (selectedRarity && selectedRarity.length > 0) ||
    (selectedCategory && selectedCategory.length > 0);

  // 필터 변경 시 페이지 1로 초기화 (HOOKS는 early return 전에 선언)
  useEffect(() => {
    if (hasAnyFilter) {
      setPage(1);
    }
  }, [hasAnyFilter]);

  if (loading) {
    // 아직 로그인 여부가 판단이 안된 상태
    return <div>로딩중...</div>;
  }

  // 하드코딩 데이터 (마이갤러리)
  const USE_STATIC = true;
  const staticItems = USE_STATIC
    ? Array.from({ length: 30 }, (_, i) => {
        const grades = ["COMMON", "RARE", "SUPER_RARE", "LEGENDARY"];
        const genres = ["KPOP", "ACTOR", "ESPORTS", "KBO", "ANIMATION"];
        return {
          id: i + 1,
          name: `나의 포토카드 ${i + 1}`,
          grade: grades[i % grades.length],
          genre: genres[i % genres.length],
          price: 5 + i,
          total_count: 5 - (i % 3),
          count: 1 + (i % 2),
          image_url: "/images/sample.svg",
        };
      })
    : [];

  const sourceItems = USE_STATIC ? staticItems : ownedItems;

  // 헤더 집계 (총합/등급)
  const headerCounts = sourceItems.reduce(
    (acc, it) => {
      const g = String(it.grade).toUpperCase();
      const key = g === "SUPER_RARE" ? "SUPER_RARE" : g;
      if (acc[key] !== undefined) acc[key] += 1;
      return acc;
    },
    { COMMON: 0, RARE: 0, SUPER_RARE: 0, LEGENDARY: 0 }
  );
  const headerTotal = sourceItems.length;

  // 카드 컴포넌트용으로 정규화 및 필터링
  const normalized = sourceItems.map((item) => {
    const rarity = String(item.grade || "").toUpperCase();
    return {
      topImage:
        item.image_url ||
        item.imageUrl ||
        item.topImage ||
        "/images/sample.svg",
      title: item.name || item.title || item.cardName || "포토카드",
      rarityIcon: rarity === "SUPER_RARE" ? "SUPER RARE" : rarity,
      category: item.genre || item.category || "",
      author: user?.nickname || "",
      price: typeof item.price === "number" ? item.price : 0,
      remaining:
        typeof item.count === "number"
          ? item.count
          : typeof item.remaining === "number"
          ? item.remaining
          : 0,
      total:
        typeof item.total_count === "number"
          ? item.total_count
          : typeof item.total === "number"
          ? item.total
          : 0,
      favoriteImg: "/images/favorite.svg",
    };
  });

  const filtered = normalized
    .filter((card) => {
      const matchesSearch =
        card.title.toLowerCase().includes(searchText.toLowerCase()) ||
        card.author.toLowerCase().includes(searchText.toLowerCase());
      const matchesRarity = selectedRarity
        ? card.rarityIcon.toUpperCase() === selectedRarity.toUpperCase()
        : true;
      const matchesCategory = selectedCategory
        ? card.category === selectedCategory
        : true;
      return matchesSearch && matchesRarity && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === "낮은 가격순") return a.price - b.price;
      if (sortOrder === "높은 가격순") return b.price - a.price;
      if (sortOrder === "최신순") return b.title.localeCompare(a.title);
      return 0;
    });

  const viewCards = hasAnyFilter ? filtered : normalized;

  // 페이지별 슬라이싱 (한 페이지 15개)
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageCards = viewCards.slice(startIndex, endIndex);

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
          <div className="">
            <MyGalleryHeader
              ownerName={user?.nickname || ""}
              totalCount={headerTotal}
              gradeCounts={headerCounts}
              onGradeClick={(g) => {
                setSelectedRarity(g);
                setPage(1);
              }}
            />
          </div>
          {/* 검색/필터 */}
          <div className="flex items-center mt-[20px]">
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
                options={["KPOP", "ACTOR", "ESPORTS", "KBO", "ANIMATION"]}
                onChange={(value) => setSelectedCategory(value)}
              />
            </div>
          </div>

          {/* 카드 리스트 */}
          <div className="grid grid-cols-3 gap-x-[80px] gap-y-[80px] mt-[40px]">
            {pageCards.length > 0 ? (
              pageCards.map((card, idx) => (
                <Card key={idx} {...card} showRemainingAsFraction={true} />
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-300 text-noto-xs mt-[100px]">
                보유한 카드가 없습니다.
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          <div className="flex justify-center items-center gap-4 mt-[24px]">
            <Pagination
              page={page}
              pageSize={pageSize}
              totalCount={headerTotal}
              onChange={(next) => setPage(next)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
