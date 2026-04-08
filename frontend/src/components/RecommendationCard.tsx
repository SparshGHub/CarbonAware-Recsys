"use client";

import { motion } from "framer-motion";
import { CarbonGrade, CARBON_GRADING } from "@/config/constants";
import { Building2, Coins, MapPinned, ChevronRight } from "lucide-react";

interface FoodItem {
  id: string | number;
  name: string;
  restaurantName: string;
  carbonScore: number;
  deliveryCarbon: number;
  totalCarbon: number;
  carbonGrade: CarbonGrade;
  price?: number;
  distance?: number;
  relevanceScore?: number;
  totalScore?: number;
}

interface RecommendationCardProps {
  item: FoodItem;
  index: number;
  onViewDetails: (item: FoodItem) => void;
  model: "baseline" | "carbon-aware";
}

export default function RecommendationCard({ item, index, onViewDetails, model }: RecommendationCardProps) {
  const gradeInfo = CARBON_GRADING[item.carbonGrade];
  const accentColor = model === "carbon-aware" ? "#22d3ee" : "#fb923c";
  const barPct = Math.min((item.totalCarbon / 10) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 260, damping: 26 }}
      whileHover={{ y: -5, scale: 1.008 }}
      onClick={() => onViewDetails(item)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl transition-shadow duration-300"
      style={{
        background: "linear-gradient(145deg, rgba(17,26,56,0.9) 0%, rgba(11,18,45,0.85) 100%)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.border = `1px solid ${accentColor}35`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px ${accentColor}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.09)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";
      }}
    >
      {/* Subtle top sheen */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)` }} />

      {/* Ambient corner glow */}
      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full blur-2xl pointer-events-none"
        style={{ background: `${gradeInfo.color}30` }} />

      <div className="relative z-10 p-5">
        {/* Top row: rank + grade badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            {/* Rank number */}
            <div
              className="animate-rank-pop flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black"
              style={{
                background: `${accentColor}18`,
                border: `1.5px solid ${accentColor}40`,
                color: accentColor,
              }}
            >
              #{index + 1}
            </div>
            <div>
              <h3 className="text-base font-bold leading-snug" style={{ color: "#f8fafc" }}>
                {item.name}
              </h3>
              <p className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "#64748b" }}>
                <Building2 className="h-3 w-3" />
                {item.restaurantName}
              </p>
            </div>
          </div>

          {/* Carbon grade badge — FR-7 */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-lg font-black grade-glow-${item.carbonGrade}`}
            style={{
              background: gradeInfo.bgColor,
              color: gradeInfo.color,
              border: `2px solid ${gradeInfo.color}60`,
            }}
          >
            {item.carbonGrade}
          </motion.div>
        </div>

        {/* Carbon metrics row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Total Carbon</p>
            <p className="text-sm font-bold" style={{ color: "#f8fafc" }}>
              {item.totalCarbon.toFixed(2)}
              <span className="text-[10px] font-normal ml-1" style={{ color: "#64748b" }}>kg CO₂e</span>
            </p>
          </div>
          <div className="rounded-xl p-2.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "#475569" }}>Delivery Carbon</p>
            <p className="text-sm font-bold" style={{ color: "#f8fafc" }}>
              {item.deliveryCarbon.toFixed(2)}
              <span className="text-[10px] font-normal ml-1" style={{ color: "#64748b" }}>kg CO₂e</span>
            </p>
          </div>
        </div>

        {/* Carbon bar */}
        <div className="mb-3">
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${gradeInfo.color}cc, ${gradeInfo.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${barPct}%` }}
              transition={{ duration: 0.9, delay: index * 0.06 + 0.2, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>

        {/* Bottom meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {typeof item.price === "number" && (
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#94a3b8" }}>
                <Coins className="h-3 w-3" style={{ color: "#bef264" }} />
                ₹{item.price}
              </span>
            )}
            {typeof item.distance === "number" && (
              <span className="inline-flex items-center gap-1 text-xs" style={{ color: "#94a3b8" }}>
                <MapPinned className="h-3 w-3" style={{ color: accentColor }} />
                {item.distance.toFixed(1)} km
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: accentColor }}>
            Details
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
