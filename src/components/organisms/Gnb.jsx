"use client";

import Link from "next/link";
import React from "react";
import Navigation from "../molecules/Navigation";
import MobileNavigation from "../molecules/MobileNavigation";
import { usePathname } from "next/navigation";
import { PATHNAME } from "@/constants";

// 추가: 로그인 여부 감지 & 모달 컨테이너 마운트
import { useAuth } from "@/contexts/AuthContext";
import PointModalContainer from "@/components/molecules/PointModalContainer";

const GNB = () => {
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuth();

  const isLanding = pathname === PATHNAME.HOME;

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
      {/* 로그인 상태일 때, 어디서든 모달이 뜰 수 있도록 상단에서 컨테이너 마운트 */}
      {isAuthenticated && !loading && <PointModalContainer />}

      <div className="page-wrapper bg-black">
        <nav
          className={`w-full h-lg flex justify-between items-center bg-black 
                        ${
                          pathname === PATHNAME.HOME
                            ? "desktop:px-x-desktop"
                            : "desktop:px-x-tablet"
                        }
                        tablet:px-x-tablet
                        mobile:px-x-mobile`}
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
