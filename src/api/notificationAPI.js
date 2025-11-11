// NOTE: /notification 하위 api 작성

import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { NOTIFICATION_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";

const PAGESIZE = 5;

// NOTE: 알림 조회
export const useNotification = (page = 1, pageSize = 5) => {
  return useQuery({
    queryKey: ["notification", page, pageSize],
    queryFn: async () => {
      try {
        return await apiClient(
          `${NOTIFICATION_ENDPOINTS.NOTIF}?page=${page}&pageSize=${pageSize}`,
          {
            auth: true,
          }
        );
      } catch (error) {
        console.error("알림 조회 실패:", error);
        throw new Error(error?.message || ERROR_MESSAGES.NOTIFICATION_FAIL);
      }
    },
  });
};

// NOTE: 알림 읽음 처리
export const useReadNotification = () => {
  return useMutation({
    mutationFn: async (id) => {
      try {
        return await apiClient(`${NOTIFICATION_ENDPOINTS.NOTIF}/${id}/read`, {
          method: "PATCH",
          auth: true,
        });
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
        throw new Error(
          error?.message || ERROR_MESSAGES.NOTIFICATION_READ_FAIL
        );
      }
    },
  });
};
