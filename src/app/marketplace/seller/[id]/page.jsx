"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMarketListingDetail, useMarketDeleteListing } from "@/api/marketListings";
import Modal from "@/components/molecules/Modal";
import CardDetailEditModal from "@/components/organisms/CardDetailEdit";
import TradeCard from "@/components/organisms/TradeCard";
import CardMeta from "@/components/molecules/CardMeta";
import { PATHNAME } from "@/constants";

export default function SellerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = parseInt(params.id, 10);

  // ---------------- Hook 최상단 배치 ----------------
  const { data: listing, isLoading, isError } = useMarketListingDetail(listingId);
  const deleteListingMutation = useMarketDeleteListing();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: "", content: "", buttonText: "", onConfirm: null });
  const [cursorStyle, setCursorStyle] = useState("default");

  // ---------------- 로딩/에러 처리 ----------------
  if (isLoading) {
    return (
      <div className="text-white p-8 min-h-screen bg-[#111]">
        카드 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="text-white p-8 min-h-screen bg-[#111]">
        카드를 불러올 수 없습니다.
      </div>
    );
  }

  // ---------------- 데이터 매핑 ----------------
  const card = {
    id: listing.card?.id,
    title: listing.card?.name ?? "제목 없음",
    rarity: listing.card?.grade ?? "COMMON",
    category: listing.card?.genre ?? "기타",
    author: listing.card?.nickname ?? "익명",
    content: listing.card?.description ?? "설명 없음",
    topImage: listing.card?.image_url ?? "/images/sample.svg",
  };

  const trade = {
    id: listing.id,
    tradeGrade: listing.trade_grade ?? "정보 없음",
    tradeGenre: listing.trade_genre ?? "정보 없음",
    tradeNote: listing.trade_note ?? "교환 희망 정보가 없습니다.",
    price: listing.price ?? 0,
    total: listing.total_count ?? 0,
    remaining: listing.left_count ?? 0,
  };

  // ---------------- 모달 핸들러 ----------------
  const openModal = ({ title, content, buttonText, onConfirm }) => {
    setModalData({ title, content, buttonText, onConfirm });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleStopSale = () => {
    setCursorStyle("progress");
    openModal({
      title: "포토카드 판매 내리기",
      content: "정말로 판매를 중단하시겠습니까?",
      buttonText: "판매 내리기",
      onConfirm: async () => {
        closeModal();
        try {
          await deleteListingMutation.mutateAsync(card.id);
          setCursorStyle("default");
          openModal({
            title: "판매 내리기 성공",
            content: "포토카드 판매가 성공적으로 중단되었습니다.",
            buttonText: "확인",
            onConfirm: () => {
              closeModal();
              router.push(PATHNAME.MARKET); // 판매 종료 후 마켓 리스트로 이동
            },
          });
        } catch (err) {
          setCursorStyle("default");
          openModal({
            title: "판매 내리기 실패",
            content: "판매 중단에 실패했습니다. 다시 시도해주세요.",
            buttonText: "확인",
            onConfirm: closeModal,
          });
        }
      },
    });
  };

  // ---------------- 교환 제시 목록 매핑 ----------------
  const tradeProposals = listing?.proposals ?? [];

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

  // ---------------- 렌더링 ----------------
  return (
    <div
      className="min-h-screen bg-[#0F0F0F] text-white flex flex-col items-center pb-[100px]"
      style={{ cursor: cursorStyle }}
    >
      <section className="w-full max-w-[1200px] mt-[60px] mb-[60px] px-[20px]">
        <div className="flex flex-col">
          <span className="mb-[10px] text-gray-300 text-[24px]">마켓플레이스</span>
          <h1 className="mb-[10px] text-[40px] font-bold">{card.title}</h1>
          <div className="w-full h-[1px] bg-white" />
        </div>
      </section>

      {/* 카드 상세 영역 */}
      <section className="w-full max-w-[1200px] flex flex-col lg:flex-row justify-between gap-[80px] px-[20px]">
        <div className="w-full lg:w-[720px] h-[460px] mx-auto">
          <img
            src={card.topImage}
            alt={card.title}
            className="w-full h-full object-cover rounded-[4px]"
          />
        </div>

        <div className="flex flex-col justify-between w-full lg:w-[440px] h-auto lg:h-[600px] mx-auto">
          <div>
            <CardMeta
              rarityText={card.rarity}
              category={card.category}
              author={card.author}
              variant="withAuthor"
              sizeVariant="base"
              className="mb-[30px]"
            />
            <div className="w-full h-[1px] mb-[30px] bg-[#5A5A5A]" />
            <p className="leading-normal mb-[15px]">{card.content}</p>

            <div className="flex flex-col gap-[10px] mb-[30px]">
              <div className="flex justify-between">
                <span className="text-[20px] font-normal text-gray-300">가격</span>
                <span className="text-[24px] font-bold text-white">{trade.price} P</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[20px] font-normal text-gray-300">잔여</span>
                <div className="flex items-end gap-[4px]">
                  <span className="text-[24px] font-bold text-white">{trade.remaining}</span>
                  <span className="text-[24px] font-normal text-gray-300">/ {trade.total}</span>
                </div>
              </div>
            </div>

            {/* 교환 희망 정보 */}
            <div className="flex items-center gap-[10px] mb-[10px]">
              <img src="/icons/refresh.svg" alt="refresh" className="w-[28px] h-[28px]" />
              <span className="text-[28px] font-bold">교환 희망 정보</span>
            </div>
            <div className="w-full h-[2px] bg-[#EEE] mb-[40px]" />
            <CardMeta
              rarityText={trade.tradeGrade}
              category={trade.tradeGenre}
              variant="default"
              sizeVariant="base"
              className="mb-[30px]"
            />
            <p className="leading-normal mb-[15px]">{trade.tradeNote}</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col gap-[20px] mt-[30px]">
            <button
              onClick={openEditModal}
              className="flex w-full h-[80px] justify-center items-center gap-[10px] rounded-[2px] bg-[var(--color-main)] text-[var(--color-black)] font-bold text-[20px]"
            >
              수정하기
            </button>
            <button
              onClick={handleStopSale}
              className="flex w-full h-[80px] justify-center items-center gap-[10px] rounded-[2px] border border-[var(--color-gray-100)] bg-[var(--color-black)] text-[var(--color-white)] font-medium text-[20px]"
            >
              판매 내리기
            </button>
          </div>
        </div>
      </section>

      {/* 교환 제시 목록 */}
      <section className="w-full max-w-[1200px] mt-[100px] px-[20px]">
        <h2 className="text-[40px] font-bold text-white mt-[120px] mb-[15px]">교환 제시 목록</h2>
        <div className="border-t border-white mb-[70px]" />
        <div className="flex flex-col lg:flex-row gap-[40px] flex-wrap">
          {tradeProposals.length === 0 ? (
            <div className="text-gray-400">아직 제시한 교환 목록이 없습니다.</div>
          ) : (
            tradeProposals.map((proposal) => (
              <TradeCard
                key={proposal.id}
                proposal={proposal}
                onApprove={() => handleApprove(proposal)}
                onReject={() => handleReject(proposal)}
              />
            ))
          )}
        </div>
      </section>

      {/* 모달 */}
      {modalOpen && (
        <Modal
          title={modalData.title}
          content={modalData.content}
          buttonText={modalData.buttonText}
          onClose={closeModal}
          onButtonClick={modalData.onConfirm}
        />
      )}

      {/* ✅ 수정된 부분 — listing 전체 전달 */}
      {editModalOpen && (
        <CardDetailEditModal
          isOpen={editModalOpen}
          onClose={closeEditModal}
          listing={listing}
        />
      )}
    </div>
  );
}
