// 경로 상수
export const PATHNAME = {
  LOGIN: "/login",
  JOIN: "/join",
  MARKET: "/marketplace",
  MYGAL: "/myGallery",
  HOME: "/",
  CREATE: "/myGallery/create",
  MPSELLER: "/marketplace/seller",

  MPSELLER_DETAIL: (id) => `/marketplace/seller/${id}`,
  MARKET_DETAIL: (id) => `/marketplace/detail/${id}`,
  MARKET_DETAIL_SUCCESS: (id) => `/marketplace/detail/${id}/success`,
  MARKET_DETAIL_FAIL: (id) => `/marketplace/detail/${id}/fail`,

  SELL_SUCCESS: "/marketplace/sell/success",
  SELL_FAIL: "/marketplace/sell/fail",
  EXCHANGE_SUCCESS: "/marketplace/exchange/success",
  EXCHANGE_FAIL: "/marketplace/exchange/fail",
};

// 페이지 헤더 제목 상수
export const PAGE_TITLE = {
  MARKET: "마켓플레이스",
  MYGAL: "마이갤러리",
  MPSELLER: "나의 판매 포토카드",
};

// 버튼 텍스트 페이지 헤더 상수
export const BUTTON_TEXT = {
  SELL_PHOTO: "나의 포토카드 판매하기",
  CREATE_PHOTO: "포토카드 생성하기",
};

// 장르 상수 백앤드 동일
export const GENRE = {
  KPOP: "KPOP",
  ACTOR: "ACTOR",
  ESPORTS: "ESPORTS",
  KBO: "KBO",
  ANIMATION: "ANIMATION",
};

// 등급 상수 백앤드 동일
export const GRADE = {
  COMMON: "COMMON",
  RARE: "RARE",
  SUPER_RARE: "SUPER_RARE",
  LEGENDARY: "LEGENDARY",
};

// 거래 상태 상수 백앤드 동일
export const TRADESTATUS = {
  PENDING: "PENDING", // 교환 제시중
  REJECTED: "REJECTED", // 교환 거절
  COMPLETED: "COMPLETED", // 교환 완료
};

// 알림 상태 상수 백앤드 동일
export const NOTISTATUS = {
  PURCHASED: "PURCHASED", // 구매 완료
  SOLD: "SOLD", // 판매 완료
  SOLD_OUT: "SOLD_OUT", // 품절
  TRADE_OFFERED: "TRADE_OFFERED", // 교환 제안됨
  TRADE_ACCEPTED: "TRADE_ACCEPTED", // 교환 성사
  TRADE_REJECTED: "TRADE_REJECTED", // 교환 거절
};
