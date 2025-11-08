"use client";

import React, { useEffect, useState } from "react";
import { usePoints, useGainPoints } from "@/api/pointAPI";
import { useQueryClient } from "@tanstack/react-query";
import PointModal from "@/components/molecules/PointModal";

const PointModalContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const queryClient = useQueryClient();
  const { data: points, isLoading } = usePoints();
  const { mutate: gainPoints, isPending } = useGainPoints();

  //  1. 남은 시간 계산
  useEffect(() => {
    if (!points?.lastRandomPointAt) return;

    const lastTime = new Date(points.lastRandomPointAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - lastTime) / 1000);
    const remaining = Math.max(3600 - elapsed, 0);
    setTimeLeft(remaining);

    //  2. 시간이 다 됐으면 자동으로 모달 열기
    if (remaining === 0) {
      setIsOpen(true);
    }
  }, [points]);

  //  3. 타이머 1초씩 감소
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  //  4. 포인트 뽑기
  const handleGain = () => {
    if (selectedBox === null || isPending) return;

    const randomPoint = Math.floor(Math.random() * 91) + 10;
    gainPoints(randomPoint, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["points"] });
        setEarned(randomPoint);
        setIsConfirmed(true);
        setIsOpen(false);
      },
    });
  };

  const boxImages = [
    "/images/random_box-1.svg",
    "/images/random_box-2.svg",
    "/images/random_box-3.svg",
  ];

  if (isLoading) return null;

  return (
    <>
      {/* 쿨타임 남았을 때 하단 알림 */}
      {timeLeft > 0 && (
        <div className="fixed bottom-10 right-10 text-white text-sm opacity-70">
          다음 포인트까지 {minutes}분 {seconds}초
        </div>
      )}

      {/* 모달 */}
      <PointModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        isConfirmed={isConfirmed}
        selectedBox={selectedBox}
        setSelectedBox={setSelectedBox}
        earned={earned}
        handleGain={handleGain}
        isPending={isPending}
        minutes={minutes}
        seconds={seconds}
        boxImages={boxImages}
      />
    </>
  );
};

export default PointModalContainer;
