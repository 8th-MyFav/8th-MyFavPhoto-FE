"use client";

import React from "react";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import { PATHNAME } from "@/constants";

const HomePage = () => {
  const router = useRouter();

  const handleFindFav = function (e) {
    e.preventDefault();
    router.push(PATHNAME.MARKET);
  };
  return (
    <div className="bg-black">
      <div>
        <main>
          <div>
            <div className="relative w-screen h-[68rem]">
              <img
                src="/images/hpMain001.svg"
                alt="메인 이미지"
                className="w-screen absolute bottom-0 z-10"
              />
              <div className="absolute top-0 left-0 right-0 z-20">
                <div className="flex justify-center">
                  <img
                    src="/images/favorite.svg"
                    alt="로고"
                    className="pt-[77px] pb-0 w-[138.945px]"
                  />
                </div>
                <div className="flex justify-center">
                  <div className="pt-[22.5px] leading-snug">
                    <h1 className="text-noto-xl font-bold text-white align-center text-center pb-[33px]">
                      구매하기 어려웠던
                      <br />
                      <span className="text-main text-bold text-noto-xl text-center">
                        나의 최애
                      </span>
                      가 여기에!
                    </h1>
                    <div className="flex justify-center transition hover:shadow-lg">
                      <Button
                        text="최애 찾으러 가기"
                        width="235px"
                        height="55px"
                        backgroundColor="var(--color-main)"
                        color="var(--color-black)"
                        fontSize="16px"
                        padding="0"
                        onClick={handleFindFav}
                        className="transition transform hover:scale-105"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2xs bottom-0 left-0 right-0 mt-[13px] mx-lg z-0">
                <div
                  className="w-full h-[1088px] rounded-[30px] bg-gradient-to-tr from-[#445b6d] via-[#3f3f3f]/80 to-[#75426b]
                  tablet:h-[722px] 
                  mobile:h-[412px] 
                  desktop:h-[1088px] 
                "
                />
              </div>
            </div>
            <div>
              <div className="pl-[428px] pt-[133px] pb-md">
                <h1 className="text-noto-lg font-bold text-white align-center">
                  포인트로
                  <span className="text-main text-bold text-noto-lg">
                    안전하게
                  </span>
                  거래하세요
                </h1>
                <p className="text-noto-xs text-white">
                  내 포토카드를 포인트로 팔고, 원하는 포토카드를
                </p>
                <p className="text-noto-xs text-white">
                  포인트로 안전하게 교환하세요
                </p>
                <img src="/images/hpMain002.svg" alt="배경" className="z-0" />
              </div>
              <div>
                <div className="pl-[428px] pt-[133px] pb-md">
                  <h1 className="text-noto-lg font-bold text-white align-center">
                    알림으로 보다
                    <span className="text-blue text-bold text-noto-lg">
                      빨라진 거래
                    </span>
                  </h1>
                  <p className="text-noto-xs text-white">
                    교환 제안부터 판매 완료까지,
                  </p>
                  <p className="text-noto-xs text-white">
                    실시간 알림으로 놓치지 마세요
                  </p>
                </div>
              </div>
              <img src="/images/hpMain003.png" alt="배경" className="z-0" />
            </div>
            <div>
              <div className="pl-[428px] pt-[133px] pb-md">
                <h1 className="text-noto-lg font-bold text-white align-center">
                  랜덤 상자로
                  <span className="text-main text-bold text-noto-lg">
                    포인트 받자! 🎉
                  </span>
                </h1>
                <p className="text-noto-xs text-white">
                  한 시간마다 주어지는 랜덤 상자를 열고,
                </p>
                <p className="text-noto-xs text-white">포인트를 획득하세요</p>
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
                <h1 className="text-noto-lg font-bold text-white align-center pb-[27px] text-center ">
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
                    className="transition transform hover:scale-105"
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
