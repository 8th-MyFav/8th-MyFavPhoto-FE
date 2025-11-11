"use client";
import ActionResultPage from "@/components/organisms/ActionResultPage";

export default function ExchangeFailPage() {
  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="교환 제시"
          result="실패"
          buttonText="마켓 플레이스로 돌아가기"
        />
      </div>
    </div>
  );
}
