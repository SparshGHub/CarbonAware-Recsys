"use client";

import { CITIES_DATA, CityName } from "@/data/cities";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronRight, ArrowLeft } from "lucide-react";

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
            <button
              onClick={onBack}
              className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Change City</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Select Your Area
                </h1>
                <p className="text-gray-600 mt-1">
                  Choosing in <span className="font-semibold text-green-600">{city}</span>
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
                className="group text-left p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 transition-all duration-200 bg-gray-50 hover:bg-green-50"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{area}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
