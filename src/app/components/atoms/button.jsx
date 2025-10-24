"use client";

import React from "react";

const Button = ({
  text = "버튼",
  width = "440px",
  height = "80px",
  padding = "25px 144px",
  backgroundColor = "var(--main-main, #EFFF04)",
  color = "var(--black-black, #0F0F0F)",
  fontFamily = "Noto Sans KR",
  fontSize = "20px",
  fontStyle = "normal",
  fontWeight = 700,
  lineHeight = "normal",
  border = "none",
  borderRadius = "2px",
  textAlign = "center",
  cursor = "pointer",
  gap = "10px",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex justify-center items-center flex-shrink-0 ${className}`}
      style={{
        width,
        height,
        padding,
        background: backgroundColor,
        color,
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight,
        lineHeight,
        border,
        borderRadius,
        textAlign,
        cursor,
        gap,
      }}
    >
      {text}
    </button>
  );
};

export default Button;
