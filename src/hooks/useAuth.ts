// src/hooks/useAuth.ts
// Firebase Auth 상태 관리 훅

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User as FirebaseUser, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { User } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Auth 상태 감시
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        setError("");
        if (firebaseUser) {
          setUser(firebaseUser);
          // Firestore에서 사용자 데이터 조회 (나중에 구현)
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            plan: "free",
            reviewCount: 0,
            createdAt: new Date().toISOString(),
          });
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "인증 오류 발생");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Google 로그인
  const signInWithGoogle = async () => {
    try {
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      const message = err instanceof Error ? err.message : "로그인 실패";
      setError(message);
      throw err;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      setError("");
      await signOut(auth);
    } catch (err) {
      const message = err instanceof Error ? err.message : "로그아웃 실패";
      setError(message);
      throw err;
    }
  };

  return {
    user,
    userData,
    loading,
    error,
    signInWithGoogle,
    logout,
    isAuthenticated: !!user,
  };
}
