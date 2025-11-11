import ActionResultPage from "@/components/organisms/ActionResultPage";
import { PATHNAME } from "@/constants";

export default function PurchaseSuccessPage({ searchParams }) {
  const rarity = searchParams?.rarity || "";
  const title = searchParams?.title || "";
  const quantity = searchParams?.quantity || "";

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
          pathAction={PATHNAME.MYGAL} // router.push 대신 pathAction으로 처리
        />
      </div>
    </div>
  );
}
