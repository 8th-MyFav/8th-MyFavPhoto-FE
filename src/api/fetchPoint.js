// NOTE: /users/points 하위 api 작성

import { accessFetch } from "./fetchAccess";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/points`;
const PAGESIZE = 5;

// NOTE: 포인트 조회
export const getNotification = async () => {
  const response = await accessFetch(API_URL);

  if (!response.ok) {
    throw new Error("포인트를 가져오는데 실패했습니다.");
  }

  const data = await response.json();
  return data;
};

// NOTE: 포인트 획득
export const readNotification = async (randomPoint) => {
  const points = { point: randomPoint };

  const response = await accessFetch(API_URL, {
    method: "POST",
    body: JSON.stringify(points),
  });

  if (!response.ok) {
    throw new Error("포인트 획득에 실패했습니다.");
  }

  const data = await response.json();
  return data;
};
