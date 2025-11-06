import { ERROR_MESSAGES } from "./constants";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { useMutation } from "@tanstack/react-query";
import { CARDS_ENDPOINTS } from "./apiEndpoints";

/**
 * 포토카드 생성 API
 * POST /cards
 * @param {Object} cardData
 * @param {string} cardData.name - 카드 이름
 * @param {string} cardData.grade - 등급 (COMMON, RARE, SUPER_RARE, LEGENDARY)
 * @param {string} cardData.genre - 장르 (KPOP, ACTOR, ESPORTS, KBO, ANIMATION)
 * @param {number} cardData.price - 판매 가격
 * @param {number} cardData.total_issued - 발행 수량
 * @param {string} cardData.description - 카드 설명
 * @param {string} cardData.image_url - 카드 이미지 URL
 */
export const useCreateCard = () => {
  return useMutation({
    mutationFn: async (cardData) => {
      try {
        // POST 요청 보내기
        const response = await apiClient(CARDS_ENDPOINTS.CARDS, {
          method: "POST",
          auth: true, // 토큰 자동 포함
          data: cardData,
        });

        return response;
      } catch (error) {
        console.error("❌ 카드 생성 실패:", error);
        throw new Error(
          ERROR_MESSAGES.CARD_CREATE_FAIL || "카드 생성에 실패했습니다."
        );
      }
    },
  });
};
