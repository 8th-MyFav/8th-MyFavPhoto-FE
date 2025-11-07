// components/molecules/pointModal.jsx
"use client";

import React, { useEffect, useState } from "react";
import { usePoints, useGainPoints } from "@/api/pointAPI";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@/components/atoms/Button";

const PointModal = ({
  title1 = "랜덤",
  title2 = "포인트",
  buttonText = "선택완료",
  onClose,
}) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [earned, setEarned] = useState(0); // 이번에 획득한 포인트(로컬)
  const [timeLeft, setTimeLeft] = useState(3600);

  const queryClient = useQueryClient();
  const { data: points, isLoading } = usePoints();
  const { mutate: gainPoints, isPending } = useGainPoints();

  useEffect(() => {
    if (timeLeft <= 0) {
      setSelectedBox(null);
      setIsConfirmed(false);
      setEarned(0);
      setTimeLeft(3600);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleBoxClick = (index) => {
    if (isConfirmed || isPending) return;
    setSelectedBox(index);
  };

  const handleGain = () => {
    if (selectedBox === null || isPending) return;

    const randomPoint = Math.floor(Math.random() * 91) + 10;

    gainPoints(randomPoint, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["points"] });
      },
    });

    setEarned(randomPoint); // UI 즉시 반영
    setIsConfirmed(true);
  };

  const boxImages = [
    "/images/random_box-1.svg",
    "/images/random_box-2.svg",
    "/images/random_box-3.svg",
  ];

  if (isLoading) return <div>로딩중...</div>;

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
              <div className="flex justify-center items-center gap-[60px]">
                {boxImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`선물상자 ${index + 1}`}
                    onClick={() => handleBoxClick(index)}
                    className={`transition-all cursor-pointer rounded-md ${
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
                    } ${isPending ? "pointer-events-none" : ""}`}
                    style={{
                      imageRendering: "crisp-edges",
                      backfaceVisibility: "hidden",
                    }}
                  />
                ))}
              </div>
            </>
          ) : (
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

        {/* 선택완료 - 상자 선택 시 노출 */}
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
              className={`active:scale-95 disabled:opacity-50 ${
                isPending ? "pointer-events-none" : ""
              }`}
              onClick={handleGain}
            />
          </div>
        )}

        {isConfirmed && (
          <div className="absolute bottom-[73px] text-[16px]">
            <div className="flex items-center justify-center gap-[10px]">
              <p className="text-gray-300 text-center">
                다음 기회까지 남은 시간
              </p>
              <p className="text-main text-center">
                {minutes}분 {seconds}초
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointModal;
