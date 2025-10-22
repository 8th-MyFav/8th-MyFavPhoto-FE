"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useReducer, useState } from "react";

const JoinPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleJoin = async function (e) {
    e.preventDefault();
    // alert("alert");
    console.log(email, nickname, password, passwordConfirmation);
    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/auth/signUp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            nickname,

            password,
            passwordConfirmation,
          }),
        }
      );
      const data = await response.json();

      console.log("data", data);
      console.log(response);
      if (response.ok === false) {
        throw new Error(`회원가입중 오류가 발생했습니다.${data.message}`);
      }

      alert("회원가입이 완료 되었습니다.");
      router.push(`/login`);
    } catch (error) {
      alert(error);
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
    <div>
      <div>
        Logo
        <form onSubmit={handleJoin}>
          <div>
            <label htmlFor="email">이메일:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="border"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div>
            <label htmlFor="nickname">닉네임:</label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              required
              className="border"
              value={nickname}
              onChange={handleNicknameChange}
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="border"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <label htmlFor="passwordConfirmation">비밀번호 확인:</label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              required
              className="border"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
            />
          </div>
          <div>
            <button className="border">가입하기</button>
          </div>
        </form>
        <div className="flex gap-4">
          <p>이미 최애의포토 회원이신가요?</p>
          <Link href="/login">로그인하기</Link>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
