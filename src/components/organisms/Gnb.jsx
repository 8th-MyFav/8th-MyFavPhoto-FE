"use client";

import Link from "next/link";
import React from "react";
import Navigation from "../molecules/Navigation";
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
      <div className="flex justify-center px-x-desktop bg-black">
        <nav className="w-full h-lg flex justify-between items-center bg-black">
          {/* 좌측 로고 */}
          <div className="flex items-center cursor-pointer">
            <Link href={PATHNAME.HOME}>
              <img
                src="/images/favorite.svg"
                alt="최애의 포토"
                className="w-[120px] h-auto"
              />
            </Link>
          </div>

          {/* 우측 메뉴 */}
          <div className="flex items-center gap-sm">
            <Navigation />
          </div>
        </nav>
      </div>
    </div>
  );
};

export default GNB;
