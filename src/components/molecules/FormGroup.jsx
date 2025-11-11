"use client";
import React, { useState } from "react";
import Input from "../atoms/Input";
const FormGroup = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error = "",
  labelClassName = "",
  inputClassName = "",
  wrapperClassName = "",
  errorClassName = "",
  showPasswordToggle = false,
  ...rest
}) => {
  const errorId = `${id}-error`;

  const [showPassword, setShowPassword] = useState(false);
  //패스워드 타입
  let finalInputType = type;
  if (showPasswordToggle && type === "password") {
    finalInputType = showPassword ? "text" : "password";
  }

  return (
    <div
      className={`min-h-[123px] flex flex-col justify-start pb-[45px] ${wrapperClassName}`}
    >
      <div
        className="flex flex-col gap-2 relative"
        style={{ minHeight: "94px" }}
      >
        <label
          htmlFor={id}
          className={`text-white text-noto-xs font-bold ${labelClassName}`}
        >
          {label}
        </label>
        <div className="relative pt-2xs">
          <Input
            id={id}
            name={id}
            inputType={finalInputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full box-border ${inputClassName}`}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            {...rest}
          />
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-gray-200 hover:text-gray-200 transition-colors text-noto-4xs"
              aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              {showPassword ? (
                <img
                  src="/icons/visibilityOff.svg"
                  alt="숨기기"
                  className="w-xs h-xs"
                />
              ) : (
                <img
                  src="/icons/visibility.svg"
                  alt="보기"
                  className="w-xs h-xs"
                />
              )}
            </button>
          )}
        </div>
        {/* 에러영역: absolute로 띄워서 레이아웃에 영향 없음 */}
        {error && (
          <p
            id={errorId}
            className={`absolute top-full left-0 pt-[10px] text-noto-2xs text-red-500 ${errorClassName}`}
            aria-live="polite"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
export default FormGroup;
