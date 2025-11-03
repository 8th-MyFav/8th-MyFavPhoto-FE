"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useReducer, useState } from "react";
import FormGroup from "@/components/molecules/formGroup";
import Button from "@/components/atoms/button";
import { PATHNAME } from "@/constants";

const JoinPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordConfirmation: "",
  });
  const { signup } = useAuth();

  const handleJoin = async function (e) {
    e.preventDefault();

    // 기본 유효성 검사
    const newErrors = {
      email: "",
      nickname: "",
      password: "",
      passwordConfirmation: "",
    };
    if (!email.trim()) newErrors.email = "이메일을 입력해주세요.";
    if (!nickname.trim()) newErrors.nickname = "닉네임을 입력해주세요.";
    if (!password.trim()) newErrors.password = "비밀번호를 입력해주세요.";
    if (!password.trim())
      newErrors.passwordConfirmation = "비밀번호를 확인 해주세요.";
    setErrors(newErrors);

    // 에러 있으면 로그인 시도 중단
    if (
      newErrors.email ||
      newErrors.nickname ||
      newErrors.password ||
      newErrors.passwordConfirmation
    )
      return;

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
      router.push(PATHNAME.LOGIN);
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
    <div className="bg-black min-h-screen px-lg flex justify-center">
      <div className="border-gray-200">
        <Link href={PATHNAME.HOME}>
          <img
            src="/images/favorite.svg"
            className="flex justify-center h-lg px-[95px] mt-[151px] mb-lg "
          />
        </Link>
        <form onSubmit={handleJoin} className="text-white" noValidate>
          <FormGroup
            label="이메일"
            id="email"
            type="email"
            required
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={handleEmailChange}
            error={errors.email}
          />

          <FormGroup
            label="닉네임"
            id="nickname"
            type="nickname"
            required
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={handleNicknameChange}
            error={errors.nickname}
          />

          <FormGroup
            label="비밀번호"
            id="password"
            type="password"
            required
            placeholder="8자 이상 입력해 주세요"
            value={password}
            onChange={handlePasswordChange}
            error={errors.password}
            showPasswordToggle={true}
          />

          <FormGroup
            label="비밀번호 확인"
            id="passwordConfirmation"
            type="password"
            required
            placeholder="비밀번호를 한번 더 입력해 주세요"
            value={passwordConfirmation}
            onChange={handlePasswordConfirmationChange}
            error={errors.passwordConfirmation}
            showPasswordToggle={true}
          />
          <div className="text-noto-xs pb-md">
            <Button
              type="submit"
              text="가입하기"
              width="520px"
              height="60px"
              backgroundColor="var(--color-main)"
              color="var(--color-black)"
              fontSize="18px"
            />
          </div>
        </form>
        <div className="flex justify-center gap-4 text-white text-noto-2xs">
          <p>이미 최애의포토 회원이신가요?</p>
          <Link
            className="text-main underline underline-offset-4"
            href={PATHNAME.LOGIN}
          >
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
