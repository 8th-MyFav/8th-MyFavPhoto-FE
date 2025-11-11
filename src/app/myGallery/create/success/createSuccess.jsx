import ActionResultPage from "@/components/organisms/ActionResultPage";
import { PATHNAME } from "@/constants";

export default function CreatePhotoSuccessPage({ searchParams }) {
  const rarity = searchParams?.rarity || "";
  const title = searchParams?.title || "";
  const quantity = searchParams?.quantity || "";

  return (
    <ActionResultPage
      type="포토카드 생성"
      result="성공"
      rarity={rarity}
      title={title}
      quantity={quantity}
      buttonText="마이 갤러리로 돌아가기"
      pathAction={PATHNAME.MYGAL}
    />
  );
}
