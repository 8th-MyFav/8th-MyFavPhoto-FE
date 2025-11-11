"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SearchMolecule from "../molecules/Search";
import Dropdown, { SortDropdown } from "../molecules/DropDown";
import Card from "./Card";
import { GRADE } from "@/constants";

const CardSearchContainer = ({
  // 검색/필터 상태
  searchText = "",
  selectedRarity = "",
  selectedCategory = "",
  selectedStatus = "",
  selectedSaleType = "", // ✅ 추가
  sortOrder = "낮은 가격순",
  // 필터 옵션
  showStatusFilter = true, // 매진여부 필터 표시 여부
  showSortDropdown = true, // 정렬 드롭다운 표시 여부
  showSaleTypeFilter = false, // ✅ 추가
  categoryOptions = ["풍경", "인물", "동물", "추상"], // 장르/카테고리 옵션
  // 핸들러
  onSearchChange,
  onSearchSubmit,
  onRarityChange,
  onCategoryChange,
  onStatusChange,
  onSortOrderChange,
  onSaleTypeChange, // ✅ 추가
  // 카드 리스트
  cards = [],
  onCardClick, // 외부에서 핸들러를 전달할 수도 있음
  lastCardRef,
  // 레이아웃 옵션
  cardGridClass = "card-grid grid grid-cols-3 gap-x-xl gap-y-xl mt-xl", // 카드 그리드 클래스
  emptyMessage = "조건에 맞는 포토카드가 없습니다.", // 빈 리스트 메시지
  // 페이지네이션
  showPagination = false,
  paginationComponent,
}) => {
  const router = useRouter();

  // 카드 클릭 핸들러
  const handleCardClick = (card) => {
    if (onCardClick) {
      onCardClick(card); // 외부 핸들러 있을 경우 우선 실행
    } else if (card?.id) {
      router.push(`/marketplace/${card.id}`); // 상세페이지로 이동
    }
  };

  return (
    <div className="page-wrapper px-4 tablet:px-8 desktop:px-16">
      {/* 검색 + 필터 + 정렬 */}
      <div
        className={`flex flex-col desktop:flex-row justify-between items-center ${
          showSortDropdown ? "mt-5" : "mt-xs"
        } w-full`}
      >
        {/* 검색 및 드롭다운 묶음 */}
        <div className="flex flex-col w-full desktop:flex-row desktop:items-center">
          {/* ✅ 검색창: 모바일/태블릿에서는 전체폭 */}
          <div className="w-full desktop:w-auto">
            <SearchMolecule
              onSearch={onSearchChange}
              onSearchSubmit={onSearchSubmit || onSearchChange}
            />
          </div>

          {/* ✅ 드롭다운: 모바일/태블릿에서는 검색창 아래 한 줄에 표시 */}
          <div
            className="
              w-full mt-4
              flex flex-nowrap overflow-x-auto
              gap-3
              tablet:gap-4
              desktop:flex desktop:flex-nowrap desktop:overflow-visible desktop:mt-0 desktop:gap-[45px]
              ml-0 desktop:ml-30
            "
          >
            <Dropdown
            className="text-[9px] tablet:text-[14px] desktop:text-[16px] leading-tight"
              placeholder="등급"
              enableReset
              resetLabel="전체 등급"
              resetValue=""
              options={[
                GRADE.COMMON,
                GRADE.RARE,
                GRADE.SUPER_RARE,
                GRADE.LEGENDARY,
              ]}
              onChange={onRarityChange}
            />
            <Dropdown
            className="text-[9px] tablet:text-[14px] desktop:text-[16px] leading-tight"
              placeholder="장르"
              enableReset
              resetLabel="전체 장르"
              resetValue=""
              options={categoryOptions}
              onChange={onCategoryChange}
            />
            {showSaleTypeFilter && (
              <Dropdown
              className="text-[9px] tablet:text-[14px] desktop:text-[16px] leading-tight"
                placeholder="판매형태"
                enableReset
                resetLabel="전체 판매형태"
                resetValue=""
                options={["판매", "교환"]}
                onChange={onSaleTypeChange}
              />
            )}
            {showStatusFilter && (
              <Dropdown
              className="text-[9px] tablet:text-[14px] desktop:text-[16px] leading-tight"
                placeholder="매진여부"
                enableReset
                resetLabel="전체 매진여부"
                resetValue=""
                options={["판매중", "매진"]}
                onChange={onStatusChange}
              />
            )}
          </div>
        </div>

        {showSortDropdown && (
          <div className="hidden tablet:hidden desktop:block">
            <SortDropdown onChange={onSortOrderChange} />
          </div>
        )}
      </div>

      {/* 카드 리스트: mobile/tablet = 2열, desktop = 3열 */}
      {cards.length > 0 ? (
        <div
          className={`
            grid gap-y-6 gap-x-6 mt-8
            mobile:grid-cols-2    /* 모바일: 2열 (요구: 2x8) */
            tablet:grid-cols-2    /* 태블릿: 2열 */
            desktop:grid-cols-3   /* 데스크탑: 3열 */
            justify-items-stretch
          `}
        >
          {cards.map((card, index) => (
            <div
              key={card.id ? `${card.id}-${index}` : `card-${index}`}
              ref={index === cards.length - 1 ? lastCardRef : null}
              onClick={() => handleCardClick(card)}
              className="w-full cursor-pointer" /* 칼럼폭에 맞게 카드가 줄어들도록 핵심: w-full */
            >
              <div className="flex justify-center">
                {/* Card 내부는 w-full을 기준으로 스케일 됨 */}
                <Card {...card} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)] text-center text-gray-300 text-noto-xs mt-8">
          {emptyMessage}
        </div>
      )}

      {/* 페이지네이션 */}
      {showPagination && paginationComponent && (
        <div className="flex justify-center items-center gap-4 mt-[24px]">
          {paginationComponent}
        </div>
      )}
    </div>
  );
};

export default CardSearchContainer;
