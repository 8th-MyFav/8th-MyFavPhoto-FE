"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import NotificationButton from "./NotificationButton.jsx";
import { PATHNAME } from "@/constants";
import ProfileModal from "./Profile.jsx";
import { usePoints } from "@/api/pointAPI";

const Navigation = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { data: points } = usePoints();
  const [showProfile, setShowProfile] = useState(false);
  const triggerRef = useRef(null);

  // ✅ 로그인 시 포인트 보조 fetch (React Query 외 안전장치)
  useEffect(() => {
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

          if (!res.ok) return;
          const data = await res.json();

          // react-query에서 이미 데이터가 있다면 덮어쓰지 않음
          if (!points) {
            console.log("보조 fetch로 포인트 데이터 갱신:", data);
          }
        } catch (err) {
          console.error("포인트 보조 fetch 실패:", err);
        }
      };
      fetchPoints();
    }
  }, [isAuthenticated, loading, points]);

  if (loading) return <div>로딩중...</div>;

  if (!isAuthenticated) {
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
      <nav className="flex items-center justify-center gap-[30px] text-gray-200 text-noto-3x">
        <p className="font-br font-bold">{points?.acc_point ?? 0} P</p>
        <NotificationButton />

        {/* 프로필 토글 + 모달 */}
        <div className="relative">
          <button
            ref={triggerRef}
            onClick={() => setShowProfile((prev) => !prev)}
            className="cursor-pointer bg-transparent p-0 text-left font-br hover:text-main"
            aria-haspopup="dialog"
            aria-expanded={showProfile}
          >
            {user?.nickname}
          </button>

          <ProfileModal
            show={showProfile}
            name={user?.nickname}
            point={points?.acc_point ?? 0}
            onClose={() => setShowProfile(false)}
            triggerRef={triggerRef}
          />
        </div>

        <p className="flex justify-center self-start">|</p>

        <button
          onClick={logout}
          className="flex justify-center self-start cursor-pointer bg-transparent p-0 text-gray-400 text-noto-3x font-bold"
        >
          로그아웃
        </button>
      </nav>
    </div>
  );
};

export default Navigation;
