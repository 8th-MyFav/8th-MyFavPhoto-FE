"use client";
import React, { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import Button from "../atoms/button";
import PhotoCardSummary from "../molecules/PhotoCardSummary";
import { PATHNAME, PAGE_TITLE, BUTTON_TEXT } from "@/constants";

const PagesHeader = ({
  title, // 페이지 제목 (prop으로 전달되면 우선 사용, 없으면 pathname 기반 자동 결정)
  buttonText, // 버튼 텍스트
  buttonOnClick, // 버튼 클릭 핸들러 (prop으로 전달되면 우선 사용, 없으면 pathname 기반 자동 결정)
  showButton = true, // 버튼 표시 여부
  showPhotoCardSummary = false, // PhotoCardSummary 표시 여부
  ownerName = "",
  totalCount = 0,
  gradeCounts = {},
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // pathname에 따른 제목 매핑
  const getTitleByPathname = (path) => {
    if (path === PATHNAME.MARKET || path.startsWith(PATHNAME.MARKET + "/")) {
      return PAGE_TITLE.MARKET;
    }
    if (path === PATHNAME.MYGAL || path.startsWith(PATHNAME.MYGAL + "/")) {
      return PAGE_TITLE.MYGAL;
    }
    if (
      path === PATHNAME.MPSELLER ||
      path.startsWith(PATHNAME.MPSELLER + "/")
    ) {
      return PAGE_TITLE.MPSELLER;
    }
    return null; // 매핑되지 않은 경로는 null 반환
  };

  // pathname에 따른 버튼 텍스트 매핑
  const getButtonTextByPathname = (path) => {
    if (path === PATHNAME.MARKET || path.startsWith(PATHNAME.MARKET + "/")) {
      return BUTTON_TEXT.SELL_PHOTO;
    }
    if (path === PATHNAME.MYGAL || path.startsWith(PATHNAME.MYGAL + "/")) {
      return BUTTON_TEXT.CREATE_PHOTO;
    }
    if (
      path === PATHNAME.MPSELLER ||
      path.startsWith(PATHNAME.MPSELLER + "/")
    ) {
      return null; // 나의 판매 포토카드 페이지는 버튼 없음
    }
    return null; // 매핑되지 않은 경로는 null 반환
  };

  // 제목 결정: title prop이 있으면 우선 사용, 없으면 pathname 기반으로 결정
  const displayTitle = useMemo(() => {
    return title || getTitleByPathname(pathname) || "";
  }, [title, pathname]);

  // pathname에 따른 버튼 클릭 핸들러 매핑
  const getButtonClickByPathname = (path) => {
    if (path === PATHNAME.MARKET || path.startsWith(PATHNAME.MARKET + "/")) {
      return () => {
        // 마켓플레이스: 판매 모달 열기 등은 prop으로 처리
        // 기본 동작이 필요하면 여기에 추가
      };
    }
    if (path === PATHNAME.MYGAL || path.startsWith(PATHNAME.MYGAL + "/")) {
      return (e) => {
        e?.preventDefault();
        router.push(PATHNAME.CREATE);
      };
    }
    return null;
  };

  // 버튼 텍스트 결정: buttonText prop이 있으면 우선 사용, 없으면 pathname 기반으로 결정
  const displayButtonText = useMemo(() => {
    return buttonText || getButtonTextByPathname(pathname);
  }, [buttonText, pathname]);

  // 버튼 클릭 핸들러 결정: buttonOnClick prop이 있으면 우선 사용, 없으면 pathname 기반으로 결정
  const displayButtonOnClick = useMemo(() => {
    return buttonOnClick || getButtonClickByPathname(pathname);
  }, [buttonOnClick, pathname]);

  return (
    <div className="w-full">
      <div className="mb-xs pt-lg">
        <div className="flex justify-between items-center w-full border-b-[2px] border-gray-100 pb-xs">
          {/* 왼쪽 텍스트 */}
          <div className="flex items-center text-white text-br-3xl tracking-[-1.86px]">
            {displayTitle}
          </div>

          {/* 오른쪽 버튼 */}
          {showButton && displayButtonText && displayButtonOnClick && (
            <Button
              text={displayButtonText}
              width="440px"
              height="60px"
              padding="0"
              backgroundColor="var(--color-main)"
              color="var(--color-black)"
              onClick={displayButtonOnClick}
            />
          )}
        </div>
        {showPhotoCardSummary && (
          <PhotoCardSummary
            ownerName={ownerName}
            totalCount={totalCount}
            gradeCounts={gradeCounts}
          />
        )}
      </div>
    </div>
  );
};

export default PagesHeader;
