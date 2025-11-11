"use client";
import ActionResultPage from "@/components/organisms/ActionResultPage";
import { PATHNAME } from "@/constants";
import { useSearchParams, useRouter } from "next/navigation";

export default function SellSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rarity = searchParams.get("rarity");
  const title = searchParams.get("title");
  const quantity = searchParams.get("quantity");

  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="판매 등록"
          result="성공"
          rarity={rarity}
          title={title}
          quantity={quantity}
          buttonText="나의 판매 포토카드에서 확인하기"
          buttonAction={() => router.push(PATHNAME.MPSELLER)}
        />
      </div>
    </div>
  );
}
