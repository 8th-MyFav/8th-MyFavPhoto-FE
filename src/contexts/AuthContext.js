"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 사용자 정보 가져오기
  const fetchUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    // NEXT_PUBLIC_API_URL = https://
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else if (response.status === 401) {
        // 토큰 만료, 리프레시 시도
        const refreshed = await refreshToken();
        if (refreshed) {
          await fetchUser();
        } else {
          localStorage.removeItem("accessToken");
          setUser(null);
        }
      } else {
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보를 가져오는데 실패했습니다:", error);
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 토큰 갱신
  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/token/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("토큰 갱신에 실패했습니다:", error);
      return false;
    }
  };

  // 로그인
  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/SignIn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("accessToken", data.accessToken);
        setUser({ nickname: data.nickname, email: data.email });
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "로그인에 실패했습니다.",
        };
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      // alert(error);
      return { success: false, message: "로그인 중 오류가 발생했습니다." };
    }
  };

  // 회원가입
  const signup = async (email, nickname, password) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            nickname,
            password,
          }),
        }
      );

      if (response.ok) {
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          message: error.message || "회원가입에 실패했습니다.",
        };
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      return { success: false, message: "회원가입 중 오류가 발생했습니다." };
    }
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //전역상태로 공유할 모든 것들을 value에 넣는다
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshToken,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
