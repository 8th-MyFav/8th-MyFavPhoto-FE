"use client";
import React, { useState } from "react";

const Dropdown = ({
  options = [],
  width = "fit-content",
  height = "24px",
  placeholder = "선택",
  padding = "8px",
  maxWidth = "300px",
  optionListMarginTop = "18px",
  optionListPadding = "10px 12px",
  customStyles = {},
  onChange = () => {},
}) => {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (opt) => {
    setSelected(opt);
    setIsOpen(false);
    onChange(opt);
  };

  return (
    <div
      className="relative rounded-[2px] cursor-pointer overflow-visible"
      style={{
        display: "inline-block",
        width,
        maxWidth,
        height,
        backgroundColor: "var(--black-black, #0F0F0F)",
        padding,
        ...customStyles.container,
      }}
    >
      {/* 선택 영역 */}
      <div
        className="flex items-center justify-between h-full"
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: "fit-content", ...customStyles.select }}
      >
        <span
          style={{
            color: "var(--gray-gray200, #DDD)",
            fontFamily: "Noto Sans KR",
            fontSize: "15px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "inline-block",
            ...customStyles.text,
          }}
        >
          {selected || placeholder}
        </span>
        <img
          src="/images/arrowDown.svg"
          alt="arrow"
          style={{
            width: "24px",
            height: "24px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            ...customStyles.arrow,
          }}
        />
      </div>

      {/* 옵션 리스트 */}
      {isOpen && (
        <ul
          className="absolute left-0 z-10 flex flex-col"
          style={{
            width: "fit-content",
            maxWidth,
            borderRadius: "2px",
            border: "1px solid var(--gray-gray200, #DDD)",
            background: "var(--black-black, #0F0F0F)",
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: optionListMarginTop,
            padding: optionListPadding,
            gap: "10px",
            ...customStyles.optionList,
          }}
        >
          {options.map((opt, index) => (
            <li
              key={index}
              className="cursor-pointer hover:opacity-80"
              onClick={() => handleSelect(opt)}
              style={{
                color: "var(--white-white, #FFF)",
                fontFamily: "Noto Sans KR",
                fontSize: "15px",
                fontWeight: 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-block",
                ...customStyles.option,
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
