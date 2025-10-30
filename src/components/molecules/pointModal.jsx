import React, { useEffect, useState } from "react";

const PointModal = ({
  title1 = "랜덤",
  title2 = "포인트",
  buttonText = "선택완료",
  onClose,
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

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleBoxClick = (index) => {
    if (isConfirmed) return;
    setSelectedBox(index);
  };

  const handleConfirm = () => {
    if (selectedBox === null) return;

    const randomPoint = Math.floor(Math.random() * 91) + 10;

    setReward(randomPoint);
    setIsConfirmed(true);
  };

  const boxImages = [
    "/images/random_box-1.svg",
    "/images/random_box-2.svg",
    "/images/random_box-3.svg",
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pointer-events-none">
      {/* 배경 블러 */}
      <div className=" absolute inset-0 backdrop-blur-sm pointer-events-none"></div>

      {/* 모달 박스 */}
      <div
        className={`relative flex flex-col ${
          isConfirmed
            ? "w-[455px] h-[678px]"
            : selectedBox !== null
            ? "w-[1034px] h-[765px]"
            : "w-[1034px] h-[646px]"
        } mt-[217px] rounded-[2px] bg-[#161616] z-10 pointer-events-auto transition-all duration-500`}
      >
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[30px] right-[30px] cursor-pointer"
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
          {!isConfirmed ? (
            <>
              <h2 className="text-white mt-[20px] leading-relaxed text-center">
                1시간마다 돌아오는 기회!
                <br />
                랜덤 상자 뽑기를 통해 포인트를 획득하세요!
              </h2>

              {/* 선물 상자 */}
              <div className="flex justify-center items-center gap-[40px] mt-[60px]">
                {boxImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`선물상자 ${index + 1}`}
                    onClick={() => handleBoxClick(index)}
                    className={`transition-all cursor-pointer rounded-md ${
                      index === 0
                        ? "w-[246px] h-[191px]"
                        : index === 1
                        ? "w-[224px] h-[298px]"
                        : "w-[246px] h-[191px]"
                    } ${
                      selectedBox === null
                        ? "opacity-100"
                        : selectedBox === index
                        ? "opacity-100 scale-105"
                        : "opacity-40"
                    }`}
                    // style={{
                    //   imageRendering: "crisp-edges", // 렌더링 경계 부드럽게
                    //   backfaceVisibility: "hidden", // 확대 시 깜빡임 방지
                    // }}
                  />
                ))}
              </div>

              {/* 선택완료 - 상자 선택 시 노출 */}
              {selectedBox !== null && (
                <div className="flex justify-center mt-[80px] mb-[40px]">
                  <button
                    className="w-[520px] h-[60px] bg-[#EFFF04] mt-[70px] rounded-[2px] font-extrabold text-black"
                    onClick={handleConfirm}
                  >
                    {buttonText}
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex flex-col justify-center items-center">
                <img
                  src="/images/Point.svg"
                  alt="포인트 아이콘"
                  className=" w-[340px] h-[324.12px] mt-[80px]"
                />
                <h2 className="text-[#EFFF04] text-[36px] font-bold  mt-[40px]">
                  {reward}P 획득!
                </h2>

                <div className="absolute bottom-[40px] text-gray-400 text-[16px]">
                  <p>
                    다음 기회까지 남은 시간 {minutes}분 {seconds}초
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointModal;
