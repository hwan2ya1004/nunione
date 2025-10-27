import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import LayoutClientWrapper from "@/components/LayoutClientWrapper";

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
      <body className="min-h-screen flex flex-col bg-[#f9fafb] font-sans relative overflow-x-hidden">
        {/* ✅ 세션 감싸기 */}
        <SessionWrapper>
          {/* ✅ 클라이언트 전용 Wrapper (Header, Nav 조건부 렌더링 포함) */}
          <LayoutClientWrapper>{children}</LayoutClientWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}
