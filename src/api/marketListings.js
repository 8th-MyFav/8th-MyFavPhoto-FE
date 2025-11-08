import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { MARKET_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

/* 🛒 판매 리스트 (페이지네이션 + 필터링) */
export const useMarketList = ({
  take = 15,
  cursor,
  grade,
  genre,
  isSoldOut,
  orderBy,
  keyword,
} = {}) => {
  return useQuery({
    queryKey: [
      "marketList",
      take,
      cursor,
      grade,
      genre,
      isSoldOut,
      orderBy,
      keyword,
    ],
    queryFn: async () => {
      try {
        const response = await apiClient(MARKET_ENDPOINTS.LISTINGS, {
          data: { take, cursor, grade, genre, isSoldOut, orderBy, keyword },
          auth: true, // ✅ 토큰 포함
        });

        return {
          list: response.lists || [],
          nextCursor: response.nextCursor,
          hasMore: response.hasMore,
        };
      } catch {
        throw new Error(ERROR_MESSAGES.LIST_FAIL);
      }
    },
    placeholderData: keepPreviousData,
  });
};

/* 🧾 판매 상세 조회 */
export const useMarketListingDetail = (listingId) => {
  return useQuery({
    queryKey: ["marketDetail", listingId],
    queryFn: async () => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${listingId}`, {
          auth: true, // ✅ 토큰 포함
        });
      } catch {
        throw new Error(ERROR_MESSAGES.DETAIL_FAIL);
      }
    },
    enabled: !!listingId,
  });
};

/* 👤 내 판매 목록 */
export const useMarketMyListings = ({
  take = 15,
  cursor,
  orderBy,
  grade,
  genre,
  keyword,
  isSoldOut,
} = {}) => {
  return useQuery({
    queryKey: [
      "marketMyListings",
      take,
      cursor,
      orderBy,
      grade,
      genre,
      keyword,
      isSoldOut,
    ],
    queryFn: async () => {
      try {
        const response = await apiClient(MARKET_ENDPOINTS.MY_LISTINGS, {
          auth: true,
          data: { take, cursor, orderBy, grade, genre, keyword, isSoldOut },
        });

        return {
          list: response.lists || [],
          nextCursor: response.nextCursor,
          hasMore: response.hasMore,
        };
      } catch {
        throw new Error(ERROR_MESSAGES.MY_LIST_FAIL);
      }
    },
  });
};

// 👤 내 판매 내역 (필터 + 페이지네이션)
export const useMySaleList = ({
  page = 1,
  pageSize = 15,
  grade,
  genre,
  keyword,
  saleType,
  isSoldOut,
} = {}) => {
  let normalizedSaleType;
  if (saleType) {
    const s = String(saleType).toUpperCase();
    if (s === "판매".toUpperCase() || s === "SELL") normalizedSaleType = "SELL";
    else if (s === "교환".toUpperCase() || s === "TRADE")
      normalizedSaleType = "TRADE";
    else normalizedSaleType = s;
  }

  const queryObj = {
    page,
    pageSize,
    ...(grade ? { grade } : {}),
    ...(genre ? { genre } : {}),
    ...(keyword ? { keyword } : {}),
    ...(typeof isSoldOut !== "undefined" ? { isSoldOut } : {}),
    ...(normalizedSaleType ? { saleType: normalizedSaleType } : {}),
  };

  const queryString = new URLSearchParams(
    Object.entries(queryObj).map(([k, v]) => [k, String(v)])
  ).toString();

  const url = `${MARKET_ENDPOINTS.MY_SALES}${
    queryString ? `?${queryString}` : ""
  }`;

  console.log("📡 [useMySaleList] GET", url);

  return useQuery({
    queryKey: [
      "mySaleList",
      page,
      pageSize,
      grade,
      genre,
      keyword,
      normalizedSaleType,
      isSoldOut,
    ],
    queryFn: async () => {
      try {
        const response = await apiClient(url, {
          method: "GET",
          auth: true,
        });

        console.log("✅ [useMySaleList] response:", response);

        return {
          totalCount: response.totalCount ?? response.total_count ?? 0,
          totalGrades: response.totalGrades ?? response.total_grades ?? {},
          page: response.page ?? page,
          pageSize: response.pageSize ?? pageSize,
          totalPages:
            response.totalPages ??
            Math.ceil(
              (response.totalCount ?? response.total_count ?? 0) / pageSize
            ),
          list: response.list || response.lists || [],
        };
      } catch (err) {
        console.error("❌ [useMySaleList] error:", err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    placeholderData: keepPreviousData,
  });
};

/* 🆕 판매 등록 */
export const useMarketCreateListing = () => {
  return useMutation({
    mutationFn: async (data) => {
      try {
        return await apiClient(MARKET_ENDPOINTS.LISTINGS, {
          method: "POST",
          data,
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.CREATE_FAIL);
      }
    },
  });
};

/* ✏️ 판매 수정 (명세서 기반 PATCH 적용) */
export const useMarketUpdateListing = () => {
  return useMutation({
    mutationFn: async ({ cardId, data }) => {
      try {
        const res = await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${cardId}`, {
          method: "PATCH",
          data,
          auth: true,
        });
        console.log("✅ [PATCH 성공]", res);
        return res;
      } catch (err) {
        console.error("❌ [PATCH 실패]", err);
        throw new Error(ERROR_MESSAGES.UPDATE_FAIL);
      }
    },
  });
};

/* ❌ 판매 삭제 */
export const useMarketDeleteListing = () => {
  return useMutation({
    mutationFn: async (listingId) => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${listingId}`, {
          method: "DELETE",
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.DELETE_FAIL);
      }
    },
  });
};
