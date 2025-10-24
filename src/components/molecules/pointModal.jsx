import React, { useEffect, useState } from "react";

const pointmodal = ({
  title1 = "랜덤",
  title2 = "포인트",
  content1 = "1시간마다 돌아오는 기회!<br />랜덤 상자 뽑기를 통해 포인트를 획득하세요!",
  content2 = "다음 기회까지 남은 시간 ${minute}분 ${second}초",
  buttonText = "선택완료",
  onClose,
  onComplete,
}) => {
  const [selectedBox, setSelectedBox] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reward, setReward] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (timeLeft <= 0) {
      setSelectedBox(null);
      setIsConfirmed(false);
      setTimeLeft(3600);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleConfirm = () => {
    if (selectedBox === null) return;

    const randomPoint = Math.floor(Math.random() * 91) + 10;

    setReward((prev) => prev + randomPoint);
    setIsConfirmed(true);
  };

  const boxImages = [
    "/images/random_box-1.svg",
    "/images/random_box-2.svg",
    "/images/random_box-3.svg",
  ];

  // 상자 클릭시
  const handleBoxClick = (index) => {
    if (isConfirmed) return;
    setSelectedBox(index);
  };

  //선택완료 버튼 클릭 시
  const handConfirm = () => {
    const randomPoint = Math.floor(Math.random);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pointer-events-none">
      {/* 배경 블러 */}
      <div className=" absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

      {/* 모달 박스 */}
      <div
        className={`relative flex flex-col ${
          isConfirmed
            ? "w-[455px] h-[678px]"
            : selectedBox
            ? "w-[1034px] h-[765px]"
            : "w-[1034px] h-[646px]"
        } mt-[217px] rounded-[2px] bg-[#161616] z-10 pointer-events-auto transition-all duration-500`}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[30px] left-[972px] cursor-pointer"
        >
          <img src="/images/close.svg" alt="Close" className="w-full h-full" />
        </button>
        <div className="text-center">
          {/* 제목 */}
          <div className="flex items-center justify-center mt-[40px]">
            <h1 className="text-white text-[46px] font-bold whitespace-nowrap overflow-hidden truncate">
              {title1}
            </h1>
            <h1 className="text-[#EFFF04] text-[46px] font-bold whitespace-nowrap overflow-hidden truncate">
              {title2}
            </h1>
          </div>

          {/* 내용 */}
          <h2>
            1시간마다 돌아오는 기회!
            <br />
            랜덤 상자 뽑기를 통해 포인트를 획득하세요!
          </h2>

          {/* 남은 시간 */}
          <div className="mt-[25px]">
            <h3>{content2}</h3>
          </div>
        </div>
        {/* 선물 상자 */}
        <div className="flex justify-center gap-[40px] mt-[60px]">
          {boxImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`선물상자 ${index + 1}`}
              onClick={`w-[180px] h-[180] transition-all cursor-pointer rounded-md ${
                selectedBox === null
                  ? "opacity-100"
                  : selectedBox === index
                  ? "opacity-100 scale-105"
                  : "opacity-40"
              }`}
            />
          ))}
        </div>

        {/* 선택완료 */}
        <div className="flex justify-center mt-[80px]">
          <button className="w-[520px] h-[60px] bg-[#EFFF04] mt[70px] rounded-[2px] font-extrabold text-black">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default pointmodal;
