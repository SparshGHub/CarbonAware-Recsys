"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LAMBDA_VALUES } from "@/config/constants";
import { Leaf, SlidersHorizontal, RefreshCcw } from "lucide-react";

interface LambdaSliderProps {
  value: number;
  onChange: (value: number) => void;
  loading: boolean;
}

const INTERPRETATIONS: Record<string, { label: string; sublabel: string; color: string }> = {
  "0.0": { label: "Pure Commercial", sublabel: "Taste and relevance drive ranking. Carbon impact is ignored.", color: "#fb923c" },
  "0.2": { label: "Mostly Commercial", sublabel: "Carbon lightly penalizes high-emission items.", color: "#f59e0b" },
  "0.5": { label: "Balanced", sublabel: "Equal weight on relevance and lifecycle footprint.", color: "#22d3ee" },
  "0.7": { label: "Carbon-Leaning", sublabel: "Sustainability significantly shapes your recommendations.", color: "#10b981" },
  "0.9": { label: "Mostly Sustainable", sublabel: "Low-emission choices dominate with minor taste tolerance.", color: "#84cc16" },
  "1.0": { label: "Pure Lifecycle", sublabel: "Only environmental footprint determines ranking.", color: "#bef264" },
};

export default function LambdaSlider({ value, onChange, loading }: LambdaSliderProps) {
  const currentIndex = Math.max(0, LAMBDA_VALUES.indexOf(value));
  const key = value.toFixed(1);
  const interp = INTERPRETATIONS[key] ?? INTERPRETATIONS["0.5"];

  const pct = (currentIndex / (LAMBDA_VALUES.length - 1)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextIndex = Number(e.target.value);
    const newValue = LAMBDA_VALUES[nextIndex] ?? value;
    onChange(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 26 }}
      className="mx-auto w-full max-w-4xl rounded-3xl p-6"
      style={{
        background: "linear-gradient(145deg, rgba(17,26,56,0.85) 0%, rgba(11,18,45,0.9) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <SlidersHorizontal className="h-5 w-5" style={{ color: "#67e8f9" }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#f8fafc" }}>
              Lambda — Carbon Weight
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              Controls lifecycle‑aware list only · commercial list stays fixed
            </p>
          </div>
        </div>

        {/* λ value badge */}
        <motion.div
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-2xl font-black"
          style={{
            background: `${interp.color}18`,
            border: `1.5px solid ${interp.color}55`,
            color: interp.color,
            boxShadow: `0 0 24px ${interp.color}30`,
          }}
        >
          {value.toFixed(1)}
        </motion.div>
      </div>

      {/* Slider track */}
      <div className="mb-4">
        <div className="relative mb-2">
          {/* Custom track background */}
          <div className="absolute inset-y-0 left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                background: `linear-gradient(90deg, #fb923c 0%, #f59e0b 25%, #22d3ee 50%, #10b981 75%, #bef264 100%)`,
                backgroundSize: "200% 100%",
              }}
            />
          </div>
          <input
            id="lambda-slider"
            type="range"
            min={0}
            max={LAMBDA_VALUES.length - 1}
            step={1}
            value={currentIndex}
            onChange={handleChange}
            disabled={loading}
            className="lambda-slider relative w-full"
            style={{
              background: "transparent",
            }}
          />
        </div>

        {/* Tick labels */}
        <div className="grid text-center text-xs" style={{ gridTemplateColumns: `repeat(${LAMBDA_VALUES.length}, 1fr)` }}>
          {LAMBDA_VALUES.map((pt, idx) => {
            const isSelected = pt === value;
            return (
              <button
                key={pt}
                id={`lambda-btn-${pt.toFixed(1).replace(".", "_")}`}
                type="button"
                onClick={() => onChange(pt)}
                disabled={loading}
                className="py-1.5 rounded-lg transition-all duration-200 text-[11px] font-semibold"
                style={{
                  color: isSelected ? interp.color : "#475569",
                  background: isSelected ? `${interp.color}12` : "transparent",
                  borderBottom: isSelected ? `2px solid ${interp.color}` : "2px solid transparent",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {pt.toFixed(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interpretation panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 rounded-2xl p-4"
          style={{
            background: `${interp.color}0d`,
            border: `1px solid ${interp.color}25`,
          }}
        >
          <Leaf className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: interp.color }} />
          <div>
            <p className="text-sm font-bold" style={{ color: interp.color }}>
              {interp.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
              {interp.sublabel}
            </p>
          </div>
          {loading && (
            <RefreshCcw className="ml-auto h-4 w-4 flex-shrink-0 animate-spin-slow" style={{ color: interp.color }} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
