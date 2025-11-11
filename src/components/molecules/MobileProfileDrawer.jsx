"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PATHNAME } from "@/constants";
import { useAuth } from "@/contexts/AuthContext";

const MobileProfileDrawer = ({
  show = false,
  name = "",
  point = 0,
  onClose,
}) => {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    if (!show) return;

    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [show, onClose]);

  if (!show) return null;

  const handleNavigate = (path) => {
    onClose?.();
    router.push(path);
  };

  const handleLogout = () => {
    logout();
    onClose?.();
    router.push(PATHNAME.LOGIN);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="h-full w-[300px] bg-gray-500 text-white flex flex-col px-6 py-8">
        <div>
          <p className="text-[20px] font-bold pb-xs pt-md">
            안녕하세요, {name ? `${name}님!` : "유저님!"}
          </p>
          <div className="mt-3 flex justify-between text-[13px] text-gray-300 pb-xs border-b-[1px]">
            <span>보유 포인트</span>
            <span className="text-main font-semibold">{point ?? 0} P</span>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-5 text-[16px] font-semibold">
          <button
            className="text-left transition hover:text-main"
            onClick={() => handleNavigate(PATHNAME.MARKET)}
          >
            마켓플레이스
          </button>
          <button
            className="text-left transition hover:text-main"
            onClick={() => handleNavigate(PATHNAME.MYGAL)}
          >
            마이갤러리
          </button>
          <button
            className="text-left transition hover:text-main"
            onClick={() => handleNavigate(PATHNAME.MPSELLER)}
          >
            판매 중인 포토카드
          </button>
        </nav>

        <button
          className="mt-auto text-left text-[14px] text-gray-300 hover:text-white transition pb-md"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>

      <button
        type="button"
        className="flex-1 h-full bg-black/50"
        onClick={onClose}
        aria-label="프로필 닫기"
      />
    </div>
  );
};

export default MobileProfileDrawer;
