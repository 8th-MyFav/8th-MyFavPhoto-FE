"use client";

import React from "react";

const Input = ({
  type,
  id,
  name,
  value,
  onChange,
  required,
  placeholder = "placeholder",
  width = "520px",
  fontSize = "16px",
  className = "",
}) => {
  return (
    <input
      className="w-[520px] bg-[var(--color-black)] border rounded-xs py-[18px] px-[20px] text-[var(--color-gray-200)] border-[var(--color-gray-200)]"
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required ? true : false}
      style={{
        width,
        fontSize,
        fontFamily: "Noto Sans KR",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "normal",
        cursor: "pointer",
      }}
    />
  );
};

export default Input;
