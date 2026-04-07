"use client";

import { motion } from "framer-motion";
import { LAMBDA_VALUES } from "@/config/constants";
import { Leaf, TrendingUp } from "lucide-react";

interface LambdaSliderProps {
  value: number;
  onChange: (value: number) => void;
  loading: boolean;
}

export default function LambdaSlider({
  value,
  onChange,
  loading,
}: LambdaSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Leaf className="w-5 h-5 text-green-600" />
            Environmental Impact Weight
          </label>
          <span className="text-2xl font-bold text-green-600">{value.toFixed(1)}</span>
        </div>
        <p className="text-xs text-gray-600">
          Adjust how much carbon emissions weight in recommendations
        </p>
      </div>

      {/* Slider */}
      <div className="space-y-4">
        <div className="relative pt-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={value}
            onChange={handleChange}
            disabled={loading}
            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #ef4444 0%, #f59e0b 25%, #10b981 50%, #3b82f6 75%, #7c3aed 100%)`
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs font-medium text-gray-600 px-1">
          <div className="text-center flex-1">
            <p className="text-red-600 font-semibold">0</p>
            <p>Pure Taste</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-amber-600 font-semibold">0.5</p>
            <p>Balanced</p>
          </div>
          <div className="text-center flex-1">
            <p className="text-green-600 font-semibold">1.0</p>
            <p>Eco Focus</p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-xs text-gray-700">
          <span className="font-semibold text-green-700">💡 Lambda = {value.toFixed(1)}:</span>
          {value === 0 && " Pure commercial recommendations based on taste and popularity."}
          {value > 0 && value < 0.5 && " Slight preference to lower-carbon options while maintaining taste."}
          {value >= 0.5 && value < 0.7 && " Balanced approach between taste and environmental impact."}
          {value >= 0.7 && value < 1 && " Strong preference for environmentally friendly choices."}
          {value === 1 && " Maximum focus on minimizing carbon emissions."}
        </p>
      </div>
    </motion.div>
  );
}
