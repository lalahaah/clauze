// src/components/ContractUploader.tsx
// PDF 업로드 컴포넌트 - react-dropzone 기반 drag & drop

"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ContractUploaderProps {
  onUploadComplete: (reviewId: string) => void;
  onError: (error: string) => void;
  userId?: string | null;
}

const LOAD_STEPS = [
  "PDF 파싱 중...",
  "조항 분류 중...",
  "위험도 분석 중...",
  "요약 생성 중...",
];

export function ContractUploader({
  onUploadComplete,
  onError,
  userId,
}: ContractUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const processFile = useCallback(
    async (file: File) => {
      // 파일 유효성 검사
      if (file.type !== "application/pdf") {
        setError("PDF 파일만 업로드 가능합니다.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다.");
        return;
      }

      setError("");
      setLoading(true);
      setFileName(file.name);
      setProgress(0);

      // 진행 단계 시뮬레이션 (AI 분석 중 UX 개선)
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
        });

        clearInterval(interval);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "검토 중 오류가 발생했습니다.");
        }

        setProgress(100);
        setStepText("완료!");

        const data = await response.json();
        setTimeout(() => {
          setLoading(false);
          onUploadComplete(data.reviewId);
        }, 500);
      } catch (err) {
        clearInterval(interval);
        setLoading(false);
        const message =
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
        setError(message);
        onError(message);
      }
    },
    [userId, onUploadComplete, onError]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) processFile(acceptedFiles[0]);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: loading,
  });

  if (loading) {
    return (
      <div className="border-2 border-dashed border-[#4F8EF7] rounded-xl bg-blue-50 p-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <FileText className="w-10 h-10 text-[#4F8EF7]" />
          <div className="text-sm font-medium text-[#4F8EF7]">{stepText}</div>
          <Progress value={progress} className="w-64 h-1.5" />
          <div className="text-xs text-[#8A8FAA]">{fileName}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-[#4F8EF7] bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-[#D0D5E8] bg-white hover:border-[#4F8EF7] hover:bg-blue-50/30"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          {error ? (
            <AlertCircle className="w-10 h-10 text-red-400" />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-[#4F8EF7]" />
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-[#1A1A2E] mb-1">
              {isDragActive
                ? "여기에 놓으세요"
                : "계약서 PDF를 드래그하거나 클릭하세요"}
            </p>
            <p className="text-xs text-[#8A8FAA]">최대 10MB · PDF 형식</p>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
