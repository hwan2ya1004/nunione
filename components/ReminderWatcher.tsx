// components/ReminderWatcher.tsx  (어딘가 레이아웃에 포함)
"use client";
import { useEffect, useState } from "react";

export default function ReminderWatcher() {
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      const now = Date.now();

      const due = (data.posts || []).filter((p: any) =>
        p.nextRemindAt && new Date(p.nextRemindAt).getTime() <= now
      );

      if (mounted) {
        setDueCount(due.length);
        // 뱃지 토글
        const badge = document.getElementById("bell-badge");
        if (badge) badge.style.display = due.length > 0 ? "inline-flex" : "none";

        // 선택: Web Notification (권한 허용 시)
        if (due.length > 0 && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification("안경 기록 점검 알림", {
              body: `확인할 기록이 ${due.length}건 있어요.`,
            });
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission();
          }
        }
      }
    })();

    return () => { mounted = false; };
  }, []);

  return null;
}
