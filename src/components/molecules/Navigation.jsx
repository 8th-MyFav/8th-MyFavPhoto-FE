"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useRef, useState } from "react";
import NotificationButton from "./notificationButton";
import { PATHNAME } from "@/constants";
import ProfileModal from "./profile";
import { usePoints } from "@/api/pointAPI";

const Navigation = () => {
  const { isAuthenticated, loading, user, logout } = useAuth();
  const { data: points } = usePoints();
  const [showProfile, setShowProfile] = useState(false);

  // ⬇️ 드롭다운 토글 버튼 참조
  const triggerRef = useRef(null);

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
            ref={triggerRef} // ⬅️ 트리거 ref
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
            onClose={() => setShowProfile(false)} // ⬅️ 닫기 핸들러
            triggerRef={triggerRef} // ⬅️ 트리거 ref 전달
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
