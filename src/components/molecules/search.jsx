"use client";

import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (onSearch) onSearch(value);
  };

  return (
    <div
      className="w-[320px] rounded-[2px] border"
      style={{
        borderColor: "var(--gray-gray200, #DDD)",
        backgroundColor: "var(--black-black, #0F0F0F)",
        padding: "13px 20px",
      }}
    >
      <div className="flex items-center w-full gap-2">
        {/* 검색 input */}
        <input
          type="text"
          value={searchText}
          onChange={handleChange}
          placeholder="검색"
          className="flex-1 bg-transparent border-none outline-none"
          style={{
            color: searchText
              ? "var(--white-white, #FFF)"
              : "var(--gray-gray200, #DDD)",
            fontFamily: '"Noto Sans KR"',
            fontSize: "16px",
            fontWeight: searchText ? 400 : 300,
          }}
        />

        {/* 돋보기 아이콘 */}
        <img
          src="/images/search.svg"
          alt="searchIcon"
          className="w-[24px] h-[24px] cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Search;
