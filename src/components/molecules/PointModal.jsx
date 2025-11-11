"use client";

import React from "react";
import Button from "@/components/atoms/Button";

const PointModal = ({
  isOpen,
  onClose,
  isConfirmed,
  selectedBox,
  setSelectedBox,
  earned,
  handleGain,
  isPending,
  minutes,
  seconds,
  isCooldown, // ⬅️ 추가: 쿨타임 여부
  boxImages,
  title1 = "랜덤",
  title2 = "포인트",
  buttonText = "선택완료",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center overflow-y-auto pointer-events-none">
      {/* 배경 블러 */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none"></div>

      {/* 모달 박스 */}
      <div
        className={`relative flex flex-col justify-between items-center ${
          isConfirmed
            ? "w-full max-w-[455px] h-full max-h-[678px]"
            : selectedBox !== null
            ? "w-full max-w-[1034px] h-full max-h-[765px]"
            : "w-full max-w-[1034px] h-full max-h-[646px]"
        } rounded-[var(--radius-base)] bg-gray-500 z-10 pointer-events-auto transition-all duration-200`}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[30px] right-[30px] cursor-pointer"
          aria-label="닫기"
        >
          <img src="/images/close.svg" alt="Close" className="w-full h-full" />
        </button>

        <div className="text-center w-full">
          {/* 제목 */}
          <div className="flex items-center justify-center mt-[80px] mb-[40px]">
            <h1 className="text-br-base text-foreground text-[46px] tracking-[-1.38px]">
              {title1}
            </h1>
            <h1 className="text-br-base text-main text-[46px] tracking-[-1.38px]">
              {" "}
              {title2}
            </h1>
          </div>

          {/* 내용 */}
          {!isConfirmed ? (
            <>
              <div className="mb-[40px]">
                <h2 className="text-foreground text-[20px] font-[700] mt-[20px] leading-relaxed text-center">
                  1시간마다 돌아오는 기회!
                  <br />
                  랜덤 상자 뽑기를 통해 포인트를 획득하세요!
                </h2>
              </div>

              <div className="flex items-center justify-center gap-[10px]">
                <p className="text-gray-300 text-center">
                  다음 기회까지 남은 시간
                </p>
                <p className="text-main text-center">
                  {minutes}분 {seconds}초
                </p>
              </div>

              {/* 선물 상자 */}
              <div className="flex justify-center items-center gap-[60px] mt-[20px]">
                {boxImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`선물상자 ${index + 1}`}
                    onClick={() => {
                      if (isCooldown || isPending) return; // ⬅️ 쿨타임 중 선택 방지
                      setSelectedBox(index);
                    }}
                    className={`transition-all rounded-md ${
                      index === 0
                        ? "w-[246px] h-[191px]"
                        : index === 1
                        ? "w-[224px] h-[298px]"
                        : "w-[246px] h-[191px]"
                    } ${
                      selectedBox === null
                        ? "opacity-100"
                        : selectedBox === index
                        ? "opacity-100 scale-105"
                        : "opacity-40"
                    } ${
                      isCooldown || isPending
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }`}
                    style={{
                      imageRendering: "crisp-edges",
                      backfaceVisibility: "hidden",
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
            // 획득 결과
            <>
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/images/Point.svg"
                  alt="포인트 아이콘"
                  className="w-[340px] h-[324.12px]"
                />
                <div className="flex items-center justify-center gap-[10px] mb-[20px]">
                  <h2 className="text-main text-[36px] font-bold">{earned}P</h2>
                  <h2 className="text-foreground text-[36px] font-bold">
                    획득!
                  </h2>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 하단 버튼: 선택 완료 */}
        {!isConfirmed && selectedBox !== null && (
          <div className="flex justify-center mb-[63px]">
            <Button
              text={isPending ? "처리중..." : buttonText}
              width="520px"
              height="60px"
              padding="0"
              backgroundColor="var(--color-main)"
              color="var(--color-black)"
              fontFamily="var(--font-noto)"
              fontSize="20px"
              fontWeight={800}
              borderRadius="var(--radius-base)"
              className={`active:scale-95 disabled:opacity-50`}
              onClick={handleGain}
              disabled={isCooldown || isPending} // ⬅️ 잔여시간 있으면 비활성화
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PointModal;
