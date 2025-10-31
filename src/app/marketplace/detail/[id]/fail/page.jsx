"use client";
import ActionResultPage from "@/components/organisms/actionResultPage";
import { useSearchParams } from "next/navigation";

export default function PurchaseFailPage() {
  const searchParams = useSearchParams();

  const rarity = searchParams.get("rarity");
  const title = searchParams.get("title");
  const quantity = searchParams.get("quantity");

  return (
    <ActionResultPage
      type="구매"
      result="실패"
      rarity={rarity}
      title={title}
      quantity={quantity}
      buttonText="마켓 플레이스로 돌아가기"
    />
  );
}
