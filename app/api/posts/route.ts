import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // 🔹 경로는 실제 프로젝트 구조에 맞게 조정

// ✅ 글 목록 불러오기 (GET)
export async function GET() {
  try {
    // 🔹 로그인 세션 확인
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("nuni");

    // 🔹 로그인한 사용자 글만 불러오기
    const posts = await db
      .collection("posts")
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("❌ 글 불러오기 실패:", error);
    return NextResponse.json({ error: "DB 조회 실패" }, { status: 500 });
  }
}

// ✅ 글 저장하기 (POST)
export async function POST(req: Request) {
  try {
    // 🔹 세션 인증
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("nuni");

    // 🕒 현재 시각
    const now = new Date();

    // 🔔 알림 기간(월 단위) → 다음 알림 날짜 계산
    const remindMonths = Number(body.remindMonths || 0);
    const nextRemindAt =
      remindMonths > 0
        ? new Date(now.getFullYear(), now.getMonth() + remindMonths, now.getDate())
        : null;

    // ✅ 새 문서 구조
    const newPost = {
      userEmail: session.user.email, // 🔹 로그인 사용자 이메일로 식별
      userName: session.user.name || null, // 🔹 추가 (옵션)
      content: body.content || "",
      category: body.category || "안경렌즈",
      store: body.store || null,
      visibility: body.visibility || "private",
      remindMonths,
      nextRemindAt,
      image: body.image || null,
      createdAt: now,
    };

    // ✅ MongoDB에 저장
    const result = await db.collection("posts").insertOne(newPost);

    // ✅ 클라이언트로 반환
    const savedPost = { _id: result.insertedId, ...newPost };

    return NextResponse.json({
      message: "✅ MongoDB에 글 저장 성공",
      post: savedPost,
    });
  } catch (error) {
    console.error("❌ 글 저장 실패:", error);
    return NextResponse.json({ error: "DB 저장 실패" }, { status: 500 });
  }
}
