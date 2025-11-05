import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { MY_GALLERY_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

/**
 * 내 포토카드 목록 조회 API (보유한 카드)
 * GET /cards/me
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.page - 페이지 번호
 * @param {number} params.pageSize - 페이지 크기
 * @param {string} params.grade - 등급 필터 (COMMON, RARE, SUPER_RARE, LEGENDARY)
 * @param {string} params.genre - 장르 필터 (KPOP, ACTOR, ESPORTS, KBO, ANIMATION)
 * @param {string} params.keyword - 검색 키워드
 * @param {string} params.saleType - 판매방법 (SELL: 판매, TRADE: 교환) - 선택적
 * @param {boolean} params.isSoldOut - 매진여부 (true: 매진, false: 판매중) - 선택적
 */
export const useMyCards = ({
  page,
  pageSize,
  grade,
  genre,
  keyword,
  saleType,
  isSoldOut,
} = {}) => {
  return useQuery({
    queryKey: [
      "myCards",
      page,
      pageSize,
      grade,
      genre,
      keyword,
      saleType,
      isSoldOut,
    ],
    queryFn: async () => {
      try {
        // grade 파라미터 변환 (SUPER RARE -> SUPER_RARE)
        const gradeParam = grade
          ? grade.replace("SUPER RARE", "SUPER_RARE").toUpperCase()
          : undefined;

        const requestParams = {
          page,
          pageSize,
          grade: gradeParam,
          genre: genre || undefined,
          keyword: keyword || undefined,
          saleType: saleType || undefined,
          isSoldOut: isSoldOut !== undefined ? isSoldOut : undefined,
        };

        // 요청 파라미터 확인
        console.log("🔵 API Request - Page:", page, "Params:", requestParams);

        const data = await apiClient(MY_GALLERY_ENDPOINTS.MY_CARDS, {
          method: "GET",
          auth: true,
          data: requestParams,
        });

        // 응답 데이터 정규화
        // 백엔드 응답 구조 확인을 위한 로그
        console.log("🟢 API Response - Page:", page);
        console.log(
          "  - Response Type:",
          Array.isArray(data) ? "Array" : "Object"
        );
        console.log("  - Response Data:", data);
        console.log(
          "  - Items Count:",
          Array.isArray(data)
            ? data.length
            : data.lists?.length || data.items?.length || 0
        );
        console.log(
          "  - TotalCount:",
          data.totalCount || data.total || "NOT PROVIDED"
        );

        // 응답이 배열인 경우와 객체인 경우 모두 처리
        let items = [];
        let totalCount = 0;
        let gradeCounts = {};

        if (Array.isArray(data)) {
          // 응답이 배열인 경우
          items = data;
          // 배열인 경우 totalCount는 별도로 받아야 함 (현재는 응답에 없을 수 있음)
          totalCount = data.length; // 임시로 배열 길이 사용 (백엔드에서 totalCount를 별도로 제공해야 함)
        } else {
          // 응답이 객체인 경우
          items = data.lists || data.items || [];
          // totalCount는 백엔드에서 제공해야 함 (페이지네이션을 위해 필수)
          totalCount = data.totalCount || data.total || 0;
          gradeCounts = data.gradeCounts || {};
        }

        // gradeCounts가 없으면 현재 페이지의 items에서만 계산 (정확하지 않을 수 있음)
        if (
          !gradeCounts.COMMON &&
          !gradeCounts.RARE &&
          !gradeCounts.SUPER_RARE &&
          !gradeCounts.LEGENDARY
        ) {
          gradeCounts = {
            COMMON: items.filter((item) => item.grade === "COMMON").length,
            RARE: items.filter((item) => item.grade === "RARE").length,
            SUPER_RARE: items.filter((item) => item.grade === "SUPER_RARE")
              .length,
            LEGENDARY: items.filter((item) => item.grade === "LEGENDARY")
              .length,
          };
        }

        return {
          items,
          totalCount: Number(totalCount) || 0,
          gradeCounts: {
            COMMON: Number(gradeCounts.COMMON) || 0,
            RARE: Number(gradeCounts.RARE) || 0,
            SUPER_RARE: Number(gradeCounts.SUPER_RARE) || 0,
            LEGENDARY: Number(gradeCounts.LEGENDARY) || 0,
          },
        };
      } catch (error) {
        throw new Error(ERROR_MESSAGES.MY_CARDS_FAIL);
      }
    },
    enabled: page !== undefined && pageSize !== undefined,
    retry: 1, // 재시도 횟수
    retryDelay: 1000, // 재시도 지연 시간 (1초)
  });
};
