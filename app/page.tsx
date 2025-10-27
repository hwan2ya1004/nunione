"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import HomeWeatherSection from "@/components/HomeWeather/HomeWeatherSection";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [location, setLocation] = useState<string>("");

  // ✅ 로그인 감지
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  // ✅ 게시글 불러오기
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts || []));
  }, []);

  // ✅ 카카오 API로 한글 주소 가져오기
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY;
          if (!kakaoKey) return;

          const kakaoRes = await axios.get(
            `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
            { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
          );

          const region = kakaoRes.data.documents?.[0]?.address;
          const fullAddress = region
            ? `${region.region_1depth_name} ${region.region_2depth_name} ${region.region_3depth_name}`
            : "";
          setLocation(fullAddress);
        } catch (err) {
          console.error("❌ 주소 변환 오류:", err);
        }
      },
      () => console.warn("📍 위치 권한이 필요합니다.")
    );
  }, []);

  // ✅ 게시글 삭제
  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠어요?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  // ✅ 게시글 수정
  const handleEdit = (id: string, content: string) => {
    setEditId(id);
    setEditContent(content);
    setMenuOpenId(null);
  };

  // ✅ 게시글 저장
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

  if (status === "loading") {
    return (
      <p className="text-center mt-20 text-gray-500">
        ⏳ 로그인 상태 확인 중...
      </p>
    );
  }

  return (
    <div className="font-sans bg-[#f8fafc] flex flex-col min-h-screen">
      <main className="flex-1 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full">
        {status === "unauthenticated" ? (
          <p className="text-center mt-20 text-gray-400">🔒 로그인 중...</p>
        ) : (
          <>
            {/* ✅ 날씨 섹션 */}
            <HomeWeatherSection location={location} />

            {/* ✅ 게시글 목록 */}
            {posts.length === 0 ? (
              <p className="text-gray-400 text-center mt-10">
                아직 기록이 없습니다 😎
              </p>
            ) : (
              <div className="space-y-6 mt-6 mb-24">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="
                      relative
                      bg-white rounded-2xl
                      shadow-sm border border-gray-100
                      overflow-hidden
                      transition-all duration-300
                      hover:shadow-md hover:-translate-y-1
                    "
                  >
                    {/* 🔖 카테고리 + 메뉴 */}
                    <div className="flex justify-between items-center px-5 pt-4">
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

                    {/* 🖼 게시글 이미지 */}
                    {post.image && (
                      <img
                        src={post.image}
                        alt="기록 이미지"
                        className="
                          w-full h-auto
                          max-h-[380px]
                          object-contain object-center
                          bg-gradient-to-b from-white to-gray-50
                          mt-3
                          border-y border-gray-100
                          transition-transform duration-300
                          hover:scale-[1.01]
                        "
                        loading="lazy"
                      />
                    )}

                    {/* ✏ 내용 영역 */}
                    <div className="px-5 pb-5 pt-3">
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
                        <>
                          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                            {post.content}
                          </p>
                          {post.store && (
                            <p className="mt-2 text-sm text-gray-600 flex items-center gap-1">
                              📍 {post.store}
                            </p>
                          )}
                          <p className="text-[11px] text-gray-400 mt-2 text-right">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
