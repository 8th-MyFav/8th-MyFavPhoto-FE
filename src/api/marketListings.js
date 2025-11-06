import { useQuery, useMutation } from "@tanstack/react-query";
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
  });
};

/* 🧾 판매 상세 조회 */
export const useMarketListingDetail = (listingId) => {
  return useQuery({
    queryKey: ["marketDetail", listingId],
    queryFn: async () => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${listingId}`, {
          auth: true, // ✅ 토큰 포함 (추가됨)
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
          auth: true, // ✅ 토큰 포함
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

/* 🆕 판매 등록 */
export const useMarketCreateListing = () => {
  return useMutation({
    mutationFn: async (data) => {
      try {
        return await apiClient(MARKET_ENDPOINTS.LISTINGS, {
          method: "POST",
          data,
          auth: true, // ✅ 토큰 포함
        });
      } catch {
        throw new Error(ERROR_MESSAGES.CREATE_FAIL);
      }
    },
  });
};

/* ✏️ 판매 수정 */
export const useMarketUpdateListing = () => {
  return useMutation({
    mutationFn: async ({ listingId, data }) => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${listingId}`, {
          method: "PATCH",
          data,
          auth: true, // ✅ 토큰 포함
        });
      } catch {
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
          auth: true, // ✅ 토큰 포함
        });
      } catch {
        throw new Error(ERROR_MESSAGES.DELETE_FAIL);
      }
    },
  });
};
