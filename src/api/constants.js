export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const TOKEN_KEY = "accessToken";

export const ERROR_MESSAGES = {
  // 판매 관련
  LIST_FAIL: "판매 리스트 조회 실패",
  DETAIL_FAIL: "판매 상세 조회 실패",
  MY_LIST_FAIL: "내 판매 목록 조회 실패",
  CREATE_FAIL: "판매 등록 실패",
  UPDATE_FAIL: "판매 수정 실패",
  DELETE_FAIL: "판매 삭제 실패",

  // 교환 관련
  TRADE_CREATE_FAIL: "교환 요청 실패",
  TRADE_LIST_FAIL: "교환 목록 조회 실패",
  TRADE_APPROVE_FAIL: "교환 수락 실패",
  TRADE_REJECT_FAIL: "교환 거절 실패",

  // 구매 관련
  PURCHASE_FAIL: "구매 실패",
};
