"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NotificationButton from "./notificationButton";

const Navigation = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const [points, setPoints] = useState(0);
  const [showProfile, setShowProfile] = useState(false); //profile 완료되면 삭제 예정

  // 프로필 모달 핸들러
  const handleProfileModal = () => {
    setShowProfile(!showProfile);
  };

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
        <p
          className="self-end cursor-pointer"
          style={{ fontFamily: "var(--font-br)" }}
          onClick={handleProfileModal}
        >
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

      {/* 프로필 모달 - 260x231 사이즈, 네비게이션 바로 밑 */}
      {showProfile && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfile(false)}
            style={{ pointerEvents: "auto" }}
          />
          {/* 모달 */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[260px] bg-[#161616] rounded-lg shadow-xl/30 z-50 px-[20px] pb-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-4 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b border-gray-400">
                <p className="text-[18px] mb-[20px] font-noto-bold">
                  안녕하세요, {user.nickname}님!
                </p>
                <p className="flex justify-between text-[12px] text-[var(--color-gray-300)] pb-[20px]">
                  보유 포인트:{" "}
                  <span className="text-[var(--color-main)]">{points} P</span>
                </p>
              </div>
              <div className="flex flex-col gap-[14px] pt-[20px]">
                <Link
                  href="/marketplace"
                  className="block w-full text-left text-sm hover:text-yellow-300 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile(false);
                  }}
                >
                  마켓플레이
                </Link>
                <Link
                  href="/"
                  className="block w-full text-left text-sm hover:text-yellow-300 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile(false);
                  }}
                >
                  마이 갤러리
                </Link>
                <Link
                  href="/"
                  className="block w-full text-left text-sm hover:text-yellow-300 transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfile(false);
                  }}
                >
                  판매 중인 포토카드
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navigation;
