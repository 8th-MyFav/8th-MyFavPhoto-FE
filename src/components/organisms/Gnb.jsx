"use client";

import Link from "next/link";
import React from "react";
import Navigation from "../molecules/Navigation";
import MobileNavigation from "../molecules/MobileNavigation";
import { usePathname } from "next/navigation";
import { PATHNAME } from "@/constants";

const GNB = () => {
  const pathname = usePathname();

  // 숨길 페이지 경로
  const hidePagePathname = [PATHNAME.LOGIN, PATHNAME.JOIN];

  // 숨김 여부 판별 함수
  const hideGNBpathname = (pathname) => {
    return hidePagePathname.includes(pathname);
  };

  // 현재 pathname이 숨김 목록에 포함되면 GNB 렌더링 안함
  if (hideGNBpathname(pathname)) {
    return null;
  }

  return (
    <div className="bg-black">
      <div className="page-wrapper bg-black">
        <nav
          className="w-full h-lg flex justify-between items-center bg-black 
                        desktop:px-x-tablet
                        tablet:px-x-tablet
                        mobile:px-x-mobile"
        >
          {/* 좌측 로고 (모바일에서는 숨김) */}
          <div className="hidden tablet:flex desktop:flex items-center cursor-pointer">
            <Link href={PATHNAME.HOME}>
              <img
                src="/images/favorite.svg"
                alt="최애의 포토"
                className="w-[120px] h-auto"
              />
            </Link>
          </div>

          {/* 데스크탑 & 태블릿 메뉴 */}
          <div className="hidden tablet:flex desktop:flex items-center gap-sm ml-auto">
            <Navigation />
          </div>

          {/* 모바일 메뉴 */}
          <div className="flex w-full tablet:hidden desktop:hidden">
            <MobileNavigation />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default GNB;
