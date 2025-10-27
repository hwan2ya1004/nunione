"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function WritePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("안경렌즈");
  const [remindMonths, setRemindMonths] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  // ✅ 이미지 업로드
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageCompression = (await import("browser-image-compression")).default;
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    });
    const reader = new FileReader();
    reader.readAsDataURL(compressed);
    reader.onloadend = () => setImage(reader.result as string);
  };

  const removeImage = () => setImage(null);

  // ✅ 글 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return alert("내용 또는 사진을 입력하세요!");

    const store =
      storeName.trim() || storeAddress.trim()
        ? `${storeName.trim()} ${storeAddress.trim()}`
        : null;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        category,
        store,
        visibility: "private",
        remindMonths,
        image,
      }),
    });

    if (res.ok) {
      alert("✅ 기록이 저장되었습니다!");
      router.push("/");
    } else {
      alert("❌ 저장 실패");
    }
  };

  // ✅ 다음 주소 검색
  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: (data: any) => setStoreAddress(data.address),
    }).open();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] pb-16">
      {/* ✅ 다음 주소 API 스크립트 */}
      <Script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />

      <div className="max-w-md mx-auto px-5 pt-10">
        <h2 className="text-2xl font-semibold text-center text-[#111] mb-6">
          안경 기록 남기기 ✍️
        </h2>

        {/* ✅ 카드형 폼 */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
        >
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#222]">
              카테고리
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50
                         focus:ring-2 focus:ring-[#111] outline-none transition"
            >
              <option>안경렌즈</option>
              <option>안경테</option>
              <option>안경렌즈+안경테</option>
              <option>콘택트렌즈</option>
              <option>시력검사</option>
            </select>
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#222]">
              내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘의 시력/렌즈/피팅/불편 사항 등을 기록하세요 👓"
              className="w-full border border-gray-200 rounded-xl p-3 min-h-[150px]
                         bg-gray-50 resize-none placeholder:text-gray-400
                         focus:ring-2 focus:ring-[#111] outline-none transition"
            />
          </div>

          {/* 구매 장소 */}
          <div>
            <label className="block text-sm font-medium mb-1 text-[#222]">
              구매 장소 (선택)
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="예: 안경박사 동탄점"
              className="w-full border border-gray-200 rounded-xl p-3 mb-2 bg-gray-50
                         placeholder:text-gray-400 focus:ring-2 focus:ring-[#111] outline-none transition"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={storeAddress}
                readOnly
                placeholder="주소를 검색하세요"
                className="flex-1 border border-gray-200 rounded-xl p-3 bg-gray-50
                           placeholder:text-gray-400 focus:ring-2 focus:ring-[#111] outline-none transition"
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className="px-4 py-2 rounded-xl bg-[#111] text-white text-sm
                           hover:bg-black transition font-medium"
              >
                검색
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              상호명 또는 주소 중 하나만 입력해도 됩니다.
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#222]">
              사진 첨부 (1장)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm border border-gray-200 rounded-lg cursor-pointer 
                         file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 
                         file:text-sm file:font-medium file:bg-[#111] file:text-white hover:file:bg-black transition"
            />
            {image && (
              <div className="relative mt-3">
                <img
                  src={image}
                  alt="미리보기"
                  className="rounded-xl border w-full max-h-[260px] object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black/60 text-white text-xs rounded-full px-2 py-1 hover:bg-black"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* ✅ 리마인드 설정 (수정됨) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-[#222]">
              리마인드 설정
            </label>

            <div className="grid grid-cols-3 gap-2">
              {[0, 3, 6, 9, 12].map((m) => (
                <div
                  key={m}
                  role="radio"
                  aria-checked={remindMonths === m}
                  tabIndex={0}
                  onClick={() => setRemindMonths(m)}
                  onKeyDown={(e) => e.key === "Enter" && setRemindMonths(m)}
                  className={`py-2 rounded-lg border text-sm font-medium cursor-pointer select-none transition-all text-center
                    ${
                      remindMonths === m
                        ? "bg-[#111] text-white border-[#111]"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                    }`}
                >
                  {m === 0 ? "없음" : `${m}개월`}
                </div>
              ))}
            </div>
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#111] text-white font-semibold 
                       hover:bg-black transition-all shadow-[0_2px_6px_rgba(0,0,0,0.15)]"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  );
}
