// app/notifications/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      const now = Date.now();

      const rows = (data.posts || [])
        .filter((p: any) => p.nextRemindAt)
        .map((p: any) => ({
          ...p,
          due: new Date(p.nextRemindAt).getTime() <= now,
        }))
        .sort(
          (a: any, b: any) =>
            new Date(a.nextRemindAt).getTime() - new Date(b.nextRemindAt).getTime()
        );

      setItems(rows);
    })();
  }, []);

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6">
      <h2 className="text-lg font-semibold mb-4">🔔 알림</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center mt-10">
          아직 도래한 알림이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li
              key={p._id}
              className={`border rounded-xl p-4 shadow-sm ${
                p.due ? "bg-amber-50 border-amber-200" : "bg-white"
              }`}
            >
              {/* ✅ 카테고리 */}
              <div className="text-xs text-gray-500 mb-1">{p.category}</div>

              {/* ✅ 내용 */}
              <div className="font-medium text-gray-800 whitespace-pre-line">
                {p.content}
              </div>

              {/* ✅ 상호명 + 주소 */}
              {p.store && (
                <div className="text-sm text-gray-600 mt-1">
                  📍 {p.store}
                </div>
              )}

              {/* ✅ 날짜 */}
              <div className="text-xs text-gray-500 mt-1">
                다음 점검일:{" "}
                <span className="font-medium">
                  {new Date(p.nextRemindAt).toLocaleDateString()}
                </span>
                {p.due && (
                  <span className="ml-2 text-red-600 font-semibold">
                    확인 시기 도래
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
