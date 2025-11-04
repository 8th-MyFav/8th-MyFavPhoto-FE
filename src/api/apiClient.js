import { API_URL, TOKEN_KEY } from "./constants";

export const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

/**
 * 공통 fetch wrapper
 * - GET 요청은 data를 쿼리로 변환
 * - auth=true일 경우 Bearer 토큰 자동 주입
 */
export const apiClient = async (
  endpoint,
  { method = "GET", data, auth = false } = {}
) => {
  const headers = { "Content-Type": "application/json" };
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  // refresh token

  const url = new URL(`${API_URL}${endpoint}`);

  // GET 요청일 경우, data를 query string으로 변환
  if (method === "GET" && data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        url.searchParams.append(key, value);
    });
  }

  const res = await fetch(url, {
    method,
    headers,
    body: method !== "GET" && data ? JSON.stringify(data) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API 요청 실패 (${res.status}): ${text}`);
  }

  return res.json();
};
