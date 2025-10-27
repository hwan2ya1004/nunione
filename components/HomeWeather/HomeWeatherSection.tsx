"use client";

import WeatherCard from "./WeatherCard";
import UVCard from "./UVCard";
import TintCard from "./TintCard";

type Props = {
  location?: string;
};

export default function HomeWeatherSection({ location }: Props) {
  return (
    <section
      className="
        grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-8
        auto-rows-[1fr]          /* ✅ 각 행을 1fr로 균등화 */
        items-stretch            /* ✅ 카드 래퍼를 세로로 늘이기 */
        mt-14 mb-20
        px-4 sm:px-6 lg:px-8
        max-w-6xl mx-auto
        transition-all duration-300
      "
    >
      {/* 🌤 날씨 카드 */}
      <div className="w-full h-full">
        <WeatherCard location={location} />
      </div>

      {/* 🌞 자외선 카드 */}
      <div className="w-full h-full">
        <UVCard />
      </div>

      {/* 🕶 변색렌즈 카드 */}
      <div className="w-full h-full">
        <TintCard />
      </div>
    </section>
  );
}
