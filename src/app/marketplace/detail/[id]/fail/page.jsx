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
      <h1 className="text-4xl mb-6">
        구매 <span className="text-gray-400">실패</span>
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
