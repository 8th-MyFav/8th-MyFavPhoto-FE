"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// sample-auth-needed
// 이 페이지는 무조건 로그인이 돼야만 들어올 수 있는 페이지
// 이 페이지를 가이드
export default function SampleAuthNeededPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(
    function () {
      // 로그인 여부를 판단함
      if (!isAuthenticated && !loading) {
        // 로딩이 끝났는데, 로그인도 안된 경우
        router.push("/login");
      } else {
        // 로딩이 끝나지 않았거나, 로그인이 된 경우
      }
    },
    [isAuthenticated, loading]
  );

  console.log("isAuthenticated", isAuthenticated);
  console.log("loading", loading);

  if (loading) {
    // 아직 로그인 여부가 판단이 안된 상태
    return <div>로딩중...</div>;
  }

  return (
    <div>
      여기는 로그인이 돼야만 접속할 수 있는 페이지입니다. 만일 로그인이
      안되어있다면 로그인페이지로 이동시켜야 합니다.
    </div>
  );
}
