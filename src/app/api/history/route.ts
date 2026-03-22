// src/app/api/history/route.ts
// 검토 이력 조회 API

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // Firestore 연동 시 여기에 구현
    // const reviewsRef = collection(db, "reviews");
    // const q = query(reviewsRef, where("uid", "==", userId), orderBy("createdAt", "desc"), limit(20));
    // const snapshot = await getDocs(q);
    // const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json({ reviews: [] });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "이력 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
