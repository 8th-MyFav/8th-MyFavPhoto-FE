"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Modal from "@/components/molecules/modal";

// 더미 카드 데이터
const cardDataServer = Array.from({ length: 30 }, (_, i) => ({
  topImage: "/images/sample.svg",
  title: `아름다운 풍경 ${i + 1}`,
  rarity: i % 4 === 0 ? "COMMON" : i % 4 === 1 ? "RARE" : i % 4 === 2 ? "SUPER RARE" : "LEGENDARY",
  category: i % 3 === 0 ? "풍경" : i % 3 === 1 ? "인물" : "동물",
  author: `글쓴이 ${i + 1}`,
  content: "포토카드 상세 설명입니다.",
  price: (i + 1) * 10,
  remaining: i % 3 === 0 ? 0 : 2,
  total: 5,
  exchangeInfo: "푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.",
}));

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = parseInt(params.id);
  const card = cardDataServer[cardId];

  const [count, setCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const total = card ? count * card.price : 0;

  const decrease = () => { if (count > 1) setCount(count - 1); };
  const increase = () => { if (count < card.remaining) setCount(count + 1); };

  if (!card) return <div className="text-white p-8">카드를 찾을 수 없습니다.</div>;

  // 등급 색상 설정
  let rarityColor = "var(--yellow-yellow, #EFFF04)";
  if (card.rarity === "RARE") rarityColor = "var(--blue-blue, #29C9F9)";
  else if (card.rarity === "SUPER RARE") rarityColor = "var(--purple-purple, #A77EFF)";
  else if (card.rarity === "LEGENDARY") rarityColor = "var(--pink-pink, #FF2A6A)";

  // 모달 구매 버튼 클릭 시 처리
  const handlePurchase = () => {
    setIsModalOpen(false);
    const query = `?rarity=${card.rarity}&title=${encodeURIComponent(card.title)}&quantity=${count}`;
    if (count <= card.remaining) {
      // 구매 가능 -> 성공 페이지로 이동
      router.push(`/marketplace/detail/${cardId}/success${query}`);
    } else {
      // 구매 불가 -> 실패 페이지로 이동
      router.push(`/marketplace/detail/${cardId}/fail${query}`);
    }
  };

  return (
    <div className="bg-[#111] text-white min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        {/* 상단 타이틀 */}
        <div className="mb-8">
          <div
            style={{
              color: "var(--gray-gray300, #A4A4A4)",
              fontFamily: "BR B",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "-0.72px",
              marginBottom: "60px",
            }}
          >
            마켓플레이스
          </div>

          <h2
            className="font-bold"
            style={{
              color: "var(--white-white, #FFF)",
              fontFamily: '"Noto Sans KR"',
              fontSize: "40px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginBottom: "20px",
            }}
          >
            {card.title}
          </h2>
          <hr
            style={{
              border: "none",
              borderTop: "2px solid var(--gray-gray100, #EEE)",
              marginBottom: "70px",
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* 이미지 */}
          <div className="flex-1">
            <img src={card.topImage} alt={card.title} className="rounded-md object-cover w-full" />
          </div>

          {/* 카드 정보 */}
          <div style={{ width: "440px" }}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex gap-4 items-center">
                <span style={{ color: rarityColor, fontFamily: '"Noto Sans KR"', fontSize: "24px", fontWeight: 700 }}>
                  {card.rarity}
                </span>
                <span style={{ color: "var(--gray-gray300, #A4A4A4)", fontFamily: '"Noto Sans KR"', fontSize: "24px", fontWeight: 700 }}>
                  |
                </span>
                <span style={{ color: "var(--gray-gray300, #A4A4A4)", fontFamily: '"Noto Sans KR"', fontSize: "24px", fontWeight: 700 }}>
                  {card.category}
                </span>
              </div>
              <span
                style={{
                  color: "var(--white-white, #FFF)",
                  fontFamily: '"Noto Sans KR"',
                  fontSize: "24px",
                  fontWeight: 700,
                  lineHeight: "normal",
                  textDecorationLine: "underline",
                }}
              >
                {card.author}
              </span>
            </div>

            <hr className="border-gray-700 mb-4" />

            <p style={{ color: "var(--white-white, #FFF)", fontFamily: '"Noto Sans KR"', fontSize: "18px", fontWeight: 400, margin: "30px 0" }}>
              {card.content}
            </p>

            <hr className="border-gray-700 mb-4" />

            {/* 가격 / 잔여 */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-lg">
                <span className="text-gray-400">가격</span>
                <span className="text-white font-bold">{card.price} P</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">잔여</span>
                <span className="flex gap-1">
                  <span className="text-white font-bold">{card.remaining}</span>
                  <span className="text-gray-400">/ {card.total}</span>
                </span>
              </div>
            </div>

            <hr className="border-gray-700 mb-4" />

            {/* 구매 수량 */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-white text-lg">구매수량</span>
              <div className="flex items-center border border-white rounded-md px-2">
                <button onClick={decrease} className="w-8 h-8 text-lg flex items-center justify-center">−</button>
                <span className="w-8 text-center">{count}</span>
                <button onClick={increase} className="w-8 h-8 text-lg flex items-center justify-center">+</button>
              </div>
            </div>

            {/* 총 가격 */}
            <div className="flex justify-between items-center mb-10">
              <span className="text-white text-lg">총 가격</span>
              <span className="text-white font-bold text-xl">
                {total} P <span className="text-gray-400 text-lg">({count}장)</span>
              </span>
            </div>

            {/* 포토카드 구매하기 버튼 */}
            <button
              className="bg-[#fff600] rounded-md w-full h-20 text-black font-bold cursor-pointer"
              style={{ marginBottom: "120px" }}
              onClick={() => setIsModalOpen(true)}
            >
              포토카드 구매하기
            </button>
          </div>
        </div>

        {/* 교환 희망 정보 */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-[20px]">
            <h3 className="font-semibold" style={{ fontSize: "40px" }}>교환 희망 정보</h3>
            <button
              className="bg-[#fff600] text-black font-semibold rounded-md cursor-pointer"
              style={{ width: "440px", height: "60px" }}
            >
              포토카드 교환하기
            </button>
          </div>

          <hr className="border-white mb-[60px]" />

          <p
            style={{
              color: "var(--white-white, #FFF)",
              fontFamily: '"Noto Sans KR"',
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "normal",
              marginTop: "60px",
            }}
          >
            {card.exchangeInfo}
          </p>

          <div className="flex items-center" style={{ gap: "15px", marginTop: "20px" }}>
            <span style={{ color: rarityColor, fontFamily: '"Noto Sans KR"', fontSize: "24px", fontWeight: 700 }}>
              {card.rarity}
            </span>
            <span style={{ color: "var(--gray-gray400, #5A5A5A)", fontFamily: '"Noto Sans KR"', fontSize: "24px", fontWeight: 700 }}>
              |
            </span>
            <span style={{ color: "var(--gray-gray300, #A4A4A4)", fontFamily: '"Noto Sans KR"', fontSize: "24px", fontWeight: 700 }}>
              {card.category}
            </span>
          </div>
        </div>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <Modal
          title="포토카드 구매"
          content={`[${card.rarity} | ${card.title}] ${count}장을 구매하시겠습니까?`}
          buttonText="구매하기"
          onClose={() => setIsModalOpen(false)}
          onButtonClick={handlePurchase}
        />
      )}
    </div>
  );
}
