"use client";
import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({
  options = [],
  width = "520px",
  height = "60px",
  placeholder = "선택해주세요",
  customStyles = {},
  onChange = () => {},
}) => {
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  //  외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  //  선택 시 동작
  const handleSelect = (opt) => {
    setSelected(opt);
    setIsOpen(false);
    onChange(opt);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative cursor-pointer select-none"
      style={{
        width,
        height,
        border: "1px solid #DDD",
        borderRadius: "2px",
        backgroundColor: "#0F0F0F",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        ...customStyles.container,
      }}
    >
      {/* 선택 텍스트 */}
      <span
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          color: selected ? "#FFF" : "#DDD",
          fontSize: "15px",
          fontFamily: "Noto Sans KR",
          fontWeight: selected ? 600 : 400,
          letterSpacing: "-0.3px",
          textAlign: "left",
          width: "100%",
          userSelect: "none",
          ...customStyles.text,
        }}
      >
        {selected || placeholder}
      </span>

      {/* 화살표 */}
      <img
        src="/images/arrowDown.svg"
        alt="arrow"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "20px",
          height: "20px",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.2s ease",
          flexShrink: 0,
          marginLeft: "8px",
          ...customStyles.arrow,
        }}
      />

      {/* 옵션 리스트 */}
      {isOpen && (
        <ul
          className="absolute left-0 z-10 flex flex-col"
          style={{
            top: "100%",
            marginTop: "8px",
            width: "100%",
            borderRadius: "2px",
            border: "1px solid #DDD",
            background: "#0F0F0F",
            maxHeight: "200px",
            overflowY: "auto",
            padding: "8px 0",
            ...customStyles.optionList,
          }}
        >
          {options.map((opt, index) => (
            <li
              key={index}
              onClick={() => handleSelect(opt)}
              className="hover:opacity-80"
              style={{
                padding: "8px 20px",
                color: "#FFF",
                fontSize: "15px",
                fontFamily: "Noto Sans KR",
                fontWeight: 400,
                textAlign: "left",
                whiteSpace: "nowrap",
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
