"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function TopRightNotification() {
  const [hasNotification, setHasNotification] = useState(false);

  // ✅ 특정 날짜 예시 (조건식만 유지)
  useEffect(() => {
    const today = new Date();
    const targetDate = new Date("2025-10-25");

    if (
      today.getFullYear() === targetDate.getFullYear() &&
      today.getMonth() === targetDate.getMonth() &&
      today.getDate() === targetDate.getDate()
    ) {
      setHasNotification(true);
    }
  }, []);

  return (
    <div
      className="
        fixed 
        top-2 
        right-4 
        z-[9999] 
        flex 
        items-center 
        justify-center
      "
    >
      <Link
        href="/notifications"
        aria-label="알림 페이지로 이동"
        className="relative flex items-center justify-center"
      >
        {/* 🔔 알림 아이콘 (검정색, 작게) */}
        <span className="text-[22px] text-black">🔔</span>

        {/* ✅ 새 알림 표시 (빨간 점만 작게) */}
        {hasNotification && (
          <span
            className="
              absolute 
              -top-1 
              -right-1 
              bg-red-500 
              w-2.5 
              h-2.5 
              rounded-full
            "
          ></span>
        )}
      </Link>
    </div>
  );
}
