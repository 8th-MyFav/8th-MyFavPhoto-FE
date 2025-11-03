import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { MARKET_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

/* 판매 리스트 (페이지네이션 + 필터링) */
export const useMarketList = ({
  take,
  cursor,
  grade,
  genre,
  isSoldOut,
  orderBy,
  keyword,
} = {}) =>
  useQuery({
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
        return await apiClient(MARKET_ENDPOINTS.LISTINGS, {
          data: { take, cursor, grade, genre, isSoldOut, orderBy, keyword },
        });
      } catch {
        throw new Error(ERROR_MESSAGES.LIST_FAIL);
      }
    },
  });

/* 판매 상세 조회 */
export const useMarketListingDetail = (listingId) =>
  useQuery({
    queryKey: ["marketDetail", listingId],
    queryFn: async () => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${listingId}`);
      } catch {
        throw new Error(ERROR_MESSAGES.DETAIL_FAIL);
      }
    },
    enabled: !!listingId,
  });

/* 내 판매 목록 (명세서 버전: take/cursor/orderBy) */
export const useMarketMyListings = ({
  take,
  cursor,
  orderBy,
  grade,
  genre,
  keyword,
  isSoldOut,
} = {}) =>
  useQuery({
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
        return await apiClient(MARKET_ENDPOINTS.MY_LISTINGS, {
          auth: true,
          data: { take, cursor, orderBy, grade, genre, keyword, isSoldOut },
        });
      } catch {
        throw new Error(ERROR_MESSAGES.MY_LIST_FAIL);
      }
    },
  });

/* 판매 등록 */
export const useMarketCreateListing = () =>
  useMutation({
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

/* 판매 수정 */
export const useMarketUpdateListing = () =>
  useMutation({
    mutationFn: async ({ listingId, data }) => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.LISTINGS}/${listingId}`, {
          method: "PATCH",
          data,
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.UPDATE_FAIL);
      }
    },
  });

/* 판매 삭제 */
export const useMarketDeleteListing = () =>
  useMutation({
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
