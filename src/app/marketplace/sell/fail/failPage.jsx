import ActionResultPage from "@/components/organisms/ActionResultPage";

export default function SellFailPage({ searchParams }) {
  const rarity = searchParams?.rarity || "";
  const title = searchParams?.title || "";
  const quantity = searchParams?.quantity || "";

  return (
    <div className="bg-black m-auto">
      <div className="bg-black min-h-screen flex items-center justify-center">
        <ActionResultPage
          type="판매 등록"
          result="실패"
          rarity={rarity}
          title={title}
          quantity={quantity}
          buttonText="마켓 플레이스로 돌아가기"
        />
      </div>
    </div>
  );
}
