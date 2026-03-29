// src/components/ContractUploader.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ReviewResult } from "@/lib/types";
import { DisclaimerModal, hasAgreedToDisclaimer } from "@/components/legal/Disclaimer";

interface ContractUploaderProps {
  onUploadComplete: (reviewId: string, result: ReviewResult, fileName: string) => void;
  onError: (error: string) => void;
  userId?: string | null;
}

const LOAD_STEPS = ["PDF 파싱 중...", "조항 분류 중...", "위험도 분석 중...", "요약 생성 중..."];

export function ContractUploader({ onUploadComplete, onError, userId }: ContractUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setProgress(0);
    setStepText("");
    setFileName("");
  }, []);

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") { setError("PDF 파일만 업로드 가능합니다."); return; }
    if (file.size > 10 * 1024 * 1024) { setError("파일 크기는 10MB 이하여야 합니다."); return; }

    setError("");
    setLoading(true);
    setFileName(file.name);
    setProgress(0);

    abortControllerRef.current = new AbortController();
    let step = 0;
    setStepText(LOAD_STEPS[0]);
    const interval = setInterval(() => {
      step++;
      if (step < LOAD_STEPS.length) {
        setStepText(LOAD_STEPS[step]);
        setProgress((step / LOAD_STEPS.length) * 80);
      }
    }, 4000);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (userId) formData.append("userId", userId);

      const response = await fetch("/api/review", {
        method: "POST",
        body: formData,
        signal: abortControllerRef.current.signal,
      });
      clearInterval(interval);

      if (!response.ok) {
        let errorMsg = "검토 중 오류가 발생했습니다.";
        try {
          const data = await response.json();
          errorMsg = data.error || errorMsg;
        } catch {
          errorMsg = `서버 오류 (${response.status}). 잠시 후 다시 시도해주세요.`;
        }
        throw new Error(errorMsg);
      }

      setProgress(100);
      setStepText("완료!");
      const data = await response.json();
      setTimeout(() => { setLoading(false); onUploadComplete(data.reviewId, data.result, data.fileName); }, 500);
    } catch (err) {
      clearInterval(interval);
      if (err instanceof Error && err.name === "AbortError") {
        setLoading(false);
        return;
      }
      setLoading(false);
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
      onError(message);
    }
  }, [userId, onUploadComplete, onError]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles[0]) return;
    if (hasAgreedToDisclaimer()) {
      processFile(acceptedFiles[0]);
    } else {
      setPendingFile(acceptedFiles[0]);
      setShowDisclaimer(true);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: loading,
  });

  if (loading) {
    return (
      <div style={{
        background: "#FFFFFF",
        border: "2px dashed #00A599",
        borderRadius: 4,
        padding: "52px 32px",
        textAlign: "center",
        position: "relative",
      }}>
        <button
          onClick={handleCancel}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "rgba(4,34,40,0.06)",
            color: "#042228",
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(4,34,40,0.12)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(4,34,40,0.06)"}
        >
          ✕
        </button>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: "#00A599",
            letterSpacing: "0.04em", fontFamily: "'DM Sans', sans-serif",
          }}>
            {stepText.toUpperCase()}
          </div>
          <div style={{ width: 300, height: 3, background: "#F6F7FB", borderRadius: 2, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "#00A599", borderRadius: 2,
              width: `${progress}%`, transition: "width 0.5s ease",
            }} />
          </div>
          <div style={{ fontSize: 12, color: "#7A9A9E", fontFamily: "'DM Sans', sans-serif" }}>{fileName}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {showDisclaimer && (
        <DisclaimerModal
          onAgree={() => {
            setShowDisclaimer(false);
            if (pendingFile) { processFile(pendingFile); setPendingFile(null); }
          }}
          onClose={() => {
            setShowDisclaimer(false);
            setPendingFile(null);
          }}
        />
      )}
      <div
        {...getRootProps()}
        style={{
          background: isDragActive ? "rgba(0,165,153,0.04)" : "#FFFFFF",
          border: `2px dashed ${error ? "#D94F3D" : isDragActive ? "#00A599" : "rgba(4,34,40,0.1)"}`,
          borderRadius: 4,
          padding: "52px 32px",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <input {...getInputProps()} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "#F6F7FB",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 14V4M8 7l3-3 3 3M3 16h16" stroke="#00A599" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#042228", letterSpacing: "-0.02em", marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
              {isDragActive ? "여기에 놓으세요" : "Upload your contract PDF"}
            </p>
            <p style={{ fontSize: 14, color: "#7A9A9E", fontFamily: "'DM Sans', sans-serif" }}>
              Drag & drop or click to select · Max 10MB
            </p>
          </div>
          {error && (
            <p style={{ fontSize: 12, color: "#D94F3D", background: "rgba(217,79,61,0.06)", padding: "6px 14px", borderRadius: 28, fontFamily: "'DM Sans', sans-serif" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
