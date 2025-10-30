"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ExchangeFailPage = () => {
  const router = useRouter();

  return (
    <div className="bg-black min-h-[668px] text-white flex flex-col items-center justify-center">
      <h1
        className="text-4xl relative"
        style={{
          marginBottom: "40px",
          fontFamily: "var(--font-br)", 
        }}
      >
        교환 제시 <span className="text-gray-400">실패</span>

        {/* 닫기 버튼 */}
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute"
          style={{
            width: "36px",
            height: "36px",
            flexShrink: 0,
            top: "-96px",
            right: "-335px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/marketplace")}
        />
      </h1>

      <p className="text-xl" style={{ marginBottom: "60px" }}>
        포토카드 교환 제시에 실패했습니다.
      </p>

      <button
        onClick={() => router.push("/marketplace")}
        className="border border-white px-8 py-3 hover:bg-white hover:text-black transition cursor-pointer"
      >
        마켓 플레이스로 돌아가기
      </button>
    </div>
  );
};

export default ExchangeFailPage;
