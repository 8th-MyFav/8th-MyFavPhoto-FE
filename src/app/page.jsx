"use client";

import React from "react";
import Button from "@/components/atoms/button";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  const handleFindFav = function (e) {
    e.preventDefault();
    router.push("/marketplace");
  };
  return (
    <div className="bg-[var(--color-black)]">
      <div>
        <main>
          <div>
            <div className="bg-[var(--color-black)]">
              <div className="flex justify-center">
                <img
                  src="/images/favorite.svg"
                  alt="로고"
                  className="absolute pt-[77px] pb-[22px] w-[138.945px] z-2"
                />
              </div>
              <div className="flex justify-center">
                <div className="absolute pt-[125px] leading-snug ">
                  <h1 className="text-[40px] font-bold text-white align-center text-center pb-[33px]">
                    구매하기 어려웠던
                    <br />
                    <span className="text-[var(--color-main)] text-bold text-[40px] text-center">
                      나의 최애
                    </span>
                    가 여기에!
                  </h1>
                  <div className="flex justify-center">
                    <Button
                      text="최애 찾으러 가기"
                      width="235px"
                      height="55px"
                      backgroundColor="var(--color-main)"
                      color="var(--color-black)"
                      fontSize="16px"
                      padding="0"
                      onClick={handleFindFav}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[30px]">
              <img
                src="/images/hpMain001.svg"
                alt="배경"
                className="z-0 w-screen"
              />
            </div>
            <div>
              <div className="pl-[428px] pt-[133px] pb-[40px]">
                <h1 className="text-[40px] font-bold text-white align-center">
                  포인트로
                  <span className="text-[var(--color-main)] text-bold text-[36px]">
                    안전하게
                  </span>
                  거래하세요
                </h1>
                <p className="text[18px] text-white">
                  내 포토카드를 포인트로 팔고, 원하는 포토카드를
                </p>
                <p className="text[18px] text-white">
                  포인트로 안전하게 교환하세요
                </p>
                <img src="/images/hpMain002.svg" alt="배경" className="z-0" />
              </div>
              <div>
                <div className="pl-[428px] pt-[133px] pb-[40px]">
                  <h1 className="text-[36px] font-bold text-white align-center">
                    알림으로 보다
                    <span className="text-[var(--color-blue)] text-bold text-[36px]">
                      빨라진 거래
                    </span>
                  </h1>
                  <p className="text[18px] text-white">
                    교환 제안부터 판매 완료까지,
                  </p>
                  <p className="text[18px] text-white">
                    실시간 알림으로 놓치지 마세요
                  </p>
                </div>
              </div>
              <img src="/images/hpMain003.png" alt="배경" className="z-0" />
            </div>
            <div>
              <div className="pl-[428px] pt-[133px] pb-[40px]">
                <h1 className="text-[36px] font-bold text-white align-center">
                  랜덤 상자로
                  <span className="text-[var(--color-main)] text-bold text-[36px]">
                    포인트 받자! 🎉
                  </span>
                </h1>
                <p className="text[18px] text-white">
                  한 시간마다 주어지는 랜덤 상자를 열고,
                </p>
                <p className="text[18px] text-white">포인트를 획득하세요</p>
              </div>
              <img src="/images/hpMain004.svg" alt="배경" className="z-0" />
            </div>
            <div className="flex justify-center">
              <div className="pt-[113px] text-center">
                <img
                  src="/images/hpMain005.svg"
                  alt="배경"
                  className="pb-[27px] mx-auto"
                />
                <h1 className="text-[36px] font-bold text-white align-center pb-[27px] text-center ">
                  나의 최애를 지금 찾아보세요!
                </h1>
                <div className="flex justify-center pb-[161px]">
                  <Button
                    text="최애 찾으러 가기"
                    width="226px"
                    height="55px"
                    backgroundColor="var(--color-main)"
                    color="var(--color-black)"
                    fontSize="16px"
                    padding="0"
                    onClick={handleFindFav}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
