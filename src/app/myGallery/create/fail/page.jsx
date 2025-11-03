"use client";
import ActionResultPage from "@/components/organisms/actionResultPage";
import { useSearchParams } from "next/navigation";

export default function CreatePhotoFailPage() {
  const searchParams = useSearchParams();
  const rarity = searchParams.get("rarity");
  const title = searchParams.get("title");
  const quantity = searchParams.get("quantity");

  return (
    <ActionResultPage
      type="포토카드 생성"
      result="실패"
      rarity={rarity}
      title={title}
      quantity={quantity}
      buttonText="마이 갤러리로 돌아가기"
      buttonAction={() => router.push("/myGallery")}
    />
  );
}
