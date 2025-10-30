"use client";
import ActionResultPage from "@/components/organisms/actionResultPage";
import { useSearchParams, useRouter } from "next/navigation";

export default function SellSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rarity = searchParams.get("rarity");
  const title = searchParams.get("title");
  const quantity = searchParams.get("quantity");

  return (
    <ActionResultPage
      type="판매 등록"
      result="성공"
      rarity={rarity}
      title={title}
      quantity={quantity}
      buttonText="나의 판매 포토카드에서 확인하기"
      buttonAction={() => router.push("/mypage/sell")}
    />
  );
}
