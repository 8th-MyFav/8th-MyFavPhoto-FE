"use client";
import ActionResultPage from "@/components/organisms/ActionResultPage";
import { PATHNAME } from "@/constants";

export default function ExchangeSuccessPage() {
  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="교환 제시"
          result="성공"
          buttonText="나의 판매 포토카드에서 확인하기"
          buttonAction={() => (window.location.href = PATHNAME.MPSELLER)}
        />
      </div>
    </div>
  );
}
