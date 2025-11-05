"use client";

import React from "react";
import Button from "../../components/atoms/Button";

const sellerHeader = ({ onSellClick }) => {
  return (
    <div className="flex justify-between items-center w-full pb-5 border-b border-white">
      {/* 왼쪽 텍스트 */}
      <div className="flex items-center text-white text-[62px] font-normal tracking-[-1.86px]">
        나의 판매 포토카드
      </div>
    </div>
  );
};

export default sellerHeader;
