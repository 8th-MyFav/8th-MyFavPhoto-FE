"use client";

import React from "react";

const VARIANT_STYLES = {
  common: {
    label: "COMMON",
    color: "#EFFF04",
    borderColor: "#EFFF04",
  },
  rare: {
    label: "RARE",
    color: "#29C9F9",
    borderColor: "#29C9F9",
  },
  super: {
    label: "SUPER RARE",
    color: "#A77EFF",
    borderColor: "#A77EFF",
  },
  legendary: {
    label: "LEGENDARY",
    color: "#FF2A6A",
    borderColor: "#FF2A6A",
  },
};

const Label = ({
  variant = "common",
  count = 0,
  width = "200px",
  fontSize = "18px",
  paddingY = "12px",
  paddingX = "18px",
  className = "",
  ...rest
}) => {
  const { label, color, borderColor } =
    VARIANT_STYLES[variant] || VARIANT_STYLES.common;

  return (
    <label
      className={`inline-flex justify-center items-center border rounded-xs font-normal cursor-default ${className}`}
      style={{
        width,
        borderColor,
        color,
        padding: `${paddingY} ${paddingX}`,
        fontSize,
        fontFamily: "Noto Sans KR",
        lineHeight: "normal",
      }}
      {...rest}
    >
      {`${label} ${count}장`}
    </label>
  );
};

 feat-김성준2
export default Label;
export default Label;
 develop
