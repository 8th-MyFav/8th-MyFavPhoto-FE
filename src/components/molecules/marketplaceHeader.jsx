"use client";

import React from "react";
import Button from "../../components/atoms/button";

const MarketplaceHeader = ({ onSellClick }) => {
  return (
    <div className="flex justify-between items-center w-full pb-5 border-b border-white">
      {/* 왼쪽 텍스트 */}
      <div className="flex items-center text-white text-[62px] font-normal tracking-[-1.86px]">
        마켓플레이스
      </div>

      {/* 오른쪽 버튼 */}
      <Button
        text="내 포토카드 판매하기"
        width="440px"
        height="60px"
        padding="0"
        backgroundColor="var(--color-main)"
        color="var(--color-black)"
        onClick={onSellClick} 
      />
    </div>
  );
};

export default MarketplaceHeader;
