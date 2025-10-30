"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NotificationButton from "./notificationButton";

const Navigation = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [points, setPoints] = useState(0);

  // 포인트 상태 변경 디버깅
  useEffect(() => {
    console.log("포인트 상태 변경:", points);
  }, [points]);

  useEffect(
    function () {
      // 로그인된 경우에만 포인트 데이터를 불러옴
      if (isAuthenticated && !loading) {
        const fetchPoints = async () => {
          try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/users/points`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            if (res.ok) {
              const data = await res.json();
              setPoints(Number(data?.acc_point) || 0);
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
      <nav className="flex gap-[30px] text-[var(--color-gray-200)] text-[14px] font-bold">
        <Link className="cursor-pointer no-underline" href="/login">
          로그인
        </Link>
        <Link className="cursor-pointer no-underline" href="/join">
          회원가입
        </Link>
      </nav>
    );
  }

  return (
    <div className="relative">
      <nav className="flex justify-center items-center gap-[30px] text-[var(--color-gray-200)] text-[14px] font-bold ">
        <p>{points} P</p>
        <NotificationButton />
        <p className="self-end" style={{ fontFamily: "var(--font-br)" }}>
          {user.nickname}
        </p>
        <p className="flex justify-center self-start">|</p>
        <button
          onClick={logout}
          className="text-[var(--color-gray-400)] font-noto-bold cursor-pointer bg-transparent border-none p-0"
        >
          로그아웃
        </button>
      </nav>
    </div>
  );
};

export default Navigation;
