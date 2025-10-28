import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  // ✅ 로그인 완료 후 홈("/")으로 이동
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // url이 외부 주소거나 유효하지 않을 경우 홈으로 이동
      try {
        const target = new URL(url, baseUrl);
        if (target.origin === baseUrl) return target.href;
        return baseUrl;
      } catch {
        return baseUrl; // fallback
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
