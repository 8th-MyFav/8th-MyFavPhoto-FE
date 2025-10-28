"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PurchaseFailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rarity = searchParams.get("rarity") || "LEGENDARY";
  const title = searchParams.get("title") || "우리집 앞마당";
  const quantity = searchParams.get("quantity") || 1;

  return (
    <div className="bg-black min-h-[668px] text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-6 relative">
        구매 <span className="text-gray-400">실패</span>

        {/* ✅ close.svg 아이콘 — h1 기준으로 위치 조정 */}
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
        [{rarity} | {title}] {quantity}장 구매에 실패했습니다.
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

export default PurchaseFailPage;
