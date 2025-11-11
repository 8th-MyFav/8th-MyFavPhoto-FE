"use client";
import ActionResultPage from "@/components/organisms/ActionResultPage";
import { PATHNAME } from "@/constants";
import { useSearchParams, useRouter } from "next/navigation";

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const rarity = searchParams.get("rarity");
  const title = searchParams.get("title");
  const quantity = searchParams.get("quantity");

  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="구매"
          result="성공"
          rarity={rarity}
          title={title}
          quantity={quantity}
          buttonText="마이갤러리에서 확인하기"
          buttonAction={() => router.push(PATHNAME.MYGAL)}
        />
      </div>
    </div>
  );
}
