"use client";

import { CITIES_DATA } from "@/data/cities";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight } from "lucide-react";
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
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Select Your City</h1>
                <p className="text-gray-600 mt-1">Choose where you're ordering from</p>
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
                className="relative group text-left p-6 rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-green-50"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-900">{city}</span>
                  <motion.div
                    animate={hoveredCity === city ? { x: 4 } : { x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-green-600" />
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
