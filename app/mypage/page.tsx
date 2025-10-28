"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function MyPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<"profile" | "notice">("profile"); // ✅ 탭 상태 추가

  // ✅ 1. 로딩 상태 표시
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-600">
        로딩 중...
      </div>
    );
  }

  // ✅ 2. 로그인 안 된 상태
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 text-gray-800">
        <h2 className="text-lg font-semibold mb-4">로그인이 필요합니다 🙏</h2>
        <Link
          href="/login"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition"
        >
          로그인으로 이동
        </Link>
      </div>
    );
  }

  // ✅ 3. 로그인 된 상태
  const user = session.user;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-sans py-10">
      {/* ✅ 탭 버튼 */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setTab("profile")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            tab === "profile"
              ? "bg-black text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          내 정보
        </button>
        <button
          onClick={() => setTab("notice")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            tab === "notice"
              ? "bg-black text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          공지사항
        </button>
      </div>

      {/* ✅ 탭 내용 */}
      {tab === "profile" ? (
        <div className="bg-white shadow-lg rounded-2xl p-8 w-80 text-center animate-fadeIn">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            👋 안녕하세요, {user?.name ?? "사용자"} 님
          </h2>

          <p className="text-gray-500 text-sm mb-6">{user?.email}</p>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-transform duration-200 active:scale-95"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-3xl animate-fadeIn">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            📢 Nu’ni 공지사항
          </h3>

          {/* ✅ 티스토리 공지사항 iframe */}
          <iframe
            src="https://goldmodu.tistory.com/category/%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD"
            title="Nu’ni 공지사항"
            className="w-full h-[70vh] rounded-lg border border-gray-200"
          ></iframe>
        </div>
      )}
    </div>
  );
}
