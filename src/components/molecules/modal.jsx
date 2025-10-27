"use client";

import React from "react";

const Modal = ({
  title = "제목",
  content = "내용",
  buttonText = "확인",
  onClose,
  onButtonClick,
  imageSrc, 
  imageAlt = "Modal Image", 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none">
      {/* 배경 블러 */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

      {/* 모달 박스 */}
      <div
        className="relative flex flex-col items-center rounded-[2px] bg-gray-700 z-10 pointer-events-auto"
        style={{
          width: "560px",
          flexShrink: 0,
          paddingTop: "40px",
          paddingBottom: "63px",
        }}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] w-[32px] h-[32px] cursor-pointer"
        >
          <img src="/images/close.svg" alt="Close" className="w-full h-full" />
        </button>

        {/* 제목 */}
        <h2
          style={{
            color: "var(--white-white, #FFF)",
            fontFamily: "Noto Sans KR",
            fontSize: "20px",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          {title}
        </h2>

        {/* 이미지 (있으면 표시) */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            style={{
              width: "200px",
              height: "auto",
              marginBottom: "20px",
              borderRadius: "4px",
            }}
          />
        )}

        {/* 내용 */}
        <p
          style={{
            color: "var(--gray-gray300, #A4A4A4)",
            fontFamily: "Noto Sans KR",
            fontSize: "16px",
            fontWeight: 400,
            textAlign: "center",
            marginBottom: "60px",
          }}
        >
          {content}
        </p>

        {/* 버튼 */}
        <button
          onClick={onButtonClick}
          style={{
            width: "170px",
            height: "60px",
            borderRadius: "2px",
            background: "var(--main-main,#EFFF04)",
            color: "var(--black-black, #0F0F0F)",
            fontFamily: "Noto Sans KR",
            fontSize: "18px",
            fontWeight: 700,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;
