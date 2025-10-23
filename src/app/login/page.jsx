"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Button from "../components/atoms/button";
import FormGroup from "../components/molecules/formGroup";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async function (e) {
    e.preventDefault();
    const response = await login(email, password);
    console.log(response);
    if (response.success === false) {
      alert(response.message);
    } else {
      console.log("here");
      router.push(`/`);
    }
  };

  const handleEmailChange = function (e) {
    setEmail(e.target.value);
  };
  const handlePasswordChange = function (e) {
    setPassword(e.target.value);
  };

  // 로그인 되어있으면 메인페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return <div></div>;
  }

  return (
    <div className="bg-black min-h-screen px-[80px] flex justify-center">
      <div className="border-[var(--color-gray-200)]">
        <img
          src="/images/favorite.svg"
          className="flex justify-center px-[95px] mt-[277px] mb-[80px] h-[60px]"
        />
        <form onSubmit={handleLogin}>
          <FormGroup
            label="이메일"
            id="email"
            type="email"
            required
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmailChange}
          />

          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="비밀번호를 입력해주세요"
            value={password}
            onChange={handlePasswordChange}
          />

          <div className="text-[18px] pb-[40px]">
            <Button
              text="로그인"
              width="520px"
              height="60px"
              backgroundColor="var(--color-main)"
              color="var(--color-black)"
              fontSize="18px"
            />
          </div>
        </form>
        <div className="flex justify-center gap-4 text-white text-[16px]">
          <p>최애의 포토가 처음이신가요?</p>
          <Link
            className="text-[var(--color-main)] underline underline-offset-4"
            href="/join"
          >
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
