"use client";

import { motion } from "framer-motion";
import { LAMBDA_VALUES } from "@/config/constants";
import { Leaf, SlidersHorizontal } from "lucide-react";

interface LambdaSliderProps {
  value: number;
  onChange: (value: number) => void;
  loading: boolean;
}

export default function LambdaSlider({
  value,
  onChange,
  loading,
}: LambdaSliderProps) {
  const currentIndex = Math.max(0, LAMBDA_VALUES.indexOf(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number(e.target.value);
    const newValue = LAMBDA_VALUES[nextIndex] ?? value;
    onChange(newValue);
  };

  const interpretation =
    value <= 0.2
      ? "Commercial intent dominates ranking"
      : value < 0.7
        ? "Taste and sustainability are balanced"
        : "Sustainability dominates ranking";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-shell mx-auto w-full max-w-4xl"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-shell-cream">
            <SlidersHorizontal className="h-5 w-5 text-cyan-200" />
            Lambda: lifecycle carbon weight
          </label>
          <p className="mt-1 text-xs text-shell-fog">
            Slider triggers reranking for lifecycle-aware list only
          </p>
        </div>
        <span className="rounded-xl border border-lime-300/30 bg-lime-300/15 px-4 py-2 text-2xl font-bold text-lime-100">
          {value.toFixed(1)}
        </span>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <div className="relative pt-2">
          <input
            type="range"
            min={0}
            max={LAMBDA_VALUES.length - 1}
            step={1}
            value={currentIndex}
            onChange={handleChange}
            disabled={loading}
            className="lambda-slider w-full cursor-pointer appearance-none rounded-lg"
            style={{
              background:
                "linear-gradient(90deg, rgba(251,146,60,0.85) 0%, rgba(34,211,238,0.85) 45%, rgba(190,242,100,0.85) 100%)",
            }}
          />
        </div>

        {/* Labels */}
        <div className="grid grid-cols-6 gap-1 text-center text-xs">
          {LAMBDA_VALUES.map((point, idx) => {
            const selected = point === value;
            return (
              <button
                key={point}
                type="button"
                onClick={() => onChange(point)}
                disabled={loading}
                className={`rounded-lg border px-2 py-1.5 font-semibold transition ${
                  selected
                    ? "border-cyan-300/80 bg-cyan-300/20 text-cyan-100"
                    : "border-white/15 bg-white/5 text-shell-fog hover:border-white/35"
                }`}
              >
                {point.toFixed(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 rounded-2xl border border-white/15 bg-shell-card/70 p-4 text-sm text-shell-fog">
        <p className="inline-flex items-center gap-2 font-semibold text-shell-cream">
          <Leaf className="h-4 w-4 text-lime-200" />
          {interpretation}
        </p>
        <p className="mt-2 text-xs">
          Allowed values: {LAMBDA_VALUES.map((point) => point.toFixed(1)).join(" , ")}
        </p>
      </div>
    </motion.div>
  );
}
