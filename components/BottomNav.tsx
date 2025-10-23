"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // ✅ 현재 페이지에 따라 아이콘 색상 변경
  const linkStyle = (path: string) =>
    pathname === path
      ? "flex flex-col items-center text-black font-semibold"
      : "flex flex-col items-center text-gray-400";

  // ✅ 로딩 중엔 임시 스켈레톤 유지
  if (status === "loading") {
    return (
      <nav
        className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[75%]
                   bg-white/90 backdrop-blur-md border border-gray-200 
                   flex justify-around items-center py-3 rounded-2xl
                   shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-40"
        suppressHydrationWarning
      >
        {["🏠", "✍️", "👤"].map((icon, i) => (
          <div key={i} className="flex flex-col items-center text-gray-300">
            <span className="text-lg">{icon}</span>
            <small className="text-[11px] mt-1 opacity-80">
              {["홈", "글쓰기", "마이"][i]}
            </small>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[75%]
                 bg-white/90 backdrop-blur-md border border-gray-200 
                 flex justify-around items-center py-3 rounded-2xl
                 shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-40"
      suppressHydrationWarning
    >
      {/* 🏠 홈 */}
      <Link href="/" className={linkStyle("/")}>
        <span className="text-lg">🏠</span>
        <small className="text-[11px] mt-1">홈</small>
      </Link>

      {/* ✍️ 글쓰기 (중앙 플로팅 버튼) */}
      <div className="relative -top-3">
        <Link
          href="/write"
          className="w-14 h-14 rounded-full bg-black text-white 
                     flex items-center justify-center text-2xl shadow-lg
                     hover:scale-105 transition-transform duration-200"
          aria-label="글쓰기"
        >
          ＋
        </Link>
      </div>

      {/* 👤 마이페이지 or 로그인 */}
      {session ? (
        <Link href="/mypage" className={linkStyle("/mypage")}>
          <span className="text-lg">👤</span>
          <small className="text-[11px] mt-1">마이페이지</small>
        </Link>
      ) : (
        <Link href="/login" className={linkStyle("/login")}>
          <span className="text-lg">🔑</span>
          <small className="text-[11px] mt-1">로그인</small>
        </Link>
      )}
    </nav>
  );
}
