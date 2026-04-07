"use client";

import { motion } from "framer-motion";
import { CarbonGrade, CARBON_GRADING } from "@/config/constants";
import { ArrowUpRight, Building2, MapPinned, Coins } from "lucide-react";

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

export default function RecommendationCard({
  item,
  index,
  onViewDetails,
  model,
}: RecommendationCardProps) {
  const gradeInfo = CARBON_GRADING[item.carbonGrade];
  const accentClass =
    model === "carbon-aware"
      ? "border-cyan-300/40 bg-cyan-300/10"
      : "border-coral-300/40 bg-coral-300/10";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onClick={() => onViewDetails(item)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-shell-card/80 p-5 transition hover:border-white/30"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)",
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <div className={`mb-2 inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold ${accentClass}`}>
            #{index + 1}
            <span className="text-shell-fog">{model === "carbon-aware" ? "Lifecycle" : "Commercial"}</span>
          </div>
          <h3 className="pr-6 text-lg font-semibold leading-snug text-shell-cream">{item.name}</h3>
        </div>

        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-black text-shell-ink shadow-lg"
          style={{ backgroundColor: gradeInfo.color }}
          whileHover={{ scale: 1.06 }}
        >
          {item.carbonGrade}
        </motion.div>
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 text-sm text-shell-fog sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-wide text-shell-fog/80">Total Carbon</p>
          <p className="mt-1 text-base font-semibold text-shell-cream">
            {item.totalCarbon.toFixed(2)} kg CO₂e
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-[11px] uppercase tracking-wide text-shell-fog/80">Delivery Carbon</p>
          <p className="mt-1 text-base font-semibold text-shell-cream">
            {item.deliveryCarbon.toFixed(2)} kg CO₂e
          </p>
        </div>
      </div>

      <div className="relative z-10 mt-3 space-y-2 text-sm text-shell-fog">
        <p className="inline-flex items-center gap-2">
          <Building2 className="h-4 w-4 text-cyan-200" />
          {item.restaurantName}
        </p>
        {typeof item.price === "number" && (
          <p className="inline-flex items-center gap-2">
            <Coins className="h-4 w-4 text-lime-200" />
            ₹{item.price.toFixed(0)}
          </p>
        )}
        {typeof item.distance === "number" && (
          <p className="inline-flex items-center gap-2">
            <MapPinned className="h-4 w-4 text-coral-200" />
            {item.distance.toFixed(1)} km away
          </p>
        )}
      </div>

      <div className="relative z-10 mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: gradeInfo.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((item.totalCarbon / 12) * 100, 100)}%` }}
            transition={{ duration: 0.8, delay: index * 0.04 + 0.25 }}
          />
        </div>
      </div>

      <div className="relative z-10 mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-100">
        View details
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>

      <div
        className="pointer-events-none absolute -bottom-14 -right-10 h-28 w-28 rounded-full blur-2xl"
        style={{ backgroundColor: `${gradeInfo.color}66` }}
      />
    </motion.div>
  );
}
