// src/app/login/page.tsx
"use client";

import { Suspense } from "react";
import LoginContent from "./login-content";

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F6F7FB", display: "flex", alignItems: "center", justifyContent: "center" }}>로딩 중...</div>}>
      <LoginContent />
    </Suspense>
  );
}
