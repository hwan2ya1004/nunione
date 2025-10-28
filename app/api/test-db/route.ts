import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET

() {
  try {
    const client = await clientPromise;
    const db = client.db("nuni"); // DB 이름 (env 끝에 적은 거)

    console.log(db);

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      message: "✅ MongoDB 연결 성공!",
      collections: collections.map((c) => c.name),
    });
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error);
    return NextResponse.json({ error: "DB 연결 실패" }, { status: 500 });
  }
}
