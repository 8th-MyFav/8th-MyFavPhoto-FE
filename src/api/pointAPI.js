// NOTE: /users/points 하위 api 작성

import { data } from "autoprefixer";
import { POINT_ENDPOINTS } from "./apiEndpoints";
import { ERROR_MESSAGES } from "./constants";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { useMutation } from "@tanstack/react-query";

// NOTE: 포인트 조회
export const usePoints = () => {
  return useQuery({
    queryKey: ["points"],
    queryFn: async () => {
      try {
        return await apiClient(POINT_ENDPOINTS.POITNT, {
          auth: true,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.POINT_FAIL);
      }
    },
  });
};

// NOTE: 포인트 획득
export const useGainPoints = () => {
  return useMutation({
    mutationFn: async (randomPoint) => {
      try {
        // randomPoint가 숫자로 들어옴
        const data = { point: randomPoint };

        return await apiClient(POINT_ENDPOINTS.POITNT, {
          method: "POST",
          auth: true,
          data,
        });
      } catch {
        throw new Error(ERROR_MESSAGES.POINT_GAIN_FAIL);
      }
    },
  });
};
