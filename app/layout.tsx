import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata = {
  title: "Nu’ni - 안경 커뮤니티",
  description: "AI 안경 기록 & 커뮤니티 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* ✅ 전역 기준점 + 가로스크롤 방지 */}
      <body className="min-h-screen flex flex-col bg-[#f9fafb] font-sans relative overflow-x-hidden">
        <SessionWrapper>
          {/* ✅ 최상단(클릭/패널) */}
          <Header />

          {/* ✅ 본문은 항상 헤더보다 뒤 (가림 방지) */}
          <main className="flex-1 mt-16 pb-[70px] relative z-0">
            {children}
          </main>

          {/* ✅ 하단 네비 (원하면 z-40 부여) */}
          <BottomNav />
        </SessionWrapper>
      </body>
    </html>
  );
}
