"use client";

import { motion } from "framer-motion";
import RecommendationCard from "./RecommendationCard";
import { RefreshCcw } from "lucide-react";

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

interface RecommendationsListProps {
  baselineItems: FoodItem[];
  carbonAwareItems: FoodItem[];
  onViewDetails: (item: FoodItem) => void;
  loading: boolean;
  reranking: boolean;
  k: number;
}

export default function RecommendationsList({
  baselineItems,
  carbonAwareItems,
  onViewDetails,
  loading,
  reranking,
  k,
}: RecommendationsListProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mx-auto flex w-full max-w-6xl items-center justify-center py-12"
      >
        <div className="text-center">
          <div className="inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-12 w-12 rounded-full border-4 border-white/20 border-t-cyan-200"
            />
          </div>
          <p className="mt-4 font-medium text-shell-fog">Finding recommendations...</p>
        </div>
      </motion.div>
    );
  }

  if (baselineItems.length === 0 && carbonAwareItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-6xl py-12 text-center"
      >
        <div className="rounded-2xl border border-white/15 bg-white/5 p-8">
          <p className="font-medium text-shell-cream">
            Search for food items to see recommendations
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className="mx-auto mb-4 flex w-full max-w-6xl items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-shell-fog">
          Showing top {k} items per model
        </p>
        {reranking && (
          <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/15 px-3 py-1 text-xs font-semibold text-cyan-100">
            <RefreshCcw className="h-3.5 w-3.5 animate-spin" />
            Updating lifecycle list
          </p>
        )}
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Baseline Model */}
        <section className="rounded-3xl border border-coral-300/35 bg-shell-card/70 p-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 rounded-2xl border border-coral-300/40 bg-coral-400/15 p-4"
          >
            <h2 className="font-display text-2xl font-semibold text-shell-cream">
              Commercial Ranking
            </h2>
            <p className="text-sm text-coral-100/90">
              Taste and relevance focused, no explicit carbon optimization.
            </p>
          </motion.div>

          <div className="space-y-4">
            {baselineItems.map((item, index) => (
              <RecommendationCard
                key={`baseline-${item.id}`}
                item={item}
                index={index}
                onViewDetails={onViewDetails}
                model="baseline"
              />
            ))}
          </div>

          {baselineItems.length === 0 && (
            <div className="py-8 text-center text-shell-fog">
              <p>No baseline recommendations available</p>
            </div>
          )}
        </section>

        {/* Carbon-Aware Model */}
        <section className="rounded-3xl border border-cyan-300/35 bg-shell-card/70 p-5">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 rounded-2xl border border-cyan-300/40 bg-cyan-300/15 p-4"
          >
            <h2 className="font-display text-2xl font-semibold text-shell-cream">
              Lifecycle-Aware Ranking
            </h2>
            <p className="text-sm text-cyan-100/90">
              Re-ranked with delivery + footprint trade-offs controlled by lambda.
            </p>
          </motion.div>

          <div className="space-y-4">
            {carbonAwareItems.map((item, index) => (
              <RecommendationCard
                key={`carbon-${item.id}`}
                item={item}
                index={index}
                onViewDetails={onViewDetails}
                model="carbon-aware"
              />
            ))}
          </div>

          {carbonAwareItems.length === 0 && (
            <div className="py-8 text-center text-shell-fog">
              <p>No carbon-aware recommendations available</p>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}
