"use client";
import React from "react";
import { useRouter } from "next/navigation";

const ProfileModal = ({ show, name, point }) => {
  const router = useRouter();

  const handleNavigate = (path) => {
    router.push(path);
  };

  if (!show) return null;

  return (
    <div className="absolute right-0 mt-2 w-[260px] bg-[#161616] rounded-none overflow-hidden shadow-md transition z-50">
      {/* 상단 영역 */}
      <div className="w-[260px] h-[103px] flex justify-center items-center border-b border-[#383838]">
        <div className="w-[220px] h-[63px] relative text-white text-sm flex flex-col justify-between">
          <p className="absolute top-0 left-0 text-left text-[18px] font-bold">
            안녕하세요, {name}님!
          </p>
          <p className="absolute bottom-0 left-0 text-[12px] font-light text-gray-300">
            보유 포인트
          </p>
          <p className="absolute bottom-0 right-0 text-[12px] font-regular text-yellow-300">
            {point} P
          </p>
        </div>
      </div>

      {/* 링크 영역 */}
      <div className="w-[260px] h-[120px] flex justify-start items-start bg-[#161616]">
        <div className="w-[110px] h-[87px] flex flex-col justify-between items-start text-white text-sm ml-[20px] mt-[18px] text-left">
          <button
            onClick={() => handleNavigate("/marketplace")}
            className="text-[14px] font-bold hover:text-yellow-300 transition"
          >
            마켓플레이스
          </button>
          <button
            onClick={() => handleNavigate("/myGallery")}
            className="text-[14px] font-bold hover:text-yellow-300 transition"
          >
            마이갤러리
          </button>
          <button
            onClick={() => handleNavigate("/marketplace/seller")}
            className="text-[14px] font-bold hover:text-yellow-300 transition whitespace-nowrap"
          >
            판매 중인 포토카드
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
