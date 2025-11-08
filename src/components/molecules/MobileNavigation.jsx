"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useState } from "react";
import NotificationButton from "./notificationButton";
import { PATHNAME } from "@/constants";
import ProfileModal from "./profile";
import { usePoints } from "@/api/pointAPI";

const MobileNavigation = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { data: points } = usePoints();
  const [showProfile, setShowProfile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (loading) {
    return null;
  }

  const logo = (
    <Link href={PATHNAME.HOME} className="flex items-center justify-center">
      <img
        src="/images/favorite.svg"
        alt="최애의 포토"
        className="h-auto w-[100px]"
      />
    </Link>
  );

  if (!isAuthenticated) {
    return (
      <div className="flex w-full items-center">
        <div className="flex flex-1 justify-start">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center justify-center rounded border p-2"
              aria-label="메뉴 열기"
            >
              <img
                src="/icons/hamburgerMenuIcon.svg"
                alt="Hamburger menu"
                className="h-5 w-5"
              />
            </button>

            {isMenuOpen && (
              <div className="absolute left-0 top-full mt-2 flex w-[160px] flex-col gap-2 rounded bg-gray-500 p-4 text-white shadow-lg">
                <Link
                  className="cursor-pointer no-underline"
                  href={PATHNAME.LOGIN}
                  onClick={() => setIsMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  className="cursor-pointer no-underline"
                  href={PATHNAME.JOIN}
                  onClick={() => setIsMenuOpen(false)}
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 justify-center">{logo}</div>

        <div className="flex flex-1 items-center justify-end">
          <Link
            className="cursor-pointer no-underline text-white"
            href={PATHNAME.LOGIN}
          >
            로그인
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center">
      <div className="flex flex-1 justify-start">
        <div className="relative">
          <button
            onClick={() => setShowProfile((prev) => !prev)}
            className="flex items-center justify-center rounded border"
            aria-label="프로필 열기"
          >
            <img
              src="/icons/hamburgerMenuIcon.svg"
              alt="Hamburger menu"
              className="h-5 w-5"
            />
          </button>
          <ProfileModal
            show={showProfile}
            name={user.nickname}
            point={points?.acc_point}
          />
        </div>
      </div>

      <div className="flex flex-1 justify-center">{logo}</div>

      <div className="flex flex-1 justify-end">
        <NotificationButton />
      </div>
    </div>
  );
};

export default MobileNavigation;
