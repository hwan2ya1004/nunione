import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

if (!uri) {
  throw new Error("⚠️ MONGODB_URI 환경변수가 설정되지 않았습니다!");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// ✅ 개발 환경에서는 전역(global)에 연결 캐싱 (Hot reload 대비)
if (process.env.NODE_ENV === "development") {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect().then((client) => {
      console.log("✅ Connected to MongoDB successfully! (development)");
      return client;
    });
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // ✅ 배포(프로덕션) 환경에서는 매번 새로 연결
  client = new MongoClient(uri, options);
  clientPromise = client.connect().then((client) => {
    console.log("✅ Connected to MongoDB successfully! (production)");
    return client;
  });
}

export default clientPromise;
