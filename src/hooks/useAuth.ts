// src/hooks/useAuth.ts
// Firebase Auth 상태 관리 훅

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { User as FirebaseUser, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { User } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        setError("");
        if (firebaseUser) {
          setUser(firebaseUser);

          // Firestore에서 사용자 플랜 조회
          let plan: User["plan"] = "free";
          try {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) {
              plan = (snap.data().plan as User["plan"]) ?? "free";
            }
          } catch {
            // Firestore 조회 실패 시 기본값 유지
          }

          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            plan,
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
