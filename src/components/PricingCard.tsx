// src/components/PricingCard.tsx
// 요금제 카드 컴포넌트

import { Check, X } from "lucide-react";
import { UserPlan } from "@/lib/types";

interface PricingCardProps {
  plan: UserPlan | "free";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  lockedFeatures?: string[];
  cta: string;
  featured?: boolean;
  onSelect: () => void;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  lockedFeatures = [],
  cta,
  featured = false,
  onSelect,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-7 h-full transition-all ${
        featured
          ? "bg-[#4F8EF7] text-white shadow-xl shadow-blue-200 scale-[1.02]"
          : "bg-white border border-[#D0D5E8] hover:border-[#4F8EF7] hover:shadow-md"
      }`}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[#1A1A2E] text-white text-[11px] font-bold px-3 py-1 rounded-full">
            추천
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3
          className={`text-lg font-bold mb-1 ${
            featured ? "text-white" : "text-[#1A1A2E]"
          }`}
        >
          {name}
        </h3>
        <p
          className={`text-xs ${featured ? "text-blue-100" : "text-[#8A8FAA]"}`}
        >
          {description}
        </p>
      </div>

      <div className="flex items-baseline gap-1 mb-7">
        <span
          className={`text-4xl font-extrabold font-mono tracking-tight ${
            featured ? "text-white" : "text-[#1A1A2E]"
          }`}
        >
          {price}
        </span>
        <span
          className={`text-sm ${featured ? "text-blue-100" : "text-[#8A8FAA]"}`}
        >
          {period}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 mb-7">
        {features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <Check
              className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                featured ? "text-white" : "text-[#00C896]"
              }`}
            />
            <span
              className={`text-sm ${
                featured ? "text-white" : "text-[#4A4E6A]"
              }`}
            >
              {f}
            </span>
          </div>
        ))}
        {lockedFeatures.map((f) => (
          <div key={f} className="flex items-start gap-2.5 opacity-40">
            <X className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#8A8FAA]" />
            <span className="text-sm text-[#8A8FAA]">{f}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
          featured
            ? "bg-white text-[#4F8EF7] hover:bg-blue-50"
            : "bg-[#4F8EF7] text-white hover:bg-[#3D7DE8]"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
