"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PATHNAME } from "@/constants";

const ProfileModal = ({ show, name, point }) => {
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push(path);
  };

  if (!show) return null;

  return (
    <div className="absolute right-0 mt-2 w-[260px] rounded-none bg-gray-500 text-white shadow-md transition z-50">
      {/* 상단 영역 */}
      <div className="flex h-[103px] w-[260px] items-center justify-center border-b border-gray-400">
        <div className="relative flex h-[63px] w-[220px] flex-col justify-between text-[14px] font-noto">
          <p className="absolute top-0 left-0 text-left text-[18px] font-bold">
            안녕하세요, {name}님!
          </p>
          <p className="absolute bottom-0 left-0 text-[12px] font-light text-gray-300">
            보유 포인트
          </p>
          <p className="absolute bottom-0 right-0 text-[12px] font-medium text-main">
            {point} P
          </p>
        </div>
      </div>

      {/* 링크 영역 */}
      <div className="flex h-[120px] w-[260px] items-start justify-start bg-gray-500">
        <div className="ml-[20px] mt-[18px] flex h-[87px] w-[110px] flex-col items-start justify-between text-left text-[14px] font-bold font-noto">
          <button
            onClick={() => handleNavigate(PATHNAME.MARKET)}
            className="transition hover:text-main"
          >
            마켓플레이스
          </button>
          <button
            onClick={() => handleNavigate(PATHNAME.MYGAL)}
            className="transition hover:text-main"
          >
            마이갤러리
          </button>
          <button
            onClick={() => handleNavigate(PATHNAME.MPSELLER)}
            className="whitespace-nowrap transition hover:text-main"
          >
            판매 중인 포토카드
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
