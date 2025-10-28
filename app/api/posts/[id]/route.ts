import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // ✅ 경로 맞게 수정

// ✅ 글 삭제 (본인 글만)
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params; // ✅ Next.js 15: params는 Promise
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("nuni");

    // ✅ 로그인한 사용자의 글만 삭제
    const result = await db
      .collection("posts")
      .deleteOne({ _id: new ObjectId(id), userEmail: session.user.email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "삭제할 권한이 없거나 존재하지 않는 글입니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "✅ 삭제 완료" });
  } catch (error) {
    console.error("❌ 삭제 실패:", error);
    return NextResponse.json({ error: "DB 오류" }, { status: 500 });
  }
}

// ✅ 글 수정 (본인 글만)
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = await req.json();
    const client = await clientPromise;
    const db = client.db("nuni");

    const updateData: any = {};
    if (body.content !== undefined) updateData.content = body.content;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.store !== undefined) updateData.store = body.store;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.remindMonths !== undefined) {
      updateData.remindMonths = body.remindMonths;
      updateData.nextRemindAt =
        body.remindMonths > 0
          ? new Date(
              new Date().getFullYear(),
              new Date().getMonth() + body.remindMonths,
              new Date().getDate()
            )
          : null;
    }
    updateData.updatedAt = new Date();

    // ✅ 로그인한 사용자 글만 수정 가능
    const result = await db
      .collection("posts")
      .updateOne(
        { _id: new ObjectId(id), userEmail: session.user.email },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "수정 권한이 없거나 존재하지 않는 글입니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "✅ 수정 완료",
      updated: updateData,
    });
  } catch (error) {
    console.error("❌ 수정 실패:", error);
    return NextResponse.json({ error: "DB 오류" }, { status: 500 });
  }
}
