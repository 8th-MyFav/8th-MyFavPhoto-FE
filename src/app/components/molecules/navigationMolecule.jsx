"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navigation = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [points, setPoints] = useState(0);

  useEffect(
    function () {
      // 로그인 여부를 판단함
      if (!isAuthenticated && !loading) {
        // 로그인된 경우 포인트 데이터를 불러옴
        const fetchPoints = async () => {
          try {
            const response = await fetch("/points", {
              method: "GET",
            });
            const data = await response.json();
            if (typeof totalPoints === "number") {
              setPoints(totalPoints);
            }
          } catch (error) {
            console.error("포인트 불러오기 실패:", error);
          }
        };
        fetchPoints();
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

  if (!isAuthenticated) {
    // 로그인 안 된 경우
    return (
      <nav className="flex gap-[30px] py-[30px] text-[var(--color-gray-200)] text-[14px]">
        <Link href="/login">로그인</Link>
        <Link href="/join">회원가입</Link>
      </nav>
    );
  }

  return (
    <nav className="flex gap-[30px] py-[30px] text-[var(--color-gray-200)] text-[14px]">
      <p>{points} P</p>
      <img src="/images/alarm.svg" alt="알림" />
      <p className="font-[<베라폰트>]">{user?.nickname}</p>
      <p>|</p>
      <button onClick={logout} className="text-[var(--color-gray-400)]">
        로그아웃
      </button>
    </nav>
  );
};

export default Navigation;
