"use client";
import ActionResultPage from "@/components/organisms/actionResultPage";
import { PATHNAME } from "@/constants";

export default function ExchangeSuccessPage() {
  return (
    <ActionResultPage
      type="교환 제시"
      result="성공"
      buttonText="나의 판매 포토카드에서 확인하기"
      buttonAction={() => (window.location.href = PATHNAME.MPSELLER)}
    />
  );
}
