"use client";

import { Sunglasses } from "phosphor-react";

export default function TintCard() {
  const tint = 45;

  const guide =
    tint < 30
      ? { icon: "🌤", title: "투명", desc: "실내/흐린 날에 적합" }
      : tint < 60
      ? { icon: "🌥", title: "약한 착색", desc: "은은한 색 변화로 눈부심 완화" }
      : tint < 85
      ? { icon: "☀️", title: "중간 착색", desc: "야외활동에 적합" }
      : { icon: "🌑", title: "진한 착색", desc: "한낮의 강한 햇빛 차단" };

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
        🕶 변색렌즈 농도
      </h2>

      {/* 🕶️ 아이콘 */}
      <Sunglasses size={60} weight="fill" className="text-slate-700 mb-4" />

      {/* 🌈 농도 수치 */}
      <p className="text-4xl sm:text-5xl font-bold text-gray-900">{tint}%</p>

      {/* 🌈 게이지 바 */}
      <div className="w-3/4 h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all duration-700"
          style={{ width: `${tint}%` }}
        />
      </div>

      {/* 🌥 설명 */}
      <p className="text-base sm:text-lg font-medium text-gray-700 mt-3">
        {guide.icon} {guide.title}
      </p>
      <p className="text-sm text-gray-500 mt-1">{guide.desc}</p>
    </div>
  );
}
