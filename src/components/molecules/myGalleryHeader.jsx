"use client";
import React from "react";
import Button from "../atoms/button";
import { useRouter } from "next/navigation";

// Header for MyGallery: shows owner name, total count, and counts by grade
// Props:
// - ownerName: string
// - totalCount: number
// - gradeCounts: { COMMON: number, RARE: number, SUPER_RARE: number, LEGENDARY: number }
const MyGalleryHeader = ({
  ownerName = "",
  totalCount = 0,
  gradeCounts = {},
  onGradeClick,
}) => {
  const { COMMON = 0, RARE = 0, SUPER_RARE = 0, LEGENDARY = 0 } = gradeCounts;

  const handleNewPhotoCard = (e) => {
    e.preventDefault();
    router.push("/create");
  };
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="mb-[20px] pt-[60px]">
        <div className="flex justify-between items-center w-full border-b-[2px] border-[var(--color-gray-100)] pb-[20px]">
          {/* 왼쪽 텍스트 */}
          <div
            className="flex items-center text-white text-[62px] font-normal tracking-[-1.86px]"
            style={{ fontFamily: "var(--font-br)" }}
          >
            마이갤러리
          </div>

          {/* 오른쪽 버튼 */}
          <Button
            text="포토카드 생성하기"
            width="440px"
            height="60px"
            padding="0"
            backgroundColor="var(--color-main)"
            color="var(--color-black)"
            onClick={handleNewPhotoCard}
          />
        </div>
        <div className="border-b-[1px] border-[var(--color-gray-400)]">
          <div className="flex items-end gap-2 text-[var(--color-gray-200)] mt-[40px] pb-[20px]">
            <h2 className="text-[24px] font-bold tracking-[-0.4px]">
              {ownerName
                ? `${ownerName}님이 보유한 포토카드`
                : "보유한 포토카드"}
            </h2>
            <span className="text-[20px] text-[var(--color-gray-300)]">
              ({totalCount}장)
            </span>
          </div>

          <div className="flex gap-3 mt-3 pb-[40px] ">
            <div className="px-3 py-1 border rounded-[2px] text-[12px] tracking-[-0.24px] border-[var(--color-main)]  text-[var(--color-main)] ">
              COMMON {COMMON}장
            </div>
            <div className="px-3 py-1 border rounded-[2px] text-[12px] tracking-[-0.24px] border-[var(--color-blue)]  text-[var(--color-blue)] ">
              RARE {RARE}장
            </div>
            <div className="px-3 py-1 border rounded-[2px] text-[12px] tracking-[-0.24px] border-[var(--color-purple)]  text-[var(--color-purple)] ">
              SUPER RARE {SUPER_RARE}장
            </div>
            <div className="px-3 py-1 border rounded-[2px] text-[12px] tracking-[-0.24px] cursor-pointer border-[var(--color-red)]  text-[var(--color-red)] ">
              LEGENDARY {LEGENDARY}장
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyGalleryHeader;
