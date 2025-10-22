"use client";

import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/auth/SignIn`,
        {
          method: "POST",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
    } catch (error) {
      alert("error");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex justify-center">
      <div className="block justify-items-center">
        <div>Logo</div>
        <div>
          <form onSubmit={handleLogin}>
            <div>
              <label htmlFor="email">이메일</label>
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="border"
                value={email}
                onChnage={handleEmailChange}
              />
            </div>

            <div>
              <label htmlFor="password">비밀번호</label>
            </div>
            <div>
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
            <button>로그인</button>
          </form>
        </div>
        <div className="flex gap-2">
          <p>최애의 포토가 처음이신가요?</p>
          <Link href="/join">회원가입하기</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
