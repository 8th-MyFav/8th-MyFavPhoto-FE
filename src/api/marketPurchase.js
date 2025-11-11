// src/api/marketPurchase.js
import { useMutation } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { MARKET_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

/**
 * 포토카드 구매 훅
 * - 명세서 기준: body로 tradePostId, count 전달
 * - 로그인 필요 (auth: true)
 */
export const useMarketPurchase = () =>
  useMutation({
    mutationFn: async ({ tradePostId, count }) => {
      try {
        return await apiClient(MARKET_ENDPOINTS.PURCHASE, {
          method: "POST",
          data: { tradePostId, count }, // 명세서와 동일
          auth: true,
        });
      } catch (err) {
        // 서버 응답에서 errorCode 확인 후 세부 처리
        const errorCode = err?.response?.data?.errorCode;

        switch (errorCode) {
          case "INSUFFICIENT_POINTS":
            throw new Error("포인트가 부족합니다.");
          case "CANNOT_BUY_OWN_CARD":
            throw new Error("자신이 등록한 카드는 구매할 수 없습니다.");
          case "ALREADY_SOLD":
            throw new Error("이미 판매 완료된 카드입니다.");
          default:
            throw new Error(ERROR_MESSAGES.PURCHASE_FAIL);
        }
      }
    },
  });
