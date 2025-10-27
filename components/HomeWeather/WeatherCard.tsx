"use client";

import { Sun } from "phosphor-react";

type Props = {
  location?: string;
};

export default function WeatherCard({ location }: Props) {
  // 임시 예시 데이터 (API 연결 시 교체)
  const weather = {
    temp: 11.8,
    desc: "맑음",
    humidity: 37,
    rain: 0,
  };

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
        🌤 현재 날씨
      </h2>

      {/* ☀️ 아이콘 */}
      <Sun size={60} weight="fill" className="text-yellow-400 mb-4" />

      {/* 🌡️ 온도 */}
      <p className="text-4xl sm:text-5xl font-bold text-gray-900">
        {weather.temp}°C
      </p>

      {/* ☁️ 상태 */}
      <p className="text-base sm:text-lg font-medium text-gray-700 mt-1">
        {weather.desc}
      </p>

      {/* 📍 지역 */}
      <p className="text-sm text-gray-500 mt-2">{location || "위치 확인 중..."}</p>

      {/* 💧 습도/강수 */}
      <p className="text-xs text-gray-400 mt-1">
        💧 습도 {weather.humidity}% · 🌧 강수 {weather.rain}%
      </p>
    </div>
  );
}
