"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [weather, setWeather] = useState<any>(null);

  // ✅ 영어 → 한글 도시명 매핑
  const cityNameMap: Record<string, string> = {
    Seoul: "서울",
    Busan: "부산",
    Incheon: "인천",
    Daegu: "대구",
    Daejeon: "대전",
    Gwangju: "광주",
    Osan: "오산",
    Suwon: "수원",
    Jeju: "제주",
  };

  // ✅ 글 목록 불러오기
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []));
  }, []);

  // ✅ 날씨 + 카카오 주소
  useEffect(() => {
    const fetchWeather = async () => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
            const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;

            if (!apiKey || !kakaoKey) return;

            // ✅ OpenWeather 날씨 데이터
            const weatherRes = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=kr`
            );
            const weatherData = weatherRes.data;

            // ✅ Kakao 좌표 → 주소 변환
            const kakaoRes = await axios.get(
              `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
              { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
            );

            const region = kakaoRes.data.documents?.[0]?.address;
            const fullAddress = region
              ? `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`
              : cityNameMap[weatherData.name] || weatherData.name;

            setWeather({ ...weatherData, koreanLocation: fullAddress });
          } catch (err) {
            console.error("❌ 날씨/주소 API 오류:", err);
          }
        },
        () => {
          console.warn("📍 위치 권한이 필요합니다.");
        }
      );
    };

    fetchWeather();
  }, []);

  // ✅ 날씨별 카드 배경색
  const getWeatherGradient = (main: string) => {
    switch (main) {
      case "Clear":
        return "from-yellow-100 to-amber-200"; // 맑음
      case "Clouds":
        return "from-gray-100 to-slate-200"; // 구름
      case "Rain":
        return "from-blue-200 to-blue-400"; // 비
      case "Thunderstorm":
        return "from-gray-700 to-gray-900 text-white"; // 뇌우
      case "Snow":
        return "from-blue-50 to-gray-100"; // 눈
      case "Mist":
        return "from-gray-200 to-gray-400"; // 안개
      default:
        return "from-slate-100 to-slate-200"; // 기본
    }
  };

  // ✅ 자외선 추정
  const estimateUV = (clouds: number, temp: number) => {
    if (clouds > 80) return 1;
    if (temp > 32) return 8;
    if (temp > 25) return 6;
    if (temp > 20) return 4;
    return 2;
  };

  // ✅ 자외선 가이드 문구
  const renderUVGuide = (uvi: number) => {
    if (uvi < 3) return "● 낮음 — 선글라스는 선택사항이에요 😎";
    if (uvi < 6) return "● 보통 — SPF30 썬크림 바르기!";
    if (uvi < 8) return "● 높음 — 선글라스 & 썬크림 필수!";
    return "● 매우 높음 — 모자, 선글라스, SPF50 필수!";
  };

  // ✅ 변색렌즈 농도 계산
  const calcTintLevel = (uvi: number) => Math.min(uvi * 12, 100);

  // ✅ 게시글 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  // ✅ 게시글 수정 / 저장
  const handleEdit = (id: string, content: string) => {
    setEditId(id);
    setEditContent(content);
    setMenuOpenId(null);
  };

  const handleSave = async (id: string) => {
    if (!editContent.trim()) return alert("내용을 입력하세요!");
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, content: editContent } : p))
      );
      setEditId(null);
      setEditContent("");
    }
  };

  const toggleMenu = (id: string) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="font-sans bg-[#f8fafc] min-h-[calc(100vh-70px)] flex flex-col">
      {/* ✅ 헤더 제거 — layout.tsx에서 전역 관리 */}
      <main className="flex-1 mt-16 px-4 max-w-md mx-auto w-full pb-10">
        {/* ✅ 날씨 카드 */}
        {weather ? (
          <div
            className={`relative overflow-hidden rounded-3xl p-6 mb-6 text-center shadow-xl border border-gray-100 bg-gradient-to-b ${getWeatherGradient(
              weather.weather[0].main
            )}`}
          >
            <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2 text-gray-800">
              ☀ 오늘의 안(眼)케어
            </h3>

            <div className="space-y-1 text-gray-700 text-sm">
              <p className="font-medium text-base">
                📍 {weather.koreanLocation} — {weather.weather[0].description}
              </p>
              <p className="text-lg font-semibold">
                🌡 {weather.main.temp.toFixed(1)}℃
              </p>
              <p className="text-xs opacity-80">
                💧습도 {weather.main.humidity}% / ☁ 구름 {weather.clouds.all}%
              </p>
            </div>

            <div className="mt-4 bg-white/60 rounded-2xl px-4 py-3 shadow-inner">
              <p className="text-sm text-gray-800">
                ☀ 자외선 지수(예상):{" "}
                <span className="font-semibold">
                  {estimateUV(weather.clouds.all, weather.main.temp)}
                </span>
              </p>
              <p className="text-[13px] mt-1 text-gray-600 italic">
                {renderUVGuide(
                  estimateUV(weather.clouds.all, weather.main.temp)
                )}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-sm mb-1 text-gray-700">
                🕶 변색렌즈 농도{" "}
                <span className="font-semibold">
                  {calcTintLevel(
                    estimateUV(weather.clouds.all, weather.main.temp)
                  )}
                  %
                </span>
              </p>
              <div className="w-full h-3 bg-slate-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-800 transition-all duration-700"
                  style={{
                    width: `${calcTintLevel(
                      estimateUV(weather.clouds.all, weather.main.temp)
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center mb-6">☁ 날씨 불러오는 중...</p>
        )}

        {/* ✅ 게시글 목록 */}
        {posts.length === 0 ? (
          <p className="text-gray-400 text-center mt-10">
            아직 기록이 없습니다 😎
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post._id}
                className="relative bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    {post.category || "미분류"}
                  </span>

                  <button
                    onClick={() => toggleMenu(post._id)}
                    className="text-gray-400 hover:text-black text-xl leading-none"
                  >
                    ⋯
                  </button>

                  {menuOpenId === post._id && (
                    <div className="absolute top-8 right-4 bg-white border border-gray-200 rounded-xl shadow-lg z-20 w-[100px]">
                      <button
                        onClick={() => handleEdit(post._id, post.content)}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        ✏ 수정
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm text-red-500"
                      >
                        🗑 삭제
                      </button>
                    </div>
                  )}
                </div>

                {post.image && (
                  <img
                    src={post.image}
                    alt="기록 이미지"
                    className="w-full max-h-[250px] object-cover rounded-xl mt-3 border"
                  />
                )}

                {editId === post._id ? (
                  <div className="mt-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSave(post._id)}
                        className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                    {post.store && (
                      <p className="mt-2 text-sm text-gray-600">📍 {post.store}</p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-2 text-right">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
