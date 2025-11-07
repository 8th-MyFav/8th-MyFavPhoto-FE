"use client";

import React from "react";

const LoadingOverlay = ({ show = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[5px] bg-black/10 z-[9999]">
      <img
        src="/images/favorite.svg"
        alt="로딩중"
        className="w-64 h-64 animate-pulse"
      />
    </div>
  );
};

export default LoadingOverlay;
