// src/app/login/page.tsx
// Firebase Auth 연동 - 이메일 + Google 로그인

"use client";

import { useState } from "react";
import Link from "next/link";
import { FileSearch } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Firebase Auth 연동 시 여기에 구현
    console.log("Auth:", { email, password, isSignup });
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#4F8EF7] flex items-center justify-center">
            <FileSearch className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[#1A1A2E] text-lg">ContractAI</span>
        </div>

        <div className="bg-white border border-[#D0D5E8] rounded-2xl p-8">
          <h1 className="text-xl font-bold text-[#1A1A2E] mb-2 tracking-tight">
            {isSignup ? "계정 만들기" : "로그인"}
          </h1>
          <p className="text-sm text-[#8A8FAA] mb-6">
            {isSignup ? "무료로 시작하세요" : "계속하려면 로그인하세요"}
          </p>

          {/* Google login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#D0D5E8] rounded-xl text-sm font-semibold text-[#4A4E6A] hover:bg-gray-50 transition-colors mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google로 계속하기
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-[#D0D5E8]" />
            <span className="text-xs text-[#8A8FAA]">또는</span>
            <div className="flex-1 h-px bg-[#D0D5E8]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D0D5E8] rounded-xl text-sm text-[#1A1A2E] placeholder-[#8A8FAA] focus:outline-none focus:border-[#4F8EF7] focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#D0D5E8] rounded-xl text-sm text-[#1A1A2E] placeholder-[#8A8FAA] focus:outline-none focus:border-[#4F8EF7] focus:ring-2 focus:ring-blue-100 transition-all"
              required
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[#4F8EF7] text-white rounded-xl text-sm font-bold hover:bg-[#3D7DE8] transition-colors"
            >
              {isSignup ? "계정 만들기" : "로그인"}
            </button>
          </form>

          <p className="text-xs text-center text-[#8A8FAA] mt-4">
            {isSignup ? "이미 계정이 있으신가요?" : "계정이 없으신가요?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#4F8EF7] font-semibold hover:underline"
            >
              {isSignup ? "로그인" : "무료 가입"}
            </button>
          </p>
        </div>

        <p className="text-[10px] text-[#8A8FAA] text-center mt-4 leading-[1.6]">
          계속 진행함으로써{" "}
          <Link href="#" className="underline">이용약관</Link>과{" "}
          <Link href="#" className="underline">개인정보처리방침</Link>에 동의합니다.
        </p>
      </div>
    </div>
  );
}
