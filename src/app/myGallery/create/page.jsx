"use client";

import React, { useState } from "react";
import Button from "@/components/atoms/button";
import FormGroup from "@/components/molecules/formGroup";
import Dropdown from "@/components/molecules/dropDown";
import PagesHeader from "@/components/organisms/PagesHeader";
import { GRADE } from "@/constants";

const CreatePhotoPage = () => {
  const [photoName, setPhotoName] = useState("");
  const [grade, setGrade] = useState("");
  const [genre, setGenre] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = (e) => {
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
    }
    if (quantity && quantityNum > 10) {
      newErrors.quantity = "총 발행량은 10장 이하로 선택 가능합니다.";
    }
    if (!photo) newErrors.photo = "사진을 업로드해주세요.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    alert("포토카드 생성 성공!");
  };

  return (
    <div className="bg-black">
      <div className="bg-black mx-x-desktop">
        <div>
          <PagesHeader title="포토카드 생성하기" showButton={false} />
        </div>
        <div className="flex justify-center text-white">
          <div className="w-full max-w-[700px] mt-[120px]">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-[32px]"
            >
              <div className="w-[520px] mx-auto flex flex-col gap-[32px]">
                {/* 포토카드 이름 */}
                <div className="flex flex-col">
                  <label className="text-[16px] mb-[8px]">포토카드 이름</label>
                  <input
                    type="text"
                    value={photoName}
                    onChange={(e) => setPhotoName(e.target.value)}
                    placeholder="포토카드 이름을 입력해주세요"
                    className="flex w-[520px] h-[60px] px-[20px] py-[18px] items-center gap-[10px]
                         rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none
                         placeholder:text-[#A4A4A4]"
                  />
                  {errors.photoName && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.photoName}
                    </p>
                  )}
                </div>

                {/* 등급 */}
                <div className="flex flex-col">
                  <label className="text-[16px] mb-[8px]">등급</label>
                  <div className="flex w-[520px] h-[60px] items-center rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white">
                    <div className="px-[20px] py-[18px]">
                      <Dropdown
                        options={[
                          GRADE.COMMON,
                          GRADE.RARE,
                          GRADE.SUPER_RARE,
                          GRADE.LEGENDARY,
                        ]}
                        placeholder="등급을 선택해주세요"
                        width="480px"
                        height="24px"
                        padding="0"
                        onChange={(opt) => setGrade(opt)}
                        customStyles={{ text: { color: "#DDD" } }}
                      />
                    </div>
                  </div>
                  {errors.grade && (
                    <p className="text-red-500 text-sm mt-2">{errors.grade}</p>
                  )}
                </div>

                {/* 장르 */}
                <div className="flex flex-col">
                  <label className="text-[16px] mb-[8px]">장르</label>
                  <div className="flex w-[520px] h-[60px] items-center rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white">
                    <div className="px-[20px] py-[18px]">
                      <Dropdown
                        options={["풍경", "인물", "추상", "기타"]}
                        placeholder="장르를 선택해주세요"
                        width="480px"
                        height="24px"
                        padding="0"
                        onChange={(opt) => setGenre(opt)}
                        customStyles={{ text: { color: "#DDD" } }}
                      />
                    </div>
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
                    className="flex w-[520px] h-[60px] px-[20px] py-[18px] items-center gap-[10px]
                         rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none
                         placeholder:text-[#A4A4A4]"
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
                    onChange={(e) => {
                      const raw = e.target.value;
                      setQuantity(raw);
                      // 실시간 검증: 10 초과 시 문구 표시
                      const parsed = Number(raw);
                      if (!raw) {
                        setErrors((prev) => ({ ...prev, quantity: "" }));
                        return;
                      }
                      if (Number.isFinite(parsed)) {
                        if (parsed > 10) {
                          setErrors((prev) => ({
                            ...prev,
                            quantity:
                              "총 발행량은 10장 이하로 선택 가능합니다.",
                          }));
                        } else if (parsed < 1) {
                          setErrors((prev) => ({
                            ...prev,
                            quantity: "최소 1장 이상 입력해주세요.",
                          }));
                        } else {
                          setErrors((prev) => ({ ...prev, quantity: "" }));
                        }
                      }
                    }}
                    min="1"
                    max="10"
                    step="1"
                    inputMode="numeric"
                    placeholder="최소 1장, 최대 10장"
                    className="flex w-[520px] h-[60px] px-[20px] py-[18px] items-center gap-[10px]
                         rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none
                         placeholder:text-[#A4A4A4]"
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.quantity}
                    </p>
                  )}
                </div>

                {/* 사진 업로드 */}
                <div className="flex flex-col">
                  <label className="text-[16px] mb-[8px]">사진 업로드</label>
                  <div
                    className={`flex w-[520px] h-[60px] px-[20px] py-[18px] items-center gap-[10px] rounded-[2px] border bg-[#0F0F0F] cursor-pointer justify-between ${
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
                      className="text-[#A4A4A4] cursor-pointer"
                    >
                      {photo ? photo.name : "파일 선택 또는 드래그하여 업로드"}
                    </label>
                  </div>
                  {errors.photo && (
                    <p className="text-red-500 text-sm mt-2">{errors.photo}</p>
                  )}
                </div>

                {/* 설명 */}
                <div className="flex flex-col">
                  <label className="text-[16px] mb-[8px]">포토카드 설명</label>
                  <textarea
                    className="flex w-[520px] min-h-[150px] px-[20px] py-[18px] items-center gap-[10px]
                         rounded-[2px] border border-[#DDD] bg-[#0F0F0F] text-white outline-none
                         resize-none placeholder:text-[#A4A4A4]"
                    placeholder="포토카드에 대한 설명을 입력해주세요"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* 생성하기 버튼 */}
                <div className="flex justify-center mt-[40px]">
                  <Button
                    text="생성하기"
                    width="520px"
                    height="60px"
                    backgroundColor="var(--color-main)"
                    color="var(--color-black)"
                    fontSize="18px"
                    type="submit"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePhotoPage;
