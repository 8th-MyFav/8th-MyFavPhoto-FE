"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

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
