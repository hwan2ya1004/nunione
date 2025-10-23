"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// ✅ 자외선 예측 함수 (온도와 구름량 기반)
const estimateUV = (clouds: number, temp: number) => {
  if (clouds > 80) return 1;      // 구름 많음 → 낮음
  if (temp > 32) return 8;        // 더울수록 강함
  if (temp > 25) return 6;
  if (temp > 20) return 4;
  return 2;
};

// ✅ 변색렌즈 농도 계산 (0~100%)
const calcTintLevel = (uvi: number) => Math.min(uvi * 12, 100);

export default function HomeWeatherCard() {
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

          if (!apiKey) {
            setError("❌ API 키가 없습니다 (.env.local 확인)");
            return;
          }

          // ✅ 무료 버전 가능한 /data/2.5/weather 사용
          const res = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=kr`
          );

          setWeather(res.data);
        });
      } catch (err) {
        console.error("❌ 날씨 데이터 오류:", err);
        setError("⚠️ 날씨 데이터를 불러올 수 없습니다.");
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl text-center">
        {error}
      </div>
    );
  }

  if (!weather) {
    return (
      <p className="text-gray-400 text-center mb-6 animate-pulse">
        ☁️ 날씨 불러오는 중...
      </p>
    );
  }

  // ✅ 자외선 예측 + 변색렌즈 계산
  const uv = estimateUV(weather.clouds.all, weather.main.temp);
  const tint = calcTintLevel(uv);

  // ✅ 시각적 UI (날씨 카드)
  return (
    <div
      className={`rounded-2xl p-5 shadow-md text-center transition-all ${
        uv >= 6 ? "bg-yellow-100" : uv >= 4 ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">오늘의 안(眼)케어 🌤️</h3>

      <p className="text-gray-700 text-sm">
        {weather.name} / {weather.weather[0].description}
      </p>
      <p className="text-xl font-bold mt-1">
        🌡 {weather.main.temp.toFixed(1)}℃
      </p>

      <p className="text-sm text-gray-600 mt-1">
        💧습도 {weather.main.humidity}% / ☁️구름 {weather.clouds.all}%
      </p>

      <p className="mt-2">☀️ 자외선 지수(예상): {uv}</p>
      <p className="text-sm mt-1">
        🕶️ 변색렌즈 농도: {tint}%
      </p>

      <div className="w-40 h-3 mx-auto mt-1 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-slate-700 transition-all duration-700"
          style={{ width: `${tint}%` }}
        ></div>
      </div>

      {/* ✅ 권장 행동 안내 */}
      <p className="mt-3 text-sm font-medium">
        {uv < 3 && "🟢 오늘은 자외선이 낮아요. 선글라스는 선택사항이에요 😎"}
        {uv >= 3 && uv < 6 && "🟡 보통이에요. SPF30 썬크림을 바르는 게 좋아요!"}
        {uv >= 6 && uv < 8 && "🟠 높아요! 선글라스와 썬크림은 필수입니다!"}
        {uv >= 8 && "🔴 매우 높음! 모자, 선글라스, SPF50 썬크림 필수!"}
      </p>
    </div>
  );
}
