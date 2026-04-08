"use client";

import { CITIES_DATA, CityName } from "@/data/cities";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowLeft, Navigation } from "lucide-react";

interface AreaSelectorProps {
  isOpen: boolean;
  city: string;
  onSelect: (area: string) => void;
  onBack: () => void;
}

export default function AreaSelector({ isOpen, city, onSelect, onBack }: AreaSelectorProps) {
  const cityData = CITIES_DATA[city as CityName];
  const areas = cityData?.areas ?? [];

  return (
    <AnimatePresence>
      {isOpen && city && (
        <motion.div
          key="area-overlay"
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
            {/* Back button */}
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              onClick={onBack}
              whileHover={{ x: -2 }}
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-1.5 transition-colors"
              style={{ color: "#94a3b8", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ArrowLeft className="h-4 w-4" />
              Change City
            </motion.button>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mb-7"
            >
              <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-widest uppercase"
                style={{ background: "rgba(190,242,100,0.1)", border: "1px solid rgba(190,242,100,0.3)", color: "#bef264" }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-lime-300 animate-pulse" />
                Step 2 of 2
              </div>
              <div className="flex items-center gap-4 mt-3">
                <div className="p-3 rounded-2xl" style={{ background: "rgba(190,242,100,0.08)", border: "1px solid rgba(190,242,100,0.2)" }}>
                  <Navigation className="h-6 w-6" style={{ color: "#bef264" }} />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: "#f8fafc" }}>
                    Select Your Area
                  </h1>
                  <p className="mt-0.5 text-sm" style={{ color: "#94a3b8" }}>
                    Delivery in{" "}
                    <span className="font-semibold" style={{ color: "#67e8f9" }}>{city}</span>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Area Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {areas.map((area, i) => (
                <motion.button
                  key={area}
                  id={`area-btn-${area.toLowerCase().replace(/\s+/g, "-")}`}
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.045, type: "spring", stiffness: 350, damping: 28 }}
                  onClick={() => onSelect(area)}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex items-center gap-2 rounded-xl px-4 py-3 text-left transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                    style={{ background: "rgba(190,242,100,0.08)", border: "1px solid rgba(190,242,100,0.25)" }} />
                  <MapPin className="relative z-10 h-3.5 w-3.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#bef264" }} />
                  <span className="relative z-10 text-sm font-medium truncate" style={{ color: "#e2e8f0" }}>
                    {area}
                  </span>
                </motion.button>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-xs"
              style={{ color: "rgba(148,163,184,0.45)" }}
            >
              {areas.length} areas available · delivery distance affects carbon scoring
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
