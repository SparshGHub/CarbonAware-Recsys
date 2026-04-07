"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Building2, Route, Wallet } from "lucide-react";
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

interface ItemDetailPlacard {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailPlacard({
  item,
  isOpen,
  onClose,
}: ItemDetailPlacard) {
  if (!item) return null;

  const gradeInfo = CARBON_GRADING[item.carbonGrade];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-shell-ink/70 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/20 bg-shell-card/95 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          >
            {/* Close button */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-shell-card/95 p-6">
              <h2 className="font-display text-2xl font-semibold text-shell-cream">Item Details</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition hover:bg-white/10"
              >
                <X className="h-6 w-6 text-shell-fog" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header with grade */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="mb-2 font-display text-3xl font-semibold text-shell-cream">{item.name}</h3>
                  <p className="inline-flex items-center gap-2 text-sm text-shell-fog">
                    <Building2 className="h-4 w-4 text-cyan-100" />
                    {item.restaurantName}
                  </p>
                </div>
                <motion.div
                  className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full text-3xl font-black text-shell-ink shadow-lg"
                  style={{ backgroundColor: gradeInfo.color }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.carbonGrade}
                </motion.div>
              </div>

              {/* Basic info grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-sm text-shell-fog">Total Carbon</p>
                  <p className="text-2xl font-bold text-shell-cream">
                    {item.totalCarbon.toFixed(2)} kg CO₂e
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-sm text-shell-fog">Food Carbon</p>
                  <p className="text-2xl font-bold text-shell-cream">
                    {item.carbonScore.toFixed(2)} kg CO₂e
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-1 text-sm text-shell-fog">Delivery Carbon</p>
                  <p className="text-2xl font-bold text-shell-cream">
                    {item.deliveryCarbon.toFixed(2)} kg CO₂e
                  </p>
                </div>
                {typeof item.price === "number" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="mb-1 inline-flex items-center gap-1 text-sm text-shell-fog">
                      <Wallet className="h-4 w-4 text-lime-200" />
                      Price
                    </p>
                    <p className="text-2xl font-bold text-shell-cream">₹{item.price.toFixed(0)}</p>
                  </div>
                )}
                {typeof item.distance === "number" && (
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className="mb-1 inline-flex items-center gap-1 text-sm text-shell-fog">
                      <Route className="h-4 w-4 text-cyan-200" />
                      Distance
                    </p>
                    <p className="text-2xl font-bold text-shell-cream">
                      {item.distance.toFixed(1)} km
                    </p>
                  </div>
                )}
              </div>

              {/* Carbon Score explanation */}
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                <div className="mb-3 flex items-start gap-3">
                  <Leaf className="mt-1 h-5 w-5 flex-shrink-0 text-lime-200" />
                  <div>
                    <p className="font-semibold text-shell-cream">
                      Carbon Emission Grade: <span style={{ color: gradeInfo.color }}>{item.carbonGrade}</span>
                    </p>
                    <p className="mt-1 text-sm text-shell-fog">
                      This item has a carbon footprint of{" "}
                      <span className="font-semibold">{item.totalCarbon.toFixed(2)} kg CO₂e</span>.
                      This includes food production and delivery impact for your selected location.
                    </p>
                  </div>
                </div>
                <div className="h-3 w-full rounded-full border border-white/10 bg-white/10">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: gradeInfo.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.totalCarbon / 12) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-shell-ink/35 p-4 text-xs text-shell-fog">
                Score insights:
                {typeof item.relevanceScore === "number" && (
                  <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-shell-cream">
                    relevance {item.relevanceScore.toFixed(2)}
                  </span>
                )}
                {typeof item.totalScore === "number" && (
                  <span className="ml-2 rounded bg-white/10 px-2 py-0.5 text-shell-cream">
                    ranking score {item.totalScore.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-white/10 pt-4">
                <button
                  onClick={onClose}
                  className="w-full rounded-xl border border-lime-300/40 bg-lime-300/20 py-3 font-semibold text-lime-100 transition hover:border-lime-200/80 hover:bg-lime-300/30"
                >
                  Close Details
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
