"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SellFailPage = () => {
  const router = useRouter();

  const cardInfo = {
    rarity: "LEGENDARY",
    title: "우리집 앞마당",
    quantity: 2,
  };

  const handleGoToMarketplace = () => {
    router.push("/marketplace");
  };

  const handleClose = () => {
    router.push("/marketplace");
  };

  return (
    <div className="bg-black min-h-screen text-white relative">

      {/* 중앙 콘텐츠 */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center relative px-4">
        {/* 제목 */}
        <div
          style={{ fontFamily: "var(--font-br)" }}
          className="text-[46px] font-normal leading-normal tracking-[-1.38px] mb-[40px] relative inline-block"
        >
          <span style={{ color: "var(--white-white, #FFF)" }}>판매 등록 </span>
          <span style={{ color: "var(--gray-gray300, #A4A4A4)" }}>실패</span>

          {/* 닫기 버튼 */}
          <img
            src="/images/close.svg"
            alt="close"
            className="absolute top-[-96px] right-[-293px] w-[36px] h-[36px] cursor-pointer"
            onClick={handleClose}
          />
        </div>

        {/* 설명 */}
        <p
          style={{ fontFamily: "var(--font-noto)" }}
          className="text-white text-center text-[20px] font-bold leading-normal mb-[60px]"
        >
          [{cardInfo.rarity} | {cardInfo.title}] {cardInfo.quantity}장 판매 등록에 실패했습니다.
        </p>

        {/* 버튼 */}
        <button
          onClick={handleGoToMarketplace}
          style={{ fontFamily: "var(--font-noto)", whiteSpace: "nowrap" }}
          className="border border-white text-white px-8 py-3 w-[440px] h-[60px] hover:bg-white hover:text-black transition-colors duration-200 text-[18px] font-bold text-center cursor-pointer"
        >
          마켓 플레이스로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default SellFailPage;
