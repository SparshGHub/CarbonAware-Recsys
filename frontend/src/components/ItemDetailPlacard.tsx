"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Building2, Route, Wallet, TrendingDown } from "lucide-react";
import { CARBON_GRADING } from "@/config/constants";

interface FoodItem {
  id: string | number;
  name: string;
  restaurantName: string;
  carbonScore: number;
  deliveryCarbon: number;
  totalCarbon: number;
  carbonGrade: "A" | "B" | "C" | "D" | "E";
  price?: number;
  distance?: number;
  relevanceScore?: number;
  totalScore?: number;
}

interface ItemDetailPlacardProps {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const GRADE_MEANINGS: Record<string, string> = {
  A: "Exceptional — ultra-low lifecycle emissions. A top sustainable pick.",
  B: "Great — low footprint across production and delivery.",
  C: "Moderate — acceptable emission level for the category.",
  D: "High — consider pairing with a lower-emission side.",
  E: "Very high — significant environmental cost. Enjoy mindfully.",
};

export default function ItemDetailPlacard({ item, isOpen, onClose }: ItemDetailPlacardProps) {
  if (!item) return null;

  const gradeInfo = CARBON_GRADING[item.carbonGrade];
  const barPct = Math.min((item.totalCarbon / 10) * 100, 100);
  const foodPct = Math.round((item.carbonScore / item.totalCarbon) * 100) || 0;
  const deliveryPct = 100 - foodPct;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="detail-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(4,8,20,0.85)", backdropFilter: "blur(20px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl"
            style={{
              background: "linear-gradient(145deg, rgba(13,21,53,0.98) 0%, rgba(9,14,38,0.98) 100%)",
              border: `1px solid ${gradeInfo.color}30`,
              boxShadow: `0 32px 90px rgba(0,0,0,0.7), 0 0 60px ${gradeInfo.color}12`,
            }}
          >
            {/* Sticky header */}
            <div
              className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
              style={{
                background: "rgba(9,14,38,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
                Item Details
              </p>
              <button
                onClick={onClose}
                className="rounded-xl p-2 transition-colors"
                style={{ color: "#64748b" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Item name + grade */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold leading-tight" style={{ color: "#f8fafc" }}>
                    {item.name}
                  </h2>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm" style={{ color: "#64748b" }}>
                    <Building2 className="h-4 w-4" style={{ color: "#67e8f9" }} />
                    {item.restaurantName}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.07, rotate: 3 }}
                  className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full text-3xl font-black grade-glow-${item.carbonGrade}`}
                  style={{
                    background: gradeInfo.bgColor,
                    color: gradeInfo.color,
                    border: `3px solid ${gradeInfo.color}60`,
                  }}
                >
                  {item.carbonGrade}
                </motion.div>
              </div>

              {/* Grade meaning */}
              <div className="rounded-2xl p-4" style={{ background: `${gradeInfo.color}0e`, border: `1px solid ${gradeInfo.color}28` }}>
                <div className="flex items-start gap-2.5">
                  <Leaf className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: gradeInfo.color }} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: gradeInfo.color }}>
                      Grade {item.carbonGrade} — {gradeInfo.text}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                      {GRADE_MEANINGS[item.carbonGrade]}
                    </p>
                  </div>
                </div>
                {/* Carbon bar */}
                <div className="mt-3 h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${gradeInfo.color}aa, ${gradeInfo.color})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <p className="mt-1.5 text-right text-xs" style={{ color: "#475569" }}>
                  {item.totalCarbon.toFixed(2)} / 10 kg CO₂e upper bound
                </p>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Total Carbon", value: `${item.totalCarbon.toFixed(2)} kg CO₂e`, icon: TrendingDown, color: gradeInfo.color },
                  { label: "Food Production", value: `${item.carbonScore.toFixed(2)} kg CO₂e`, icon: Leaf, color: "#10b981" },
                  { label: "Delivery Emissions", value: `${item.deliveryCarbon.toFixed(2)} kg CO₂e`, icon: Route, color: "#22d3ee" },
                  ...(typeof item.price === "number"
                    ? [{ label: "Price", value: `₹${item.price}`, icon: Wallet, color: "#bef264" }]
                    : []),
                  ...(typeof item.distance === "number"
                    ? [{ label: "Distance", value: `${item.distance.toFixed(1)} km`, icon: Route, color: "#a78bfa" }]
                    : []),
                ].map(({ label, value, icon: Icon, color }) => (
                  <div
                    key={label}
                    className="rounded-xl p-3.5"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <p className="flex items-center gap-1.5 text-xs mb-1.5" style={{ color: "#475569" }}>
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                      {label}
                    </p>
                    <p className="text-base font-bold" style={{ color: "#f8fafc" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Carbon split bar */}
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#475569" }}>
                  Carbon breakdown
                </p>
                <div className="h-3 w-full rounded-full overflow-hidden flex">
                  <motion.div
                    className="h-full"
                    style={{ background: "#10b981" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${foodPct}%` }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  />
                  <motion.div
                    className="h-full"
                    style={{ background: "#22d3ee" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryPct}%` }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                  />
                </div>
                <div className="mt-2 flex gap-4 text-[11px]" style={{ color: "#64748b" }}>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ background: "#10b981" }} />
                    Food {foodPct}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full inline-block" style={{ background: "#22d3ee" }} />
                    Delivery {deliveryPct}%
                  </span>
                </div>
              </div>

              {/* Score insights */}
              {(typeof item.relevanceScore === "number" || typeof item.totalScore === "number") && (
                <div className="rounded-xl p-3 text-xs" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#475569" }}>
                  <span className="font-semibold" style={{ color: "#64748b" }}>Model scores: </span>
                  {typeof item.relevanceScore === "number" && (
                    <span className="ml-2 rounded px-2 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8" }}>
                      relevance&nbsp;{item.relevanceScore.toFixed(3)}
                    </span>
                  )}
                  {typeof item.totalScore === "number" && (
                    <span className="ml-2 rounded px-2 py-0.5 font-mono" style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8" }}>
                      total&nbsp;{item.totalScore.toFixed(3)}
                    </span>
                  )}
                </div>
              )}

              {/* Close CTA */}
              <button
                onClick={onClose}
                className="w-full rounded-2xl py-3 text-sm font-bold transition-all duration-200"
                style={{
                  background: `${gradeInfo.color}15`,
                  border: `1px solid ${gradeInfo.color}40`,
                  color: gradeInfo.color,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${gradeInfo.color}25`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `${gradeInfo.color}15`;
                }}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
