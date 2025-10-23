import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// ✅ 글 목록 불러오기 (GET)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nuni");

    // (미래용) 로그인 세션별 개인글 필터링 가능
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.email;
    // const posts = await db.collection("posts").find({ userId }).sort({ createdAt: -1 }).toArray();

    const posts = await db
      .collection("posts")
      .find()
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
      content: body.content || "",
      category: body.category || "안경렌즈",
      store: body.store || null, // ✅ 추가된 부분 (상호명 + 주소)
      visibility: body.visibility || "private", // 개인 전용
      remindMonths, // 0 | 3 | 6 | 9 | 12
      nextRemindAt, // Date | null
      image: body.image || null, // ✅ base64 이미지 1장 저장
      createdAt: now,
      // userId: session?.user?.email || null, // (로그인 연동 시)
    };

    // ✅ MongoDB에 저장
    const result = await db.collection("posts").insertOne(newPost);

    // ✅ 클라이언트로 반환
    const savedPost = { _id: result.insertedId, ...newPost };

    return NextResponse.json({
      message: "✅ 글 저장 성공",
      post: savedPost,
    });
  } catch (error) {
    console.error("❌ 글 저장 실패:", error);
    return NextResponse.json({ error: "DB 저장 실패" }, { status: 500 });
  }
}
