"use client";
import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async function (e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/auth/SignIn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );
      const data = await response.json();

      console.log("data", data);
      console.log(response);
      if (response.ok === false) {
        throw new Error(`회원가입중 오류가 발생했습니다.${data.message}`);
      }
    } catch (error) {
      alert(error);
    }
    console.log(response);
  };

  const handleEmailChange = function (e) {
    setEmail(e.target.value);
  };
  const handlePasswordChange = function (e) {
    setPassword(e.target.value);
  };

  return (
    <div>
      <div>
        Logo
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email:</label>
          </div>
          <div>
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
            <label htmlFor="password">password:</label>
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
          <div>
            <button className="border">로그인</button>
          </div>
        </form>
        <div className="flex gap-4">
          <p>최애의 포토가 처음이신가요?</p>
          <Link href="/join">회원가입하기</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
