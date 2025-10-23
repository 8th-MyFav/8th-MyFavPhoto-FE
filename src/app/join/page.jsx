"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useReducer, useState } from "react";
import FormGroup from "../components/molecules/formGroup";
import Button from "../components/atoms/button";

const JoinPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { signup } = useAuth();

  const handleJoin = async function (e) {
    e.preventDefault();

    const response = await signup(
      email,
      nickname,
      password,
      passwordConfirmation
    );
    console.log(response);
    if (response.success === false) {
      alert(response.message);
    } else {
      alert(`회원가입에 성공하였습니다.`);
      router.push(`/login`);
    }
  };

  const handleEmailChange = function (e) {
    setEmail(e.target.value);
  };
  const handleNicknameChange = function (e) {
    setNickname(e.target.value);
  };
  const handlePasswordChange = function (e) {
    setPassword(e.target.value);
  };
  const handlePasswordConfirmationChange = function (e) {
    setPasswordConfirmation(e.target.value);
  };

  return (
    <div className="bg-black min-h-screen px-[80px] flex justify-center">
      <div className="border-[var(--color-gray-200)]">
        <img
          src="/images/favorite.svg"
          className="flex justify-center px-[95px] mt-[151px] mb-[80px] h-[60px]"
        />
        <form onSubmit={handleJoin} className="text-white">
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
            label="닉네임"
            id="nickname"
            type="nickname"
            required
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={handleNicknameChange}
          />

          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="8자 이상 입력해 주세요"
            value={password}
            onChange={handlePasswordChange}
          />

          <FormGroup
            label="비밀번호 확인"
            id="passwordConfirmation"
            type="passwordConfirmation"
            required
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
          />
          <div className="text-[18px] pb-[40px]">
            <Button
              text="가입하기"
              width="520px"
              height="60px"
              backgroundColor="var(--color-main)"
              color="var(--color-black)"
              fontSize="18px"
            />
          </div>
        </form>
        <div className="flex justify-center gap-4 text-white text-[16px]">
          <p>이미 최애의포토 회원이신가요?</p>
          <Link
            className="text-[var(--color-main)] underline underline-offset-4"
            href="/login"
          >
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
