"use client";

import React from "react";

const Modal = ({
  title = "제목",
  content = "내용",
  buttonText = "확인",
  onClose,
  onButtonClick,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pointer-events-none">
      {/* 배경 블러 */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

      {/* 모달 박스 */}
      <div className="relative flex flex-col w-[560px] h-[352px] mt-[80px] rounded-[2px] bg-gray-700 z-10 pointer-events-auto">
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[30px] right-[30px] w-[32px] h-[32px] cursor-pointer"
        >
          <img src="/images/close.svg" alt="Close" className="w-full h-full" />
        </button>

        {/* 제목 */}
        <h2 className="text-white text-center text-[20px] font-bold mt-[40px] mx-[40px] whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h2>

        {/* 내용 */}
        <p className="text-gray-300 text-center text-[16px] font-normal mt-[60px] mx-[40px] whitespace-pre-line">
          {content}
        </p>

        {/* 버튼 */}
        <div className="flex justify-center mt-auto mb-[40px]">
          <button
            onClick={onButtonClick}
            className="flex justify-center items-center w-[170px] h-[60px] gap-[10px] rounded-[2px] bg-yellow-400 text-black text-[18px] font-bold cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
