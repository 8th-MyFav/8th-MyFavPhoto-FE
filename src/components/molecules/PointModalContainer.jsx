"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePoints, useGainPoints } from "@/api/pointAPI";
import { useQueryClient } from "@tanstack/react-query";
import PointModal from "@/components/molecules/PointModal";

const PointModalContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [earned, setEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0); // 초 단위

  const queryClient = useQueryClient();
  const { data: points, isLoading } = usePoints();
  const { mutate: gainPoints, isPending } = useGainPoints();

  // 마지막 획득 시각 기준으로 남은 쿨타임 계산
  useEffect(() => {
    if (!points) return;

    // 아직 한 번도 포인트를 받지 않은 경우 즉시 가능
    if (!points.lastRandomPointAt) {
      setTimeLeft(0);
      return;
    }

    const last = new Date(points.lastRandomPointAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - last) / 1000);
    const remaining = Math.max(3600 - elapsed, 0);
    setTimeLeft(remaining);
  }, [points]);

  // ✅ 페이지 진입 시 쿨타임이 0일 때만 자동으로 모달 열기
  useEffect(() => {
    if (!points) return;

    if (timeLeft > 0) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
  }, [timeLeft]);

  // 1초씩 감소 타이머
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 쿨타임이 끝나는 순간 자동 재오픈
  useEffect(() => {
    if (timeLeft === 0) {
      setIsOpen(true);
      setSelectedBox(null);
      setIsConfirmed(false);
    }
  }, [timeLeft]);

  const minutes = useMemo(() => Math.floor(timeLeft / 60), [timeLeft]);
  const seconds = useMemo(() => timeLeft % 60, [timeLeft]);
  const isCooldown = timeLeft > 0;

  // 포인트 뽑기
  const handleGain = () => {
    if (isCooldown) return; // 쿨타임 중 방지
    if (selectedBox === null || isPending) return;

    const randomPoint = Math.floor(Math.random() * 91) + 10; // 10~100 랜덤 포인트
    gainPoints(randomPoint, {
      onSuccess: () => {
        setEarned(randomPoint);
        setIsConfirmed(true);
        queryClient.invalidateQueries({ queryKey: ["points"] });
        setTimeLeft(3600); // 다음 쿨타임 1시간
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
      {/* 남은 쿨타임 표시 */}
      {timeLeft > 0 && (
        <div className="fixed bottom-10 right-10 text-white text-sm opacity-70">
          다음 포인트까지 {minutes}분 {seconds}초
        </div>
      )}

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
        isCooldown={isCooldown}
        boxImages={boxImages}
      />
    </>
  );
};

export default PointModalContainer;
