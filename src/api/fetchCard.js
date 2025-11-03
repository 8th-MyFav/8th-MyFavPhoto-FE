// NOTE: /cards 하위 api 작성 

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/cards`;

// 예시
export const fetchCard = async () => {
  const response = await fetch(API_URL);
  // 에러도 errors.js 파일로 통일
  if (!response.ok) {
    throw new Error("서버에서 데이터를 가져오는데 실패했습니다.");
  }
  return await response.json();
};