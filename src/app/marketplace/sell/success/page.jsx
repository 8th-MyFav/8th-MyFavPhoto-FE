// 하드 코딩 방식 나중에 쿼리문으로 변경 해야됨

"use client";

import React from "react";
import { useRouter } from "next/navigation";

const SellSuccessPage = () => {
  const router = useRouter();

  const cardInfo = {
    rarity: "LEGENDARY",
    title: "우리집 앞마당",
    quantity: 2,
  };

  const handleGoToMyCards = () => {
    router.push("/mypage/sell");
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
          판매 등록 <span className="text-[var(--color-main)]">성공</span>

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
          [{cardInfo.rarity} | {cardInfo.title}] {cardInfo.quantity}장 판매 등록에 성공했습니다!
        </p>

        {/* 버튼 */}
        <button
          onClick={handleGoToMyCards}
          style={{ fontFamily: "var(--font-noto)" }}
          className="border border-white text-white px-8 py-3 w-[440px] h-[60px] hover:bg-white hover:text-black transition-colors duration-200 text-[18px] font-bold text-center cursor-pointer"
        >
          나의 판매 포토카드에서 확인하기
        </button>
      </div>
    </div>
  );
};

export default SellSuccessPage;
