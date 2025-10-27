"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LoginPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner />;

  const handleLogin = (provider) => {
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div
      style={{
        height: "100vh", // ✅ padding 대신 높이 고정
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start", // ✅ 상단 정렬
        background:
          "linear-gradient(135deg, #e0f2fe 0%, #f9fafb 50%, #fff9c4 100%)",
        fontFamily: "Pretendard, sans-serif",
        overflow: "hidden", // ✅ 스크롤 방지
      }}
    >
      <div
        style={{
          background: "white",
          padding: "45px 40px",
          borderRadius: "20px",
          boxShadow: "0 6px 30px rgba(0, 0, 0, 0.1)",
          width: "340px",
          textAlign: "center",
          animation: "fadeIn 0.6s ease-in-out",
          marginTop: "80px", // ✅ 상단 여백을 padding 대신 여기서 줌
        }}
      >
        <img
          src="/favicon.ico"
          alt="Nu’ni 로고"
          width={70}
          height={70}
          style={{
            display: "block",
            margin: "0 auto 20px auto",
          }}
        />

        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#111827",
            marginBottom: "5px",
          }}
        >
          Nu’ni 로그인
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          AI 안경 앱 Nu’ni 서비스에 오신 걸 환영합니다 👓
        </p>

        {/* 🟡 카카오 로그인 */}
        <button
          onClick={() => handleLogin("kakao")}
          style={{
            background: "#FEE500",
            color: "#3C1E1E",
            border: "none",
            borderRadius: "10px",
            padding: "12px 0",
            width: "100%",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            marginBottom: "15px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
          }}
        >
          🟡 카카오 로그인
        </button>

        {/* 💚 네이버 로그인 */}
        <button
          onClick={() => handleLogin("naver")}
          style={{
            background: "#03C75A",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px 0",
            width: "100%",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.04)";
            e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.1)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
          }}
        >
          💚 네이버 로그인
        </button>

        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "25px",
            lineHeight: "1.5",
          }}
        >
          로그인 시 Nu’ni의 이용약관 및 개인정보처리방침에 동의한 것으로
          간주됩니다.
        </p>
      </div>
    </div>
  );
}
