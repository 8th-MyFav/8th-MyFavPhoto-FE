"use client";
import { GRADE } from "@/constants";
import React from "react";

const PhotoCardSummary = ({
  ownerName = "",
  totalCount = 0,
  gradeCounts = {},
}) => {
  // 등급 정보를 배열로 정의 (색상, 표시명, API 키 매핑)
  const gradeConfig = [
    {
      key: GRADE.COMMON,
      displayName: "COMMON",
      borderColor: "main",
      textColor: "main",
    },
    {
      key: GRADE.RARE,
      displayName: "RARE",
      borderColor: "blue",
      textColor: "blue",
    },
    {
      key: GRADE.SUPER_RARE,
      displayName: "SUPER RARE",
      borderColor: "purple",
      textColor: "purple",
    },
    {
      key: GRADE.LEGENDARY,
      displayName: "LEGENDARY",
      borderColor: "red",
      textColor: "red",
    },
  ];

  return (
    <div className="border-b-[1px] border-gray-400">
      <div className="flex items-end gap-2 text-gray-200 mt-md pb-xs">
        <h2 className="text-noto-base font-bold tracking-[-0.4px]">
          {ownerName ? `${ownerName}님이 보유한 포토카드` : "보유한 포토카드"}
        </h2>
        <span className="text-noto-sm text-gray-300">({totalCount}장)</span>
      </div>

      <div className="flex gap-3 mt-3 pb-md">
        {gradeConfig.map((grade) => {
          const count = gradeCounts[grade.key] || 0;
          const baseClasses = "px-3 py-1 border rounded-base text-noto-2xs";
          const colorClasses =
            grade.key === GRADE.COMMON
              ? "border-main text-main"
              : grade.key === GRADE.RARE
              ? "border-blue text-blue"
              : grade.key === GRADE.SUPER_RARE
              ? "border-purple text-purple"
              : "border-red text-red";

          return (
            <div key={grade.key} className={baseClasses + " " + colorClasses}>
              {grade.displayName} {count}장
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhotoCardSummary;
