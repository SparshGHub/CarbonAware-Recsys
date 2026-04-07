"use client";

import { CITIES_DATA } from "@/data/cities";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, Sparkles } from "lucide-react";
import { useState } from "react";

interface CitySelectorProps {
  onSelect: (city: string) => void;
  isOpen: boolean;
}

export default function CitySelector({ onSelect, isOpen }: CitySelectorProps) {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  if (!isOpen) return null;

  const cities = Object.keys(CITIES_DATA);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-shell-ink/70 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.35 }}
          className="w-full max-w-3xl rounded-3xl border border-white/20 bg-shell-card/95 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
        >
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-coral-300/40 bg-coral-400/15 px-3 py-1 text-xs font-semibold text-coral-100">
              <Sparkles className="h-4 w-4" />
              Step 1 of 2
            </div>
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-2xl border border-cyan-300/40 bg-cyan-300/15 p-3">
                <MapPin className="h-6 w-6 text-cyan-100" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold text-shell-cream">Select Your City</h1>
                <p className="mt-1 text-shell-fog">Choose where you are ordering from</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cities.map((city) => (
              <motion.button
                key={city}
                onHoverStart={() => setHoveredCity(city)}
                onHoverEnd={() => setHoveredCity(null)}
                onClick={() => onSelect(city)}
                className="group relative rounded-2xl border border-white/15 bg-white/5 p-5 text-left transition duration-200 hover:border-cyan-300/65 hover:bg-cyan-300/10"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-shell-cream">{city}</span>
                  <motion.div
                    animate={hoveredCity === city ? { x: 4 } : { x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-5 w-5 text-cyan-100" />
                  </motion.div>
                </div>
                <p className="mt-2 text-sm text-shell-fog">View areas and delivery distance context</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
