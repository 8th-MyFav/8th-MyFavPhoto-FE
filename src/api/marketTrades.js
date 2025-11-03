import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { MARKET_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

/* 교환 요청 생성 */
export const useMarketTradeCreate = () =>
  useMutation({
    mutationFn: async ({ cardId, offeredCardId, content }) => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.TRADES}/${cardId}`, {
          method: "POST",
          data: { offeredCardId, content },
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.TRADE_CREATE_FAIL);
      }
    },
  });

/* 교환 제시 목록 조회 */
export const useMarketTradeList = (cardId) =>
  useQuery({
    queryKey: ["marketTradeList", cardId],
    queryFn: async () => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.TRADES}/${cardId}`, {
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.TRADE_LIST_FAIL);
      }
    },
    enabled: !!cardId,
  });

/* 교환 승인 */
export const useMarketTradeApprove = () =>
  useMutation({
    mutationFn: async (tradeId) => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.TRADES}/${tradeId}/approve`, {
          method: "PATCH",
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.TRADE_APPROVE_FAIL);
      }
    },
  });

/* 교환 거절 */
export const useMarketTradeReject = () =>
  useMutation({
    mutationFn: async (tradeId) => {
      try {
        return await apiClient(`${MARKET_ENDPOINTS.TRADES}/${tradeId}/reject`, {
          method: "PATCH",
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.TRADE_REJECT_FAIL);
      }
    },
  });
