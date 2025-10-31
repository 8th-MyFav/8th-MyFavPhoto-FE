"use client";
import ActionResultPage from "@/components/organisms/actionResultPage";

export default function ExchangeFailPage() {
  return (
    <ActionResultPage
      type="교환 제시"
      result="실패"
      buttonText="마켓 플레이스로 돌아가기"
    />
  );
}
