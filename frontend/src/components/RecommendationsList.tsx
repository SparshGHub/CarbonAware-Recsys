"use client";

import { motion, AnimatePresence } from "framer-motion";
import RecommendationCard from "./RecommendationCard";
import { RefreshCcw, BarChart3, Leaf } from "lucide-react";

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

// Skeleton card placeholder
function SkeletonCard({ idx }: { idx: number }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "rgba(17,26,56,0.7)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="skeleton h-8 w-8 rounded-xl" />
          <div>
            <div className="skeleton h-4 w-36 rounded mb-1.5" style={{ animationDelay: `${idx * 0.1}s` }} />
            <div className="skeleton h-3 w-24 rounded" style={{ animationDelay: `${idx * 0.1 + 0.1}s` }} />
          </div>
        </div>
        <div className="skeleton h-11 w-11 rounded-full" style={{ animationDelay: `${idx * 0.1 + 0.05}s` }} />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="skeleton h-12 rounded-xl" style={{ animationDelay: `${idx * 0.1 + 0.15}s` }} />
        <div className="skeleton h-12 rounded-xl" style={{ animationDelay: `${idx * 0.1 + 0.2}s` }} />
      </div>
      <div className="skeleton h-1.5 w-full rounded-full" style={{ animationDelay: `${idx * 0.1 + 0.25}s` }} />
    </div>
  );
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
        className="mx-auto w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Baseline skeleton */}
          <div className="rounded-3xl p-5" style={{ background: "rgba(17,26,56,0.6)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <div className="mb-5 rounded-2xl p-4" style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)" }}>
              <div className="skeleton h-6 w-48 rounded mb-2" />
              <div className="skeleton h-3.5 w-64 rounded" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} idx={i} />)}
            </div>
          </div>
          {/* Carbon-aware skeleton */}
          <div className="rounded-3xl p-5" style={{ background: "rgba(17,26,56,0.6)", border: "1px solid rgba(34,211,238,0.2)" }}>
            <div className="mb-5 rounded-2xl p-4" style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.2)" }}>
              <div className="skeleton h-6 w-52 rounded mb-2" />
              <div className="skeleton h-3.5 w-64 rounded" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} idx={i + 3} />)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 250, damping: 28 }}
      className="w-full"
    >
      {/* Meta bar */}
      <div className="mx-auto mb-5 flex w-full max-w-6xl items-center justify-between flex-wrap gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#475569" }}>
          Showing top&nbsp;{k}&nbsp;items per model
        </p>
        <AnimatePresence>
          {reranking && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)", color: "#67e8f9" }}
            >
              <RefreshCcw className="h-3.5 w-3.5 animate-spin-slow" />
              Updating lifecycle ranking…
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Two-column layout — FR-6 */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 xl:grid-cols-2">

        {/* ── Commercial Baseline ── */}
        <section
          className="rounded-3xl p-5"
          style={{
            background: "linear-gradient(145deg, rgba(17,26,56,0.75) 0%, rgba(11,18,45,0.8) 100%)",
            border: "1px solid rgba(251,146,60,0.25)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 flex items-start gap-3 rounded-2xl p-4"
            style={{ background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.2)" }}
          >
            <div className="mt-0.5 p-2 rounded-xl" style={{ background: "rgba(251,146,60,0.12)" }}>
              <BarChart3 className="h-4 w-4" style={{ color: "#fb923c" }} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold" style={{ color: "#f8fafc" }}>
                Commercial Ranking
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                Taste &amp; relevance · no carbon optimization · stable across lambda changes
              </p>
            </div>
          </motion.div>

          <div className="space-y-3">
            {baselineItems.map((item, idx) => (
              <RecommendationCard
                key={`baseline-${item.id}`}
                item={item}
                index={idx}
                onViewDetails={onViewDetails}
                model="baseline"
              />
            ))}
            {baselineItems.length === 0 && (
              <div className="py-10 text-center" style={{ color: "#475569" }}>
                No baseline recommendations found
              </div>
            )}
          </div>
        </section>

        {/* ── Lifecycle-Aware ── */}
        <section
          className="rounded-3xl p-5"
          style={{
            background: "linear-gradient(145deg, rgba(17,26,56,0.75) 0%, rgba(11,18,45,0.8) 100%)",
            border: "1px solid rgba(34,211,238,0.25)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5 flex items-start gap-3 rounded-2xl p-4"
            style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.2)" }}
          >
            <div className="mt-0.5 p-2 rounded-xl" style={{ background: "rgba(34,211,238,0.12)" }}>
              <Leaf className="h-4 w-4" style={{ color: "#22d3ee" }} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold" style={{ color: "#f8fafc" }}>
                Lifecycle-Aware Ranking
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                Delivery + footprint trade-offs · re‑ranks with lambda
              </p>
            </div>
          </motion.div>

          <div className="space-y-3" style={{ position: "relative" }}>
            <AnimatePresence mode="popLayout">
              {reranking ? (
                Array.from({ length: Math.max(carbonAwareItems.length, 3) }).map((_, i) => (
                  <SkeletonCard key={`skel-${i}`} idx={i} />
                ))
              ) : (
                carbonAwareItems.map((item, idx) => (
                  <RecommendationCard
                    key={`carbon-${item.id}`}
                    item={item}
                    index={idx}
                    onViewDetails={onViewDetails}
                    model="carbon-aware"
                  />
                ))
              )}
            </AnimatePresence>
            {!reranking && carbonAwareItems.length === 0 && (
              <div className="py-10 text-center" style={{ color: "#475569" }}>
                No lifecycle-aware recommendations found
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
