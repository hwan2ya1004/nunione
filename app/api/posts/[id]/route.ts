import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// ✅ 글 삭제
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params; // 🔸 Next.js 15: params 반드시 await
    const client = await clientPromise;
    const db = client.db("nuni");

    const result = await db.collection("posts").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "삭제 실패" }, { status: 404 });
    }
    return NextResponse.json({ message: "✅ 삭제 완료" });
  } catch (error) {
    console.error("❌ 삭제 실패:", error);
    return NextResponse.json({ error: "DB 오류" }, { status: 500 });
  }
}

// ✅ 글 수정 (부분 업데이트 가능)
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params; // 🔸 Next.js 15: params await
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

    const result = await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "수정 대상 없음" }, { status: 404 });
    }
    return NextResponse.json({ message: "✅ 수정 완료", updated: updateData });
  } catch (error) {
    console.error("❌ 수정 실패:", error);
    return NextResponse.json({ error: "DB 오류" }, { status: 500 });
  }
}
