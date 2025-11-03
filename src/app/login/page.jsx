"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/button";
import FormGroup from "@/components/molecules/formGroup";
import Modal from "@/components/molecules/modal";
import { PATHNAME } from "@/constants";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    buttonText: "확인",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    // 기본 유효성 검사
    const newErrors = { email: "", password: "" };
    if (!email.trim()) newErrors.email = "이메일을 입력해주세요.";
    if (!password.trim()) newErrors.password = "비밀번호를 입력해주세요.";
    setErrors(newErrors);

    // 에러 있으면 로그인 시도 중단
    if (newErrors.email || newErrors.password) return;

    try {
      const response = await login(email, password);

      if (!response.success) {
        // 로그인 실패
        setErrors({
          email: response.field === "email" ? response.message : "",
          password: response.field === "password" ? response.message : "",
        });
        setModalContent({
          title: "로그인 실패",
          content: response.message,
          buttonText: "확인",
        });
        setModalOpen(true);
        return;
      }

      // 로그인 성공
      router.push(PATHNAME.MARKET);
    } catch (err) {
      setErrors({ email: "", password: "서버 오류가 발생했습니다." });
      setModalContent({
        title: "일시적인 오류가 발생했어요",
        content: "잠시 후 다시 시도해주세요.",
        buttonText: "닫기",
      });
      setModalOpen(true);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push(PATHNAME.MARKET);
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) return <div></div>;

  return (
    <div className="bg-black min-h-screen px-xl flex justify-center">
      {modalOpen && (
        <Modal
          title={modalContent.title}
          content={modalContent.content}
          buttonText={modalContent.buttonText}
          onClose={() => setModalOpen(false)}
          onButtonClick={() => setModalOpen(false)}
        />
      )}
      <div className="border-gray-200">
        <Link href={PATHNAME.MARKET}>
          <img
            src="/images/favorite.svg"
            className="flex justify-center px-[95px] mt-[277px] mb-xl h-lg"
            alt="logo"
          />
        </Link>
        <form onSubmit={handleLogin} noValidate>
          <FormGroup
            label="이메일"
            id="email"
            type="email"
            required
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            showPasswordToggle={true}
          />

          <div className="text-noto-xs pb-md flex justify-center">
            <Button
              text="로그인"
              width="520px"
              height="60px"
              backgroundColor="var(--color-main)"
              color="var(--color-black)"
              fontSize="18px"
              type="submit"
            />
          </div>
        </form>

        <div className="flex justify-center gap-4 text-white text-noto-2xs">
          <p>최애의 포토가 처음이신가요?</p>
          <Link
            className="text-main underline underline-offset-4"
            href={PATHNAME.JOIN}
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
