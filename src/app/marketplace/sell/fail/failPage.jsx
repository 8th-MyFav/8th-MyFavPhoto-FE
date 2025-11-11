"use client";
import ActionResultPage from "@/components/organisms/ActionResultPage";
import { useSearchParams } from "next/navigation";

export default function SellFailPage() {
  const searchParams = useSearchParams();
  const rarity = searchParams?.get("rarity");
  const title = searchParams?.get("title");
  const quantity = searchParams?.get("quantity");

  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="판매 등록"
          result="실패"
          rarity={rarity}
          title={title}
          quantity={quantity}
          buttonText="마켓 플레이스로 돌아가기"
        />
      </div>
    </div>
  );
}
