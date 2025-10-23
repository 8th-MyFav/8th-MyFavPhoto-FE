"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useReducer, useState } from "react";

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
          <div className="pb-[34px]">
            <div className="pb-[10px]">
              <label htmlFor="email">이메일:</label>
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="border w-[520px] h-[60px] rounded-xs py-[18px] px-[20px] text-[var(--color-gray-200)] text-[16px]"
                placeholder="이메일을 입력해주세요"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
          </div>
          <div className="pb-[34px]">
            <div className="pb-[10px]">
              <label htmlFor="nickname">닉네임:</label>
            </div>
            <div>
              <input
                type="text"
                id="nickname"
                name="nickname"
                required
                className="border w-[520px] h-[60px] rounded-xs py-[18px] px-[20px] text-[var(--color-gray-200)] text-[16px]"
                placeholder="닉네임을 입력해 주세요"
                value={nickname}
                onChange={handleNicknameChange}
              />
            </div>
          </div>
          <div className="pb-[34px]">
            <div className="pb-[10px]">
              <label htmlFor="password">비밀번호:</label>
            </div>
            <div>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="border w-[520px] h-[60px] rounded-xs py-[18px] px-[20px] text-[var(--color-gray-200)] text-[16px]"
                placeholder="8자 이상 입력해 주세요"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>
          <div className="pb-[34px]">
            <div className="pb-[10px]">
              <label htmlFor="passwordConfirmation">비밀번호 확인:</label>
            </div>
            <div>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                required
                className="border w-[520px] h-[60px] rounded-xs py-[18px] px-[20px] text-[var(--color-gray-200)] text-[16px]"
                placeholder="비밀번호를 한번 더 입력해 주세요"
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
              />
            </div>
          </div>
          <div>
            <button className="bg-[var(--color-main)] px-[235px] py-[17px] rounded-xs mt-[42px] mb-[40px] text-black text-center font-bold text-[18px]">
              가입하기
            </button>
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
