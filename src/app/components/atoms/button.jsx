"use client";

import React from "react";

const Button = ({
  text = "버튼",           
  width = "440px",         
  height = "80px",         
  padding = "25px 144px",   
  backgroundColor = "var(--main-main, #EFFF04)", 
  color = "var(--black-black, #0F0F0F)",         
  onClick,                  
}) => {
  return (
    <button
      onClick={onClick}
      className="flex justify-center items-center gap-[10px] flex-shrink-0 rounded-[2px]"
      style={{
        width,
        height,
        padding,
        background: backgroundColor,
        color,
        textAlign: "center",
        fontFamily: "Noto Sans KR",
        fontSize: "20px",
        fontStyle: "normal",
        fontWeight: 700,
        lineHeight: "normal",
        border: "none",
        cursor: "pointer",
      }}
    >
      {text}
    </button>
  );
};

export default Button;
