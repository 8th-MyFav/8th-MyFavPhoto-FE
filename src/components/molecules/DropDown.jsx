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
  containerBorder,
  customStyles = {},
  onChange = () => {},
  value,
  defaultValue,
  disabled = false,
  className = "", // ← 추가: Tailwind / custom CSS 클래스 전달용
}) => {
  const isControlled = value !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultValue ?? "");
  const selectedValue = isControlled ? value : internalSelected;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      className={`relative rounded-[2px] overflow-visible ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
      ref={dropdownRef}
      style={{
        display: "inline-block",
        width,
        maxWidth,
        height,
        backgroundColor: "var(--black-black, #0F0F0F)",
        padding,
        userSelect: "none",
        ...customStyles.container,
        ...(containerBorder ? { border: containerBorder } : {}),
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
          // className으로 텍스트 크기/스타일을 부모에서 조절 가능하게 함
          className={`overflow-hidden whitespace-nowrap text-ellipsis flex items-center ${className}`}
          style={{
            flex: 1,
            color: selectedValue ? "#FFF" : "var(--gray-gray200, #DDD)",
            fontFamily: "Noto Sans KR",
            fontWeight: selectedValue ? 600 : 700,
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
            zIndex: 9999,
            width: optionListWidth === "100%" ? "100%" : optionListWidth,
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
          {renderResetOption && (
            <li
              key="reset-option"
              className={`cursor-pointer hover:opacity-80 ${className}`}
              onClick={() =>
                handleSelect(resetLabel ?? placeholder, resetValue)
              }
              style={{
                width: optionListWidth === "100%" ? "100%" : "auto",
                color: "var(--white-white, #FFF)",
                fontFamily: "Noto Sans KR",
                fontWeight:
                  selectedValue === (resetLabel ?? placeholder) ? 600 : 400,
                textAlign: "left",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-block",
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
                className={`cursor-pointer hover:opacity-80 ${className}`}
                onClick={() => handleSelect(optionLabel, optionValue)}
                style={{
                  width: optionListWidth === "100%" ? "100%" : "auto",
                  color: "var(--white-white, #FFF)",
                  fontFamily: "Noto Sans KR",
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

/* SortDropdown unchanged except you may pass className through if needed */
export const SortDropdown = ({
  options = ["낮은 가격순", "높은 가격순", "최신순"],
  placeholder = "낮은 가격순",
  customStyles = {},
  className = "",
  ...rest
}) => {
  const mergedCustomStyles = {
    container: {
      border: "1px solid #FFF",
      padding: "13px 20px",
      ...customStyles.container,
    },
    select: {
      width: "100%",
      justifyContent: "space-between",
      ...customStyles.select,
    },
    text: {
      width: "100%",
      ...customStyles.text,
    },
    arrow: {
      marginLeft: "12px",
      ...customStyles.arrow,
    },
    optionList: {
      width: "180px",
      padding: "10px 24px",
      ...customStyles.optionList,
    },
    option: {
      ...customStyles.option,
    },
  };

  return (
    <Dropdown
      options={options}
      placeholder={placeholder}
      width="180px"
      height="50px"
      padding="13px 20px"
      maxWidth="180px"
      customStyles={mergedCustomStyles}
      className={className}
      {...rest}
    />
  );
};
