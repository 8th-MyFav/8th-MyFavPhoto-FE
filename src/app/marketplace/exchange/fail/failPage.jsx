"use client";
import ActionResultPage from "@/components/organisms/ActionResultPage";
import { PATHNAME } from "@/constants";

export default function ExchangeFailPage({ searchParams }) {
  const rarity = searchParams?.rarity || "";
  const title = searchParams?.title || "";
  const quantity = searchParams?.quantity || "";

  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="교환 제시"
          result="실패"
          rarity={rarity}
          title={title}
          quantity={quantity}
          buttonText="마켓 플레이스로 돌아가기"
          pathAction={PATHNAME.MARKETPLACE}
        />
      </div>
    </div>
  );
}
