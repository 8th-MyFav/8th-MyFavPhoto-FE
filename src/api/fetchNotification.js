// NOTE: /notification 하위 api 작성

import { accessFetch } from "./fetchAccess";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/notifications`;
const PAGESIZE = 5;

// NOTE: 알림 조회
export const getNotification = async (page = 1, pageSize = PAGESIZE) => {
  const response = await accessFetch(
    `${API_URL}?page=${page}&pageSize=${pageSize}`
  );
  // 에러도 errors.js 파일로 통일
  if (!response.ok) {
    throw new Error("알림을 가져오는데 실패했습니다.");
  }

  const data = await response.json();
  return data;
};

// NOTE: 알림 읽음 처리
export const readNotification = async (id) => {
  const response = await accessFetch(`${API_URL}/${id}/read`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("알림을 읽는데 실패했습니다.");
  }

  const data = await response.json();
  return data;
};

/** 그냥 api 통신 확인용 코드
  useEffect(() => {
    async function fetchData() {
      const data = await getNotification();
      return data;
    }

    const notif = fetchData();
    console.log("notification=> ", notif);
  }, []); */
