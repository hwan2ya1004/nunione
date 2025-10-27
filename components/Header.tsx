"use client";

import Link from "next/link";
import { FaRegBell } from "react-icons/fa"; // ⛓️ Font Awesome 알림 아이콘

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm py-3 px-6 flex justify-between items-center z-50">
      {/* ✅ 왼쪽: Nu’ni 로고 */}
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/favicon.ico"
          alt="Nu’ni 로고"
          width={28}
          height={28}
          className="block"
        />
        <span className="text-lg font-bold text-gray-900">Nu’ni</span>
      </Link>

      {/* ✅ 오른쪽: 알림 아이콘 */}
      <Link
        href="/notifications"
        aria-label="알림 페이지로 이동"
        className="text-gray-600 hover:text-black transition-colors duration-200"
      >
        <FaRegBell size={22} />
      </Link>
    </header>
  );
}
