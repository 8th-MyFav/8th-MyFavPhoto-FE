"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NotificationButton from "./notificationButton";
import { PATHNAME } from "@/constants";
import ProfileModal from "./profile";

const Navigation = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [points, setPoints] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

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
      <nav className="flex gap-sm text-gray-200 text-noto-3xs font-bold">
        <Link className="cursor-pointer no-underline" href={PATHNAME.LOGIN}>
          로그인
        </Link>
        <Link className="cursor-pointer no-underline" href={PATHNAME.JOIN}>
          회원가입
        </Link>
      </nav>
    );
  }

  return (
    <div className="relative">
      <nav className="flex justify-center items-center gap-[30px] text-gray-200 text-noto-3x">
        {/* 포인트 */}
        <p className="font-br font-bold">{points} P</p>

        {/* 알림 버튼 */}
        <NotificationButton />

        {/* 프로필 + 모달 */}
        <div className="relative">
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="text-left cursor-pointer bg-transparent border-none p-0 hover:text-main font-br"
          >
            {user.nickname}
          </button>

          {/* 버튼 밖에 위치한 모달 */}
          <ProfileModal
            show={showProfile}
            name={user.nickname}
            point={points}
          />
        </div>

        {/* 구분선 */}
        <p className="flex justify-center self-start">|</p>

        {/* 로그아웃 */}
        <button
          onClick={logout}
          className="flex justify-center self-start text-gray-400 text-noto-3x font-bold cursor-pointer bg-transparent border-none p-0"
        >
          로그아웃
        </button>
      </nav>
    </div>
  );
};

export default Navigation;
