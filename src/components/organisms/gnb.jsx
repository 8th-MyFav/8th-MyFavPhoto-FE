"use client";

import React from "react";

const GNB = ({ isLoggedIn }) => {
  return (
    <nav className="w-full h-[60px] flex justify-between items-center bg-black text-white">
      {/* 좌측 로고 */}
      <div className="flex items-center cursor-pointer">
        <img src="/images/favorite.svg" alt="최애의 포토" className="w-[120px] h-auto" />
      </div>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-[30px]">
        {!isLoggedIn && (
          <>
            <button className="text-white font-medium cursor-pointer">로그인</button>
            <button className="text-white font-medium cursor-pointer">회원가입</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default GNB;
