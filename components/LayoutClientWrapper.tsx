"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export default function LayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // ✅ 로그인 페이지에서는 Header, BottomNav 제거
  const isAuthPage = pathname === "/login";

  return (
    <>
      {/* ✅ 로그인 페이지가 아닐 때만 Header 표시 */}
      {!isAuthPage && <Header />}

      {/* ✅ 메인 컨텐츠 */}
      <main
        className={`flex-1 w-full relative z-0 transition-all ${
          isAuthPage
            ? "mt-0 pb-0 px-0" // 로그인 페이지: 여백 제거
            : "mt-16 pb-[70px] px-4 sm:px-6 lg:px-12" // 기본 페이지 스타일
        }`}
      >
        {children}
      </main>

      {/* ✅ 로그인 페이지가 아닐 때만 하단 네비게이션 표시 */}
      {!isAuthPage && <BottomNav />}
    </>
  );
}
