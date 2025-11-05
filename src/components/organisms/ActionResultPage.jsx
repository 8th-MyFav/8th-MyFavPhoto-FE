"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PATHNAME } from "@/constants";

const ActionResultPage = ({
  type = "구매", // 구매 / 교환 / 판매
  result = "성공", // 성공 / 실패
  rarity,
  title,
  quantity = 1,
  buttonText = "마켓 플레이스로 돌아가기",
  buttonAction, // 버튼 클릭 시 함수
  closeAction, // 닫기 버튼 클릭 시 함수
  highlightColor = "#EFFF04", // 성공일 때 강조 색
}) => {
  const router = useRouter();

  return (
    <div className="bg-black min-h-[668px] text-white flex flex-col items-center justify-center relative px-4">
      <h1
        className="text-4xl relative mb-6"
        style={{ fontFamily: "var(--font-br)" }}
      >
        {type}{" "}
        <span style={{ color: result === "성공" ? highlightColor : "#A4A4A4" }}>
          {result}
        </span>
        <img
          src="/images/close.svg"
          alt="close"
          className="absolute"
          style={{
            width: "36px",
            height: "36px",
            top: "-96px",
            right: type === "판매" ? "-293px" : "-335px",
            cursor: "pointer",
          }}
          onClick={closeAction || (() => router.push(PATHNAME.MARKET))}
        />
      </h1>

      {rarity && title && (
        <p className="text-xl mb-6 text-center">
          [{rarity} | {title}] {quantity}장 {type}{" "}
          {result === "성공" ? "에 성공했습니다!" : "에 실패했습니다."}
        </p>
      )}

      <button
        onClick={buttonAction || (() => router.push(PATHNAME.MARKET))}
        className="border border-white px-8 py-3 hover:bg-white hover:text-black transition cursor-pointer"
        style={{ whiteSpace: "nowrap" }}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ActionResultPage;
