"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ProfileModal = () => {
  const router = useRouter();
  const [show, setShow] = useState(false);

  const user = {
    name: "홍승전",
    point: 300,
  };

  const handleToggle = () => {
    setShow((prev) => !prev);
  };

  const handleNavigate = (path) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center mt-[100px]">
      {/*임시 프로필 버튼 */}
      <button
        onClick={handleToggle}
        className="px-4 py-2 bg-yellow-400 text-black rounded-none font-bold"
      >
        프로필
      </button>

      {/* 프로필 모달 */}
      {show && (
        <div className="flex flex-col items-center mt-5 w-[260px] bg-[#161616] rounded-none  overflow-hidden shadow-md transition">
          {/* 첫 번째 div */}
          <div className="w-[260px] h-[103px] flex justify-center items-center border-b border-[#383838]">
            <div className="w-[220px] h-[63px] relative text-white text-sm flex flex-col justify-between">
              {/* 인사말 */}
              <p className="absolute top-0 left-0 text-left text-[18px] font-bold">
                안녕하세요, {user.name}님!
              </p>

              {/* 포인트 텍스트 */}
              <p className="absolute bottom-0 left-0 text-[12px] font-light text-gray-300">
                보유 포인트
              </p>

              {/* 포인트 수치 */}
              <p className="absolute bottom-0 right-0 text-[12px] font-regular text-yellow-300">
                {user.point} P
              </p>
            </div>
          </div>

          {/* 두 번째 div */}
          <div className="w-[260px] h-[120px] flex justify-start items-start">
            <div className="w-[110px] h-[87px] flex flex-col justify-between items-start text-white text-sm ml-[20px] mt-[18px] text-left">
              <button
                onClick={() => handleNavigate("/marketplace")}
                className="text-[14px] font-bold hover:text-yellow-300 transition"
              >
                마켓플레이
              </button>
              <button
                onClick={() => handleNavigate("/mygallery")}
                className="text-[14px] font-bold hover:text-yellow-300 transition"
              >
                마이 갤러리
              </button>
              <button
                onClick={() => handleNavigate("/selling")}
                className="text-[14px] font-bold hover:text-yellow-300 transition"
              >
                판매 중인 포토카드
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileModal;
