"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SearchMolecule from "../molecules/Search";
import Dropdown from "../molecules/DropDown";
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
    <div className="page-wrapper">
      {/* 검색 + 필터 + 정렬 */}
      <div
        className={`flex justify-between items-center ${
          showSortDropdown ? "mt-5" : "mt-xs"
        } w-full`}
      >
        <div className="flex items-center">
          <div className="mr-lg">
            <SearchMolecule
              onSearch={onSearchChange}
              onSearchSubmit={onSearchSubmit || onSearchChange}
            />
          </div>
          <div className="flex gap-[45px]">
            <Dropdown
              placeholder="등급"
              options={[
                GRADE.COMMON,
                GRADE.RARE,
                GRADE.SUPER_RARE,
                GRADE.LEGENDARY,
              ]}
              onChange={onRarityChange}
            />
            <Dropdown
              placeholder="장르"
              options={categoryOptions}
              onChange={onCategoryChange}
            />
            {showSaleTypeFilter && (
                  <Dropdown
                  placeholder="판매형태"
                  options={["판매", "교환"]}
                  onChange={onSaleTypeChange} // ✅ 수정됨
                />
              )}
            {showStatusFilter && (
              <Dropdown
                placeholder="매진여부"
                options={["판매중", "매진"]}
                onChange={onStatusChange}
              />
            )}
          </div>
        </div>

        {showSortDropdown && (
          <Dropdown
            placeholder="낮은 가격순"
            options={["낮은 가격순", "높은 가격순", "최신순"]}
            height="50px"
            width="123px"
            onChange={onSortOrderChange}
            customStyles={{
              container: { border: "1px solid #FFF", padding: "12px" },
              optionList: { padding: "10px 24px" },
            }}
          />
        )}
      </div>

      {/* 카드 리스트 */}
      {cards.length > 0 ? (
        <div className={cardGridClass}>
          {cards.map((card, index) => {
            const alignmentClasses = [
              "justify-self-start",
              "justify-self-center",
              "justify-self-end",
            ];
            const alignmentClass = alignmentClasses[index % 3];
            const clickableClass =
              onCardClick || card?.id ? "cursor-pointer" : "";

            return (
              <div
                key={card.id ? `${card.id}-${index}` : `card-${index}`}
                ref={index === cards.length - 1 ? lastCardRef : null}
                onClick={() => handleCardClick(card)}
                className={`${alignmentClass} ${clickableClass}`.trim()}
              >
                <Card {...card} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)] text-center text-gray-300 text-noto-xs">
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
