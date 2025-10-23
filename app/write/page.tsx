"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script"; // ✅ 다음 주소 API용

export default function WritePage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("안경렌즈");
  const [remindMonths, setRemindMonths] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [storeName, setStoreName] = useState(""); // ✅ 상호명
  const [storeAddress, setStoreAddress] = useState(""); // ✅ 주소

  // ✅ 이미지 업로드 (1장)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageCompression = (await import("browser-image-compression")).default;

    const options = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };

    try {
      const compressed = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressed);
      reader.onloadend = () => setImage(reader.result as string);
    } catch (err) {
      console.error("❌ 이미지 압축 실패:", err);
    }
  };

  // ✅ 이미지 제거
  const removeImage = () => setImage(null);

  // ✅ 글 등록
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return alert("내용 또는 사진을 입력하세요!");

    // 상호명 + 주소 합치기 (둘 다 없으면 null)
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
        store, // ✅ 통합된 문자열로 저장
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

  // ✅ 다음 주소 API 팝업 실행 함수
  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setStoreAddress(data.address);
      },
    }).open();
  };

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-6">
      {/* ✅ 다음 주소 API 스크립트 로드 */}
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      <h2 className="text-lg font-semibold mb-4">안경 기록 남기기 ✍️</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ✅ 카테고리 */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option>안경렌즈</option>
          <option>안경테</option>
          <option>안경렌즈+안경테</option>
          <option>콘택트렌즈</option>
          <option>시력검사</option>
        </select>

        {/* ✅ 내용 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 시력/렌즈/피팅/불편 사항 등을 기록하세요 👓"
          className="w-full border rounded-lg p-3 min-h-[140px] resize-none focus:ring-2 focus:ring-black outline-none"
        />

        {/* ✅ 구매 장소 (선택 입력) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            구매 장소 (선택)
          </label>

          {/* 상호명 */}
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="예: 안경박사 동탄점"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-black outline-none"
          />

          {/* 주소 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={storeAddress}
              readOnly
              placeholder="주소를 검색하세요"
              className="flex-1 border rounded-lg p-2 bg-gray-50 focus:ring-2 focus:ring-black outline-none"
            />
            <button
              type="button"
              onClick={handleAddressSearch}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm hover:bg-black transition"
            >
              주소 검색
            </button>
          </div>

          <p className="text-xs text-gray-500">
            상호명 또는 주소 중 하나만 입력해도 됩니다.
          </p>
        </div>

        {/* ✅ 이미지 업로드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            사진 첨부 (1장)
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm border border-gray-300 rounded-md cursor-pointer file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
          />

          {image && (
            <div className="relative mt-3">
              <img
                src={image}
                alt="미리보기"
                className="rounded-xl border w-full max-h-[250px] object-cover"
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

        {/* 🔔 알림 설정 */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "알림 없음", months: 0 },
            { label: "3개월", months: 3 },
            { label: "6개월", months: 6 },
            { label: "9개월", months: 9 },
            { label: "1년", months: 12 },
          ].map((r) => (
            <label
              key={r.label}
              className={`border rounded p-2 text-center cursor-pointer ${
                remindMonths === r.months
                  ? "bg-black text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              <input
                type="radio"
                name="remind"
                className="hidden"
                checked={remindMonths === r.months}
                onChange={() => setRemindMonths(r.months)}
              />
              {r.label}
            </label>
          ))}
        </div>

        {/* ✅ 등록 버튼 */}
        <button
          type="submit"
          className="w-full h-11 rounded-lg bg-black text-white mt-4 hover:bg-gray-800 transition"
        >
          등록하기
        </button>
      </form>
    </div>
  );
}
