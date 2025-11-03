import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { MARKET_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

/* 포토카드 구매 (명세서: body로 cardId 전달) */
export const useMarketPurchase = () =>
  useMutation({
    mutationFn: async (cardId) => {
      try {
        return await apiClient(MARKET_ENDPOINTS.PURCHASE, {
          method: "POST",
          data: { cardId },
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.PURCHASE_FAIL);
      }
    },
  });
