"use client";
import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({
  options = [],
  width = "fit-content",
  height = "24px",
  placeholder = "선택",
  padding = "8px",
  maxWidth = "300px",
  optionListMarginTop = "18px",
  optionListPadding = "10px 12px",
  optionListWidth = "fit-content",
  arrowSpacing = "12px",
  enableReset = false,
  resetLabel = "전체",
  resetValue = "",
  customStyles = {},
  onChange = () => {},
  value,
  defaultValue,
  disabled = false,
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultValue ?? "");
  const selectedValue = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (disabled) {
      setIsOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (!isControlled && defaultValue !== undefined) {
      setInternalSelected(defaultValue);
    }
  }, [defaultValue, isControlled]);

  const handleSelect = (displayValue, payloadValue = displayValue) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalSelected(displayValue);
    }
    setIsOpen(false);
    onChange(payloadValue);
  };

  const computedArrowSpacing =
    arrowSpacing === "justify-content" ? "auto" : arrowSpacing;

  const renderResetOption = enableReset && !disabled;

  return (
    <div
      className={`relative rounded-[2px] overflow-visible ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
      ref={dropdownRef}
      style={{
        width,
        height,
        backgroundColor: "var(--black-black, #0F0F0F)",
        padding,
        userSelect: "none",
        ...customStyles.container,
      }}
    >
      {/* 선택 영역 */}
      <div
        className="flex items-center justify-between h-full"
        onClick={() => {
          if (disabled) return;
          setIsOpen((prev) => !prev);
        }}
        style={{ width: "100%", ...customStyles.select }}
      >
        <span
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            color: selectedValue ? "#FFF" : "var(--gray-gray200, #DDD)",
            fontFamily: "Noto Sans KR",
            fontSize: "15px",
            fontWeight: selectedValue ? 600 : 700,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            ...customStyles.text,
          }}
        >
          {selectedValue || placeholder}
        </span>
        <img
          src="/images/arrowDown.svg"
          alt="arrow"
          style={{
            width: "24px",
            height: "24px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            marginLeft: computedArrowSpacing,
            ...customStyles.arrow,
          }}
        />
      </div>

      {/* 옵션 리스트 */}
      {isOpen && (
        <ul
          className="absolute left-0 z-10 flex flex-col"
          style={{
            width: optionListWidth === "100%" ? "100%" : optionListWidth,
            maxWidth,
            borderRadius: "2px",
            border: "1px solid #DDD",
            background: "#0F0F0F",
            maxHeight: "200px",
            overflowY: "auto",
            padding: "8px 0",
            ...customStyles.optionList,
          }}
        >
          {renderResetOption && (
            <li
              key="reset-option"
              className="cursor-pointer hover:opacity-80"
              onClick={() =>
                handleSelect(resetLabel ?? placeholder, resetValue)
              }
              style={{
                width: optionListWidth === "100%" ? "100%" : "auto",
                color: "var(--white-white, #FFF)",
                fontFamily: "Noto Sans KR",
                fontSize: "15px",
                fontWeight:
                  selectedValue === (resetLabel ?? placeholder) ? 600 : 400,
                textAlign: "left",
                whiteSpace: "nowrap",
                ...customStyles.option,
                ...(selectedValue === (resetLabel ?? placeholder)
                  ? customStyles.selectedOption
                  : {}),
              }}
            >
              {resetLabel ?? placeholder}
            </li>
          )}
          {options.map((opt, index) => {
            const isObjectOption = typeof opt === "object" && opt !== null;
            const optionLabel = isObjectOption
              ? opt.label ?? String(opt.value ?? opt.display ?? "")
              : opt;
            const optionValue = isObjectOption
              ? opt.value ?? opt.label ?? opt.display ?? optionLabel
              : opt;
            const isSelected = selectedValue === optionLabel;

            return (
              <li
                key={
                  isObjectOption
                    ? optionValue ?? optionLabel ?? index
                    : opt ?? index
                }
                className="cursor-pointer hover:opacity-80"
                onClick={() => handleSelect(optionLabel, optionValue)}
                style={{
                  width: optionListWidth === "100%" ? "100%" : "auto",
                  color: "var(--white-white, #FFF)",
                  fontFamily: "Noto Sans KR",
                  fontSize: "15px",
                  fontWeight: isSelected ? 600 : 400,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  ...customStyles.option,
                  ...(isSelected ? customStyles.selectedOption : {}),
                }}
              >
                {optionLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
