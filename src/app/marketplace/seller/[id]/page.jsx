"use client";

import React, { useState } from "react";
import TradeCard from "@/components/organisms/tradeCard";
import Modal from "@/components/molecules/modal";
import CardDetailEditModal from "@/components/organisms/cardDetailEdit";
import CardMeta from "@/components/molecules/CardMeta"; 

const SellerDetailPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
    buttonText: "",
    onConfirm: null,
  });
  const [cursorStyle, setCursorStyle] = useState("default");

  // --------- 카드 정보 하드코딩 (auth 없이 하드코딩) ---------
  const card = {
    title: "우리집 앞마당",
    rarity: "LEGENDARY",
    category: "풍경",
    sellerName: "미쓰손",
    description:
      "우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다. 우리집 앞마당 포토카드입니다.",
    price: 4,
    remaining: 2,
    total: 5,
    imageUrl: "/images/sample.svg",
    desiredCard: {
      rarity: "RARE",
      category: "풍경",
      description:
        "푸릇푸릇한 여름 풍경, 눈 많이 내린 겨울 풍경 사진에 관심이 많습니다.",
    },
  };

  // --------- 교환 제시 목록 하드코딩 ---------
  const tradeProposals = [
    {
      id: 1,
      title: "스페인 여행",
      rarity: "COMMON",
      category: "풍경",
      price: "4",
      sellerName: "프로 여행러",
      description:
        "스페인 여행 사진도 좋은데.. 우리집 앞마당 포토카드와 교환하고 싶습니다!",
      imageUrl: "/images/sample.svg",
    },
    {
      id: 2,
      title: "겨울 바다",
      rarity: "RARE",
      category: "자연",
      price: "6",
      sellerName: "겨울수집가",
      description: "눈 덮인 바다 풍경을 제 포토카드와 교환하고 싶습니다.",
      imageUrl: "/images/sample.svg",
    },
  ];

  // --------- 모달 핸들러 ---------
  const openModal = ({ title, content, buttonText, onConfirm }) => {
    setModalData({ title, content, buttonText, onConfirm });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleApprove = (proposal) => {
    setCursorStyle("progress");
    openModal({
      title: "교환 제시 승인",
      content: `[${proposal.rarity} | ${proposal.title}] 카드와의 교환을 승인하시겠습니까?`,
      buttonText: "승인하기",
      onConfirm: () => {
        closeModal();
        setCursorStyle("default");
      },
    });
  };

  const handleReject = (proposal) => {
    setCursorStyle("progress");
    openModal({
      title: "교환 제시 거절",
      content: `[${proposal.rarity} | ${proposal.title}] 카드와의 교환을 거절하시겠습니까?`,
      buttonText: "거절하기",
      onConfirm: () => {
        closeModal();
        setCursorStyle("default");
      },
    });
  };

  const handleStopSale = () => {
    setCursorStyle("progress");
    openModal({
      title: "포토카드 판매 내리기",
      content: "정말로 판매를 중단하시겠습니까?",
      buttonText: "판매 내리기",
      onConfirm: () => {
        closeModal();
        setCursorStyle("default");
      },
    });
  };

  return (
    <div
      className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center pb-[100px]"
      style={{ fontFamily: "var(--font-noto)", cursor: cursorStyle }}
    >
      {/* 페이지 타이틀 */}
      <section className="w-full max-w-[1200px] mt-[60px] mb-[60px] px-[20px]">
        <div className="flex flex-col">
          <span
            style={{
              color: "var(--color-gray-300)",
              fontFamily: "var(--font-br)",
              fontSize: "24px",
              fontWeight: 400,
              letterSpacing: "-0.72px",
            }}
            className="mb-[10px]"
          >
            마켓플레이스
          </span>
          <h1
            style={{
              color: "var(--color-white)",
              fontFamily: "var(--font-noto)",
              fontSize: "40px",
              fontWeight: 700,
            }}
            className="mb-[10px]"
          >
            {card.title}
          </h1>
          <div className="w-full h-[1px] bg-white" />
        </div>
      </section>

      {/* 카드 상세 영역 */}
      <section className="w-full max-w-[1200px] flex flex-col lg:flex-row justify-between gap-[80px] px-[20px]">
        {/* 왼쪽 이미지 */}
        <div className="w-full lg:w-[720px] h-[460px] mx-auto">
          <img
            src={card.imageUrl}
            alt={card.title}
            className="w-full h-full object-cover rounded-[4px]"
          />
        </div>

        {/* 오른쪽 상세 */}
        <div className="flex flex-col justify-between w-full lg:w-[440px] h-auto lg:h-[600px] mx-auto">
          <div>
            {/* CardMeta 적용 */}
            <CardMeta
              rarityText={card.rarity}
              category={card.category}
              author={card.sellerName}
              variant="withAuthor"
              sizeVariant="base"
              className="mb-[30px]"
            />

            {/* 회색 선 */}
            <div
              style={{
                width: "100%",
                height: "1px",
                marginBottom: "30px",
                backgroundColor: "#5A5A5A",
              }}
            />

            {/* 내용 */}
            <p
              style={{
                color: "var(--color-white)",
                fontFamily: "var(--font-noto)",
                fontSize: "18px",
                fontWeight: 400,
              }}
              className="leading-normal mb-[15px]"
            >
              {card.description}
            </p>

            {/* 가격 & 잔여 */}
            <div className="flex flex-col gap-[10px] mb-[30px]">
              <div className="flex justify-between">
                <span className="text-[20px] font-normal text-gray-300">
                  가격
                </span>
                <span className="text-[24px] font-bold text-white">
                  {card.price} P
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[20px] font-normal text-gray-300">
                  잔여
                </span>
                <div className="flex items-end gap-[4px]">
                  <span className="text-[24px] font-bold text-white">
                    {card.remaining}
                  </span>
                  <span className="text-[24px] font-normal text-gray-300">
                    / {card.total}
                  </span>
                </div>
              </div>
            </div>

            {/* 교환 희망 정보 */}
            <div className="flex items-center gap-[10px] mb-[10px]">
              <img
                src="/icons/refresh.svg"
                alt="refresh"
                style={{ width: "28px", height: "28px" }}
              />
              <span className="text-[28px] font-bold text-white">
                교환 희망 정보
              </span>
            </div>

            <div
              style={{
                width: "100%",
                height: "2px",
                backgroundColor: "#EEE",
                marginBottom: "40px",
              }}
            />

            {/* CardMeta 적용 */}
            <CardMeta
              rarityText={card.desiredCard.rarity}
              category={card.desiredCard.category}
              variant="default"
              sizeVariant="base"
              className="mb-[30px]"
            />

            {/* 설명 */}
            <p
              style={{
                color: "var(--color-white)",
                fontFamily: "var(--font-noto)",
                fontSize: "18px",
                fontWeight: 400,
              }}
              className="leading-normal mb-[15px]"
            >
              {card.desiredCard.description}
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col gap-[20px] mt-[30px]">
            <button
              onClick={openEditModal}
              className="flex w-full h-[80px] justify-center items-center gap-[10px] rounded-[2px] bg-[var(--color-main)] text-[var(--color-black)] font-noto text-[20px] font-bold cursor-pointer"
            >
              수정하기
            </button>
            <button
              onClick={handleStopSale}
              className="flex w-full h-[80px] justify-center items-center gap-[10px] rounded-[2px] border border-[var(--color-gray-100)] bg-[var(--color-black)] text-[var(--color-white)] font-noto text-[20px] font-medium cursor-pointer"
            >
              판매 내리기
            </button>
          </div>
        </div>
      </section>

      {/* 교환 제시 목록 */}
      <section className="w-full max-w-[1200px] mt-[100px] px-[20px]">
        <h2 className="text-[40px] font-bold text-white font-noto mt-[120px] mb-[15px]">
          교환 제시 목록
        </h2>
        <div className="border-t border-white mb-[70px]" />

        <div className="flex flex-col lg:flex-row gap-[40px] flex-wrap">
          {tradeProposals.map((proposal) => (
            <TradeCard
              key={proposal.id}
              proposal={proposal}
              onApprove={() => handleApprove(proposal)}
              onReject={() => handleReject(proposal)}
            />
          ))}
        </div>
      </section>

      {/* 일반 모달 */}
      {modalOpen && (
        <Modal
          title={modalData.title}
          content={modalData.content}
          buttonText={modalData.buttonText}
          onClose={closeModal}
          onButtonClick={modalData.onConfirm}
        />
      )}

      {/* 카드 수정 모달 */}
      {editModalOpen && (
        <CardDetailEditModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          card={card}
        />
      )}
    </div>
  );
};

export default SellerDetailPage;
