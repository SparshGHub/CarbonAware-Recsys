"use client";

import { CITIES_DATA } from "@/data/cities";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

interface CitySelectorProps {
  onSelect: (city: string) => void;
  isOpen: boolean;
}

const CITY_META: Record<string, { emoji: string; tagline: string; highlight: string }> = {
  Mumbai: {
    emoji: "🌊",
    tagline: "The City of Dreams",
    highlight: "rgba(6,182,212,0.15)",
  },
  Delhi: {
    emoji: "🏛️",
    tagline: "The Heart of India",
    highlight: "rgba(251,146,60,0.15)",
  },
  Bangalore: {
    emoji: "🌿",
    tagline: "Silicon Valley of India",
    highlight: "rgba(132,204,22,0.15)",
  },
  Hyderabad: {
    emoji: "💎",
    tagline: "The City of Pearls",
    highlight: "rgba(167,139,250,0.15)",
  },
};

export default function CitySelector({ onSelect, isOpen }: CitySelectorProps) {
  const cities = Object.keys(CITIES_DATA);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="city-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(4,8,20,0.82)", backdropFilter: "blur(18px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="w-full max-w-2xl"
            style={{
              background: "linear-gradient(145deg, rgba(13,21,53,0.97) 0%, rgba(9,14,38,0.97) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2rem",
              boxShadow: "0 32px 90px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)",
              padding: "2.5rem",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mb-8"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
                style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.3)", color: "#67e8f9" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 animate-pulse" />
                Step 1 of 2
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="p-3 rounded-2xl" style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.25)" }}>
                  <MapPin className="h-6 w-6" style={{ color: "#67e8f9" }} />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: "#f8fafc" }}>
                    Select Your City
                  </h1>
                  <p className="mt-0.5 text-sm" style={{ color: "#94a3b8" }}>
                    Choose your delivery location to enable carbon-aware ranking
                  </p>
                </div>
              </div>
            </motion.div>

            {/* City Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cities.map((city, i) => {
                const meta = CITY_META[city] ?? { emoji: "🏙️", tagline: "A vibrant city", highlight: "rgba(255,255,255,0.08)" };
                const areaCount = CITIES_DATA[city as keyof typeof CITIES_DATA]?.areas?.length ?? 0;

                return (
                  <motion.button
                    key={city}
                    id={`city-btn-${city.toLowerCase()}`}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.07, type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => onSelect(city)}
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative text-left rounded-2xl overflow-hidden transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      padding: "1.25rem",
                    }}
                  >
                    {/* Hover background */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: meta.highlight }}
                    />

                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl leading-none mt-0.5">{meta.emoji}</span>
                        <div>
                          <p className="text-base font-bold" style={{ color: "#f8fafc" }}>{city}</p>
                          <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{meta.tagline}</p>
                          <p className="mt-2 text-[11px] font-semibold tracking-wider uppercase"
                            style={{ color: "rgba(148,163,184,0.7)" }}>
                            {areaCount} delivery areas
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 group-hover:translate-x-1"
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}>
                        <ArrowRight className="h-4 w-4" style={{ color: "#94a3b8" }} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Footer hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center text-xs"
              style={{ color: "rgba(148,163,184,0.5)" }}
            >
              Location context powers delivery-carbon-aware re‑ranking
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
