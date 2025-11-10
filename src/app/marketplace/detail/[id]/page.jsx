"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMarketListingDetail,
} from "@/api/marketListings";
import { useMarketPurchase } from "@/api/marketPurchase";
import {
  useMarketTradeList,
  useMarketTradeCreate,
  useMarketTradeApprove,
  useMarketTradeReject,
} from "@/api/marketTrades";

import Modal from "@/components/molecules/Modal";
import CardTradeModal from "@/components/organisms/CardTradeModal";
import ExchangeModal from "@/components/organisms/ExchangeModal";
import CardMeta from "@/components/molecules/CardMeta";
import { PATHNAME } from "@/constants";

export default function DetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = parseInt(params.id, 10);

  // 상세조회
  const { data: listing, isLoading, isError } = useMarketListingDetail(listingId);

  // 트레이드 목록 조회
  const { data: tradeList = [], refetch: refetchTrades } = useMarketTradeList(listingId);

  // 트레이드 관련 mutation
  const { mutate: purchaseCard, isLoading: isPurchasing } = useMarketPurchase();
  const { mutate: createTrade, isLoading: isCreatingTrade } = useMarketTradeCreate();
  const { mutate: approveTrade } = useMarketTradeApprove();
  const { mutate: rejectTrade } = useMarketTradeReject();

  // 상태값
  const [count, setCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [tradeContent, setTradeContent] = useState("");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelTargetCard, setCancelTargetCard] = useState(null);

  if (isLoading) return <div className="text-white p-8 min-h-screen bg-[#111]">포토카드 정보를 불러오는 중입니다...</div>;
  if (isError || !listing) return <div className="text-white p-8 min-h-screen bg-[#111]">카드를 불러올 수 없습니다.</div>;

  const trade = {
    id: listing.id,
    tradeGrade: listing.trade_grade,
    tradeGenre: listing.trade_genre,
    tradeNote: listing.trade_note,
    price: listing.price,
    total: listing.total_count,
    remaining: listing.left_count,
  };

  const photoCard = {
    id: listing.card?.id,
    title: listing.card?.name ?? "제목 없음",
    rarity: listing.card?.grade ?? "COMMON",
    category: listing.card?.genre ?? "기타",
    author: listing.card?.nickname ?? "익명",
    content: listing.card?.description ?? "설명 없음",
    topImage: listing.card?.image_url ?? "/images/sample.svg",
  };

  const total = count * (trade.price ?? 0);
  const decrease = () => count > 1 && setCount(count - 1);
  const increase = () => count < (trade.remaining ?? 0) && setCount(count + 1);

  /** 구매 */
  const handlePurchase = () => {
    if (count > trade.remaining) {
      alert("잔여 수량보다 많은 수량을 구매할 수 없습니다.");
      return;
    }

    // 수정된 API 호출
    purchaseCard(
      { tradePostId: listing.id, count },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          const query = `?rarity=${photoCard.rarity}&title=${encodeURIComponent(photoCard.title)}&quantity=${count}`;
          router.push(`${PATHNAME.MARKET_DETAIL_SUCCESS(trade.id)}${query}`);
        },
        onError: (err) => {
          console.error("구매 실패:", err);
          setIsModalOpen(false);
          const query = `?rarity=${photoCard.rarity}&title=${encodeURIComponent(photoCard.title)}&quantity=${count}`;
          router.push(`${PATHNAME.MARKET_DETAIL_FAIL(trade.id)}${query}`);
        },
      }
    );
  };

  /** 트레이드 생성 */
  const handleCreateTrade = (offeredCard) => {
    createTrade(
      { cardId: listing.id, offeredCardId: offeredCard.id, content: tradeContent },
      {
        onSuccess: () => {
          setIsExchangeModalOpen(false);
          refetchTrades(); // 목록 갱신
        },
        onError: (err) => {
          console.error("교환 제시 실패:", err);
        },
      }
    );
  };

  /** 트레이드 승인/거절 */
  const handleApprove = (tradeId) => {
    approveTrade(tradeId, { onSuccess: () => refetchTrades() });
  };
  const handleReject = (tradeId) => {
    rejectTrade(tradeId, { onSuccess: () => refetchTrades() });
  };

  const handleCancelTradeCard = (targetCard) => {
    setCancelTargetCard(targetCard);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    console.log("교환 제시 취소 완료:", cancelTargetCard);
    setIsCancelModalOpen(false);
    setCancelTargetCard(null);
  };

  return (
    <div className="bg-[#111] text-white min-h-screen pb-24">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        {/* 상단 */}
        <div className="mb-8">
          <div className="text-gray-400 text-2xl mb-[60px] font-br">마켓플레이스</div>
          <h2 className="text-white text-4xl font-bold mb-5">{photoCard.title}</h2>
          <hr className="border-t-2 border-gray-100 mb-[70px]" />
        </div>

        {/* 카드 상세 */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1">
            <img src={photoCard.topImage} alt={photoCard.title} className="rounded-md object-cover w-full" />
          </div>

          <div style={{ width: "440px" }}>
            <CardMeta
              rarityText={photoCard.rarity}
              category={photoCard.category}
              author={photoCard.author}
              variant="withAuthor"
              sizeVariant="base"
              className="mb-[30px]"
            />
            <hr className="border-gray-700 mb-4" />
            <p className="text-white mb-6">{photoCard.content}</p>
            <hr className="border-gray-700 mb-4" />

            {/* 가격 및 수량 */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">가격</span>
                <span className="text-white font-bold">{trade.price} P</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">잔여</span>
                <span>
                  <span className="text-white font-bold">{trade.remaining}</span>
                  <span className="text-gray-400"> / {trade.total}</span>
                </span>
              </div>
            </div>

            {/* 구매 수량 */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-white text-lg">구매수량</span>
              <div className="flex items-center border border-white rounded-md px-2">
                <button onClick={decrease}>−</button>
                <span className="w-8 text-center">{count}</span>
                <button onClick={increase}>＋</button>
              </div>
            </div>

            {/* 총 가격 */}
            <div className="flex justify-between items-center mb-10">
              <span className="text-white text-lg">총 가격</span>
              <span className="text-white font-bold text-xl">{total} P <span className="text-gray-400 text-lg">({count}장)</span></span>
            </div>

            {/* 구매 버튼 */}
            <button
              className="bg-[var(--color-main)] rounded-md w-full h-20 text-black font-bold cursor-pointer"
              style={{ marginBottom: "120px" }}
              onClick={() => setIsModalOpen(true)}
              disabled={isPurchasing}
            >
              {isPurchasing ? "구매 중..." : "포토카드 구매하기"}
            </button>
          </div>
        </div>

        {/* 교환 희망 정보 + 트레이드 목록 */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-[20px]">
            <h3 style={{ fontSize: "40px", fontWeight: 700 }}>교환 희망 정보</h3>
            <button
              className="bg-[var(--color-main)] text-black font-semibold rounded-md cursor-pointer"
              style={{ width: "440px", height: "60px" }}
              onClick={() => setIsTradeModalOpen(true)}
            >
              포토카드 교환하기
            </button>
          </div>

          <hr className="border-white mb-[60px]" />
          <CardMeta
            rarityText={trade.tradeGrade || "정보 없음"}
            category={trade.tradeGenre || "정보 없음"}
            variant="default"
            sizeVariant="base"
            className="mb-[30px]"
          />
          <p style={{ color: "var(--color-white)", fontSize: "18px", marginTop: "20px", marginBottom: "120px" }}>
            {trade.tradeNote || "교환 희망 정보가 없습니다."}
          </p>

          {/* 트레이드 목록 */}
          <h3 className="text-white text-4xl font-bold mb-5">내가 제시한 교환 목록</h3>
          <hr className="border-t-2 border-gray-100 mb-[20px]" />
          {tradeList.length === 0 ? (
            <div className="text-gray-400">아직 제시한 교환 목록이 없습니다.</div>
          ) : (
            tradeList.map((t) => (
              <div key={t.id} className="mb-4 p-3 border border-gray-600 rounded">
                <div className="flex justify-between items-center">
                  <span>[{t.offeredCard.rarity} | {t.offeredCard.title}]</span>
                  <span className="text-gray-400">상태: {t.status}</span>
                </div>
                <div className="mt-2 flex gap-2">
                  {t.status === "PENDING" && (
                    <>
                      <button onClick={() => handleApprove(t.id)} className="bg-green-500 px-2 rounded">승인</button>
                      <button onClick={() => handleReject(t.id)} className="bg-red-500 px-2 rounded">거절</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 모달들 */}
      {isTradeModalOpen && (
        <CardTradeModal
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          onCardSelect={(selected) => {
            setSelectedCard(selected);
            setIsTradeModalOpen(false);
            setTimeout(() => setIsExchangeModalOpen(true), 100);
          }}
        />
      )}

      {isExchangeModalOpen && selectedCard && (
        <ExchangeModal
          selectedCard={selectedCard}
          targetCard={photoCard}
          onClose={() => setIsExchangeModalOpen(false)}
          onSubmit={(content) => {
            setTradeContent(content);
            handleCreateTrade(selectedCard);
          }}
        />
      )}

      {isModalOpen && (
        <Modal
          title="포토카드 구매"
          content={`[${photoCard.rarity} | ${photoCard.title}] ${count}장을 구매하시겠습니까?`}
          buttonText="구매하기"
          onClose={() => setIsModalOpen(false)}
          onButtonClick={handlePurchase}
        />
      )}

      {isCancelModalOpen && cancelTargetCard && (
        <Modal
          title="교환 제시 취소"
          content={`[${cancelTargetCard.rarity} | ${cancelTargetCard.title}] 교환 제시를 취소하시겠습니까?`}
          buttonText="취소하기"
          onClose={() => setIsCancelModalOpen(false)}
          onButtonClick={handleConfirmCancel}
        />
      )}
    </div>
  );
}
