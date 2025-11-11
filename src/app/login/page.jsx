"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import Button from "@/components/atoms/Button";
import FormGroup from "@/components/molecules/FormGroup";
import Modal from "@/components/molecules/Modal";
import { PATHNAME } from "@/constants";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    content: "",
    buttonText: "확인",
  });

  const emailRegex = /^[\w!#$%&'*+/=?`{|}~^.-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const emailErrorMessage = useMemo(() => {
    const trimmed = email.trim();
    if (!trimmed) return "이메일을 입력해주세요.";
    if (!emailRegex.test(trimmed)) return "유효한 이메일 주소를 입력해주세요.";
    return "";
  }, [email]);

  const passwordErrorMessage = useMemo(() => {
    if (!password.trim()) return "비밀번호를 입력해주세요.";
    return "";
  }, [password]);

  const isEmptyFields = !email.trim() || !password.trim();

  const displayErrors = {
    email: hasSubmitted || touched.email ? emailErrorMessage : "",
    password: hasSubmitted || touched.password ? passwordErrorMessage : "",
  };

  const isFormInvalid = Boolean(emailErrorMessage || passwordErrorMessage);
  const isDisabled = isEmptyFields || isFormInvalid;

  const handleLogin = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    setTouched({ email: true, password: true });

    if (isFormInvalid) return;

    try {
      const response = await login(email, password);

      if (!response.success) {
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
        <Link href={PATHNAME.HOME}>
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
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            error={displayErrors.email}
          />

          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            error={displayErrors.password}
            showPasswordToggle={true}
          />

          <div className="text-noto-xs pb-md flex justify-center">
            <Button
              text="로그인"
              width="520px"
              height="60px"
              className="transition-colors"
              backgroundColor={
                isDisabled ? "var(--color-gray-300)" : "var(--color-main)"
              }
              color={
                isDisabled ? "var(--color-gray-500)" : "var(--color-black)"
              }
              cursor={isDisabled ? "not-allowed" : "pointer"}
              fontSize="18px"
              type="submit"
              disabled={isDisabled}
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
