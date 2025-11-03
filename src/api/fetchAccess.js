// NOTE: accessToken을 헤더에 자동으로 포함하는 Fetch Wrapper 함수
export const accessFetch = async (url, options = {}) => {
  // accesstToken 가져오기
  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) throw new Error("API 요청 실패");
  return response;
};
