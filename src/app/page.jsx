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
      <div className="page-wrapper">
        <main>
          <div>
            <div
              className="relative w-full  
                        mobile:h-[412px] tablet:h-[722px] desktop:h-[1088px] "
            >
              <img
                src="/images/hpMain001.svg"
                alt="메인 이미지"
                className="w-full absolute bottom-0 z-10
                mobile:h-[199px] tablet:h-[352px] desktop:h-[765px] "
              />
              <div className="absolute top-0 left-0 right-0 z-20">
                <div className="flex justify-center">
                  <img
                    src="/images/favorite.svg"
                    alt="로고"
                    className="pt-[77px] pb-0 w-[138.945px] mobile:hidden tablet:block desktop:block"
                  />
                </div>
                <div className="flex justify-center">
                  <div className="leading-snug">
                    <h1
                      className="font-bold text-white align-center text-center
                        mobile:text-noto-sm mobile:pt-[49px] mobile:pb-[24px] 
                        tablet:text-noto-xl tablet:pt-[22.8px] tablet:pb-[38px]
                        desktop:text-noto-xl desktop:pt-[22.8px] desktop:pb-[33px] "
                    >
                      구매하기 어려웠던
                      <br />
                      <span
                        className="text-main text-bold text-center
                      mobile:text-noto-sm tablet:text-noto-xl desktop:text-noto-xl"
                      >
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
                        className="transition transform hover:scale-105 mobile:hidden tablet:hidden desktop:block"
                      />
                      <Button
                        text="최애 찾으러 가기"
                        width="226px"
                        height="55px"
                        backgroundColor="var(--color-main)"
                        color="var(--color-black)"
                        fontSize="16px"
                        padding="0"
                        onClick={handleFindFav}
                        className="transition transform hover:scale-105 mobile:hidden tablet:block desktop:hidden text-white"
                      />
                      <Button
                        text="최애 찾으러 가기"
                        width="150px"
                        height="40px"
                        backgroundColor="var(--color-main)"
                        color="var(--color-black)"
                        fontSize="16px"
                        padding="0"
                        onClick={handleFindFav}
                        className="transition transform hover:scale-105 mobile:block tablet:hidden desktop:hidden text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-2xs bottom-0 left-0 right-0 mt-[13px] mx-lg z-0">
                <div
                  className="w-full 
                    mobile:h-[412px] tablet:h-[722px] desktop:h-[1088px] 
                    rounded-[30px] bg-gradient-to-tr from-[#445b6d] via-[#3f3f3f]/80 to-[#75426b]"
                />
              </div>
            </div>
            <div>
              <div
                className="pt-[133px] pb-md
                  mobile:pl-[32px]
                  tablet:pl-[61px]
                  desktop:pl-[428px]"
              >
                <h1
                  className="text-noto-lg font-bold text-white align-center
                    mobile:text-noto-sm   
                    tablet:text-noto-lg 
                    desktop:text-noto-lg "
                >
                  포인트로
                  <span className="text-main text-bold mx-2xs">안전하게</span>
                  거래하세요
                </h1>
                <div
                  className="mobile:text-noto-3xs   
                    tablet:text-noto-xs 
                    desktop:text-noto-xs "
                >
                  <p className="text-noto-xs text-white">
                    내 포토카드를 포인트로 팔고, 원하는 포토카드를
                  </p>
                  <p className="text-noto-xs text-white">
                    포인트로 안전하게 교환하세요
                  </p>
                </div>
                <img src="/images/hpMain002.svg" alt="배경" className="z-0" />
              </div>
              <div>
                <div
                  className="pt-[133px] pb-md
                    mobile:pl-[32px]
                    tablet:pl-[61px]
                    desktop:pl-[428px]"
                >
                  <h1
                    className="text-noto-lg font-bold text-white align-center 
                    mobile:text-noto-sm   
                    tablet:text-noto-lg 
                    desktop:text-noto-lg "
                  >
                    알림으로 보다
                    <span className="text-blue text-bold mx-2xs">
                      빨라진 거래
                    </span>
                  </h1>
                  <div
                    className="mobile:text-noto-3xs   
                    tablet:text-noto-xs 
                    desktop:text-noto-xs "
                  >
                    <p className="text-noto-xs text-white">
                      교환 제안부터 판매 완료까지,
                    </p>
                    <p className="text-noto-xs text-white">
                      실시간 알림으로 놓치지 마세요
                    </p>
                  </div>
                </div>
              </div>
              <img src="/images/hpMain003.png" alt="배경" className="z-0" />
            </div>
            <div>
              <div
                className="pt-[133px] pb-md
              mobile:pl-[32px]
              tablet:pl-[61px]
              desktop:pl-[428px]"
              >
                <h1
                  className="text-noto-lg font-bold text-white align-center 
                    mobile:text-noto-sm   
                    tablet:text-noto-lg 
                    desktop:text-noto-lg "
                >
                  랜덤 상자로
                  <span className="text-main text-bold mx-2xs">
                    포인트 받자! 🎉
                  </span>
                </h1>
                <div
                  className="mobile:text-noto-3xs   
                    tablet:text-noto-xs 
                    desktop:text-noto-xs "
                >
                  <p className="text-noto-xs text-white">
                    한 시간마다 주어지는 랜덤 상자를 열고,
                  </p>
                  <p className="text-noto-xs text-white">포인트를 획득하세요</p>
                </div>
              </div>
              <img
                src="/images/hpMain004.svg"
                alt="배경"
                className="z-0 w-full mobile:hidden tablet:hidden desktop:block "
              />
              <img
                src="/images/hpMain004t.svg"
                alt="배경"
                className="z-0 w-full mobile:hidden tablet:block desktop:hidden "
              />
              <img
                src="/images/hpMain004m.svg"
                alt="배경"
                className="z-0 w-full mobile:block tablet:hidden desktop:hidden "
              />
            </div>
            <div className="flex justify-center">
              <div className="pt-[113px] text-center">
                <img
                  src="/images/hpMain005.svg"
                  alt="배경"
                  className="pb-[27px] mx-auto"
                />
                <h1
                  className="text-noto-lg font-bold text-white align-center pb-[27px] text-center 
                    mobile:text-noto-sm   
                    tablet:text-noto-lg 
                    desktop:text-noto-lg "
                >
                  나의 최애를 지금 찾아보세요!
                </h1>
                <div className="flex justify-center pb-[161px]">
                  <Button
                    text="최애 찾으러 가기"
                    width="235px"
                    height="55px"
                    backgroundColor="var(--color-main)"
                    color="var(--color-black)"
                    fontSize="16px"
                    padding="0"
                    onClick={handleFindFav}
                    className="transition transform hover:scale-105 mobile:hidden tablet:hidden desktop:block"
                  />
                  <Button
                    text="최애 찾으러 가기"
                    width="226px"
                    height="55px"
                    backgroundColor="var(--color-main)"
                    color="var(--color-black)"
                    fontSize="16px"
                    padding="0"
                    onClick={handleFindFav}
                    className="transition transform hover:scale-105 mobile:hidden tablet:block desktop:hidden text-white"
                  />
                  <Button
                    text="최애 찾으러 가기"
                    width="150px"
                    height="40px"
                    backgroundColor="var(--color-main)"
                    color="var(--color-black)"
                    fontSize="16px"
                    padding="0"
                    onClick={handleFindFav}
                    className="transition transform hover:scale-105 mobile:block tablet:hidden desktop:hidden text-white"
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
