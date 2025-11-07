"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Dropdown from "@/components/molecules/DropDown";
import { GRADE, GENRE, PATHNAME, buildUrlWithParams } from "@/constants";
import { useCreateCard } from "@/api/cardsAPI";
import { useQueryClient } from "@tanstack/react-query";

const CreatePhotoPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [photoName, setPhotoName] = useState("");
  const [grade, setGrade] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const { mutate: createCards, isPending } = useCreateCard();

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      if (errors.photo) setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setPhoto(file);
      if (errors.photo) setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!photoName.trim())
      newErrors.photoName = "포토카드 이름을 입력해주세요.";
    if (!grade) newErrors.grade = "등급을 선택해주세요.";
    if (!genre) newErrors.genre = "장르를 선택해주세요.";
    if (!price.trim()) newErrors.price = "가격을 입력해주세요.";
    if (!quantity.trim()) newErrors.quantity = "총 발행량을 입력해주세요.";

    const quantityNum = Number(quantity);
    if (quantity && (!Number.isFinite(quantityNum) || quantityNum < 1)) {
      newErrors.quantity = "총 발행량을 입력해주세요.";
    } else if (quantityNum > 10) {
      newErrors.quantity = "총 발행량은 10장 이하로 선택 가능합니다.";
    }

    setErrors(newErrors);

    // ❌ 필드 누락 시 실패 페이지로 이동
    if (Object.keys(newErrors).length > 0) {
      router.push(
        buildUrlWithParams(PATHNAME.CREATE_FAIL, {
          rarity: grade,
          title: photoName,
          quantity,
        })
      );
      return;
    }

    // ✅ 이미지 파일 → base64로 변환
    let base64Image = null;
    if (photo) {
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(photo);
      });
    }

    // ✅ JSON body 형태로 전송
    const cardData = {
      name: photoName,
      grade,
      genre,
      price: Number(price),
      total_issued: Number(quantity),
      description,
      //image: base64Image, // 백엔드에서 이미지 URL 대신 base64 받는 경우
    };

    console.log("📤 전송 데이터:", cardData);

    createCards(cardData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["myCards"] });

        router.push(
          buildUrlWithParams(PATHNAME.CREATE_SUCCESS, {
            rarity: grade,
            title: photoName,
            quantity,
          })
        );
      },
      onError: (error) => {
        console.error("카드 생성 실패:", error);
        router.push(
          buildUrlWithParams(PATHNAME.CREATE_FAIL, {
            rarity: grade,
            title: photoName,
            quantity,
          })
        );
      },
    });
  };

  return (
    <div className="bg-black min-h-screen px-[80px] flex justify-center text-white">
      <div className="mt-[120px]">
        {/* 제목 */}
        <div className="flex flex-col items-start gap-[20px] mb-[32px]">
          <h1 className='text-white font-[400] text-[62px] leading-normal tracking-[-1.86px] font-["BR_B"]'>
            포토카드 생성하기
          </h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1480"
            height="2"
            viewBox="0 0 1480 2"
            fill="none"
          >
            <path d="M0 1H1480" stroke="#EEEEEE" strokeWidth="2" />
          </svg>
        </div>

        {/* 폼 */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-[32px] items-center pb-[100px]"
        >
          <div className="w-[520px] flex flex-col gap-[32px]">
            {/* 포토카드 이름 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">포토카드 이름</label>
              <input
                type="text"
                value={photoName}
                onChange={(e) => setPhotoName(e.target.value)}
                placeholder="포토카드 이름을 입력해주세요"
                className="w-[520px] h-[60px] px-[20px] py-[18px] rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none placeholder:text-[#A4A4A4]"
              />
              {errors.photoName && (
                <p className="text-red-500 text-sm mt-2">{errors.photoName}</p>
              )}
            </div>

            {/* 등급 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">등급</label>
              <div className="flex w-[520px] h-[60px] items-center justify-between rounded-[2px] border border-[#DDD] bg-[#0F0F0F] px-[20px] text-white">
                <p className="text-[#A4A4A4] text-[16px]">
                  {grade || "등급을 선택해주세요"}
                </p>
                <Dropdown
                  options={[
                    GRADE.COMMON,
                    GRADE.RARE,
                    GRADE.SUPER_RARE,
                    GRADE.LEGENDARY,
                  ]}
                  onChange={(opt) => {
                    setGrade(opt);
                    if (errors.grade)
                      setErrors((prev) => ({ ...prev, grade: "" }));
                  }}
                />
              </div>
              {errors.grade && (
                <p className="text-red-500 text-sm mt-2">{errors.grade}</p>
              )}
            </div>

            {/* 장르 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">장르</label>
              <div className="flex w-[520px] h-[60px] items-center justify-between rounded-[2px] border border-[#DDD] bg-[#0F0F0F] px-[20px] text-white">
                <p className="text-[#A4A4A4] text-[16px]">
                  {genre || "장르를 선택해주세요"}
                </p>
                <Dropdown
                  options={[
                    GENRE.KPOP,
                    GENRE.KBO,
                    GENRE.ESPORTS,
                    GENRE.ANIMATION,
                    GENRE.ACTOR,
                  ]}
                  onChange={(opt) => {
                    setGenre(opt);
                    if (errors.genre)
                      setErrors((prev) => ({ ...prev, genre: "" }));
                  }}
                />
              </div>
              {errors.genre && (
                <p className="text-red-500 text-sm mt-2">{errors.genre}</p>
              )}
            </div>

            {/* 가격 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">최소 가격</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="가격을 입력해주세요"
                className="w-[520px] h-[60px] px-[20px] py-[18px] rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none placeholder:text-[#A4A4A4]"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-2">{errors.price}</p>
              )}
            </div>

            {/* 총 발행량 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">총 발행량</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                max="10"
                placeholder="총 발행량을 입력해 주세요"
                className="w-[520px] h-[60px] px-[20px] py-[18px] rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none placeholder:text-[#A4A4A4]"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-2">{errors.quantity}</p>
              )}
            </div>

            {/* 사진 업로드 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">사진 업로드</label>
              <div className="flex gap-[8px] w-[520px]">
                <div
                  className={`flex flex-1 h-[60px] px-[20px] py-[18px] items-center gap-[10px] rounded-[2px] border bg-[#0F0F0F] cursor-pointer overflow-hidden ${
                    isDragOver ? "border-yellow-300" : "border-[#DDD]"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photoUpload"
                  />
                  <label
                    htmlFor="photoUpload"
                    className="text-[#A4A4A4] cursor-pointer whitespace-nowrap overflow-hidden"
                    style={{ textOverflow: "ellipsis", display: "block" }}
                  >
                    {photo ? photo.name : "파일 선택 또는 드래그하여 업로드"}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => document.getElementById("photoUpload").click()}
                  className="flex justify-center items-center bg-[var(--color-main)] text-black rounded-[2px]"
                  style={{
                    width: "120px",
                    height: "60px",
                    padding: "18px 28px",
                    gap: "10px",
                  }}
                >
                  파일 선택
                </button>
              </div>
              {errors.photo && (
                <p className="text-red-500 text-sm mt-2">{errors.photo}</p>
              )}
            </div>

            {/* 설명 */}
            <div className="flex flex-col">
              <label className="text-[16px] mb-[8px]">포토카드 설명</label>
              <textarea
                className="w-[520px] min-h-[150px] px-[20px] py-[18px] rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none resize-none placeholder:text-[#A4A4A4]"
                placeholder="포토카드에 대한 설명을 입력해주세요"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* 생성하기 버튼 */}
            <div className="flex justify-center mt-[40px]">
              <Button
                text={isPending ? "생성 중..." : "생성하기"}
                width="520px"
                height="60px"
                backgroundColor={isPending ? "#5A5A5A" : "var(--color-main)"}
                color="var(--color-black)"
                fontSize="18px"
                type="submit"
                disabled={isPending}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePhotoPage;
