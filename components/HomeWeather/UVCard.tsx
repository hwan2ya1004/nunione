"use client";

import { Sun } from "phosphor-react";

export default function UVCard() {
  const uv = 6;

  const guide =
    uv < 3
      ? { emoji: "🟢", msg: "낮음", desc: "자외선이 거의 없어 안전해요 😎" }
      : uv < 6
      ? { emoji: "🟡", msg: "보통", desc: "SPF30 썬크림 추천 ☀️" }
      : uv < 8
      ? { emoji: "🟠", msg: "높음", desc: "모자와 선글라스 필수!" }
      : { emoji: "🔴", msg: "매우 높음", desc: "SPF50 필수! 실내로 피하세요" };

  return (
    <div
      className="
        h-full min-h-[260px] sm:min-h-[280px] lg:min-h-[300px]
        flex flex-col items-center justify-center
        rounded-3xl shadow-md
        bg-white/70 backdrop-blur-md
        hover:shadow-lg hover:scale-[1.02]
        transition-all duration-300
        text-center
        p-4
      "
    >
      {/* 🏷️ 카드 제목 */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
        🌞 자외선 지수
      </h2>

      {/* ☀️ 아이콘 */}
      <Sun size={60} weight="fill" className="text-yellow-400 mb-4" />

      {/* 🔢 자외선 지수 수치 */}
      <p className="text-4xl sm:text-5xl font-bold text-gray-900">{uv}</p>

      {/* 🟡 상태 */}
      <p className="text-base sm:text-lg font-medium text-gray-700 mt-1">
        {guide.emoji} {guide.msg}
      </p>

      {/* 💬 설명 */}
      <p className="text-sm text-gray-500 mt-2">{guide.desc}</p>
    </div>
  );
}
