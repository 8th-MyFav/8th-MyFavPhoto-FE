"use client";

import React from "react";
import Input from "../atoms/Input";

const FormGroup = ({
  label, // 라벨 텍스트
  id, // input id
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  labelClassName = "", // 라벨 추가 커스터마이즈용
  inputClassName = "", // 인풋 추가 커스터마이즈용
  wrapperClassName = "", // 그룹 래퍼 커스터마이즈용
  ...rest
}) => {
  return (
    <div className={`pb-[32px] ${wrapperClassName}`}>
      <div className="pb-[10px]">
        <label
          htmlFor={id}
          className={`text-white text-[18px] font-['Noto Sans KR'] font-[700] ${labelClassName}`}
        >
          {label}
        </label>
      </div>
      <div>
        <Input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={inputClassName}
          {...rest}
        />
      </div>
    </div>
  );
};

export default FormGroup;
