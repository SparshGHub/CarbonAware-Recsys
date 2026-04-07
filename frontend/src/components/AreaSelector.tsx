"use client";

import { CITIES_DATA, CityName } from "@/data/cities";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, ArrowLeft, Sparkles } from "lucide-react";

interface AreaSelectorProps {
  isOpen: boolean;
  city: string;
  onSelect: (area: string) => void;
  onBack: () => void;
}

export default function AreaSelector({
  isOpen,
  city,
  onSelect,
  onBack,
}: AreaSelectorProps) {
  if (!isOpen || !city) return null;

  const cityData = CITIES_DATA[city as CityName];
  const areas = cityData?.areas || [];

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
            <button
              onClick={onBack}
              className="mb-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-shell-fog transition hover:border-cyan-300/50 hover:text-shell-cream"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Change City</span>
            </button>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-coral-300/40 bg-coral-400/15 px-3 py-1 text-xs font-semibold text-coral-100">
              <Sparkles className="h-4 w-4" />
              Step 2 of 2
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-2xl border border-cyan-300/40 bg-cyan-300/15 p-3">
                <MapPin className="h-6 w-6 text-cyan-100" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-semibold text-shell-cream">
                  Select Your Area
                </h1>
                <p className="mt-1 text-shell-fog">
                  Choosing in <span className="font-semibold text-cyan-100">{city}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {areas.map((area, index) => (
              <motion.button
                key={area}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelect(area)}
                className="group rounded-xl border border-white/15 bg-white/5 p-4 text-left transition duration-200 hover:border-cyan-300/65 hover:bg-cyan-300/10"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-shell-cream">{area}</span>
                  <ChevronRight className="h-4 w-4 text-shell-fog transition-colors group-hover:text-cyan-100" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
