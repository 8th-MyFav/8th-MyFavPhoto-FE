"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PurchaseSuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rarity = searchParams.get("rarity") || "LEGENDARY";
  const title = searchParams.get("title") || "우리집 앞마당";
  const quantity = searchParams.get("quantity") || 1;

  return (
    <div className="bg-black min-h-[668px] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6 relative">
        구매 <span style={{ color: "#EFFF04" }}>성공</span>

        {/* ✅ close.svg 아이콘 — 제목 기준으로 오른쪽 335px, 위로 96px */}
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute"
          style={{
            width: "36px",
            height: "36px",
            flexShrink: 0,
            top: "-96px", // 위로 96px
            right: "-335px", // 오른쪽으로 335px
            cursor: "pointer",
          }}
          onClick={() => router.push("/marketplace")}
        />
      </h1>

      <p className="text-xl mb-6">
        [{rarity} | {title}] {quantity}장 구매에 성공했습니다!
      </p>
      <button
        onClick={() => router.push("/mypage/gallery")}
        className="border border-white px-8 py-3 hover:bg-white hover:text-black transition cursor-pointer"
      >
        마이갤러리에서 확인하기
      </button>
    </div>
  );
};

export default PurchaseSuccessPage;
