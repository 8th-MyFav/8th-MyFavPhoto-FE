"use client";
import { GRADE } from "@/constants";
import React from "react";
import Badge from "@/components/atoms/Badge";

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
      <div className="flex items-end gap-2 text-gray-200 desktop:mt-md desktop:pb-xs">
        <h2
          className="font-bold tracking-tighter
            desktop:text-noto-base
            tablet:text-sm
            mobile:text-3xs"
        >
          {ownerName ? `${ownerName}님이 보유한 포토카드` : "보유한 포토카드"}
        </h2>
        <span className="desktop:text-noto-sm tablet:text-noto-xs text-noto-4xs text-gray-300">
          ({totalCount}장)
        </span>
      </div>

      <div
        className="flex gap-2 overflow-x-auto scrollbar-none
        mobile:py-[15px]
        tablet:pt-[10px] tablet:pb-[40px]
        desktop:pt-[10px] desktop:pb-[40px]
        mobile:flex-nowrap mobile:[&>div]:!flex-shrink-0 mobile:[&>div]:!px-[10px] mobile:[&>div]:!py-[6px] mobile:[&>div]:!text-[12px]
        tablet:flex-wrap tablet:[&>div]:!px-[10px] tablet:[&>div]:!py-[6px] tablet:[&>div]:!text-[14px]
        desktop:flex-wrap desktop:[&>div]:!px-[20px] desktop:[&>div]:!py-[8px] desktop:[&>div]:!text-[16px]"
      >
        {gradeConfig.map((grade) => {
          const count = gradeCounts[grade.key] || 0;
          return (
            <Badge
              key={grade.key}
              type={grade.displayName}
              count={count}
              size="small"
            />
          );
        })}
      </div>
    </div>
  );
};

export default PhotoCardSummary;
