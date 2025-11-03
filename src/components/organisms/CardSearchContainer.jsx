"use client";

import React from "react";
import SearchMolecule from "../molecules/search";
import Dropdown from "../molecules/dropDown";
import Card from "./card";
import { GRADE } from "@/constants";

const CardSearchContainer = ({
  // 검색/필터 상태
  searchText = "",
  selectedRarity = "",
  selectedCategory = "",
  selectedStatus = "",
  sortOrder = "낮은 가격순",
  // 필터 옵션
  showStatusFilter = true, // 매진여부 필터 표시 여부
  showSortDropdown = true, // 정렬 드롭다운 표시 여부
  categoryOptions = ["풍경", "인물", "동물", "추상"], // 장르/카테고리 옵션
  // 핸들러
  onSearchChange,
  onRarityChange,
  onCategoryChange,
  onStatusChange,
  onSortOrderChange,
  // 카드 리스트
  cards = [],
  onCardClick,
  lastCardRef,
  // 레이아웃 옵션
  cardGridClass = "grid grid-cols-3 gap-x-[80px] gap-y-[80px] mt-[80px]", // 카드 그리드 클래스
  emptyMessage = "조건에 맞는 포토카드가 없습니다.", // 빈 리스트 메시지
  // 페이지네이션
  showPagination = false,
  paginationComponent,
}) => {
  return (
    <>
      {/* 검색 + 필터 + 정렬 */}
      <div
        className={`flex justify-between items-center ${
          showSortDropdown ? "mt-5" : "mt-xs"
        } w-full`}
      >
        <div className="flex items-center">
          <div className="mr-lg">
            <SearchMolecule onSearch={onSearchChange} />
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
      <div className={cardGridClass}>
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <div
              key={index}
              ref={index === cards.length - 1 ? lastCardRef : null}
              onClick={() => onCardClick && onCardClick(index)}
              className={onCardClick ? "cursor-pointer" : ""}
            >
              <Card {...card} />
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-300 text-noto-xs mt-3xl">
            {emptyMessage}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {showPagination && paginationComponent && (
        <div className="flex justify-center items-center gap-4 mt-[24px]">
          {paginationComponent}
        </div>
      )}
    </>
  );
};

export default CardSearchContainer;
