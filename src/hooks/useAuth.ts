// src/hooks/useAuth.ts
// Firebase Auth 상태 관리 훅

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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

          // Firestore에서 사용자 데이터 조회
          let userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? "",
            plan: "free",
            reviewCount: 0,
            createdAt: new Date().toISOString(),
          };
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const snap = await getDoc(userDocRef);
            if (snap.exists()) {
              const data = snap.data();
              userData = {
                ...userData,
                plan: (data.plan as User["plan"]) ?? "free",
                reviewCount: data.reviewCount ?? 0,
                createdAt: data.createdAt ?? userData.createdAt,
                singleReviewCredits: data.singleReviewCredits,
                subscriptionId: data.subscriptionId,
                subscriptionStatus: data.subscriptionStatus,
                currentPeriodEnd: data.currentPeriodEnd,
                cancelledAt: data.cancelledAt,
                updatedAt: data.updatedAt,
                monthlyReviewCount: data.monthlyReviewCount ?? 0,
              };
              if (!data.email) {
                await setDoc(userDocRef, { email: firebaseUser.email }, { merge: true });
              }
            } else {
              await setDoc(userDocRef, {
                email: firebaseUser.email,
                plan: "free",
                monthlyReviewCount: 0,
                singleReviewCredits: 0,
                createdAt: new Date(),
              });
            }
          } catch {
            // Firestore 조회 실패 시 기본값 유지
          }

          setUserData(userData);
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
