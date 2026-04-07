"use client";

import { motion } from "framer-motion";
import { CarbonGrade, CARBON_GRADING } from "@/config/constants";

interface FoodItem {
  id: string | number;
  name: string;
  carbonScore: number;
  carbonGrade: CarbonGrade;
  description?: string;
  price?: number;
  distance?: number;
  ingredients?: string[];
}

interface RecommendationCardProps {
  item: FoodItem;
  index: number;
  onViewDetails: (item: FoodItem) => void;
  model: "baseline" | "carbon-aware";
}

export default function RecommendationCard({
  item,
  index,
  onViewDetails,
  model,
}: RecommendationCardProps) {
  const gradeInfo = CARBON_GRADING[item.carbonGrade];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={() => onViewDetails(item)}
      className="group cursor-pointer bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 p-5 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden"
    >
      {/* Gradient background */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{ backgroundColor: gradeInfo.color }}
      />

      {/* Carbon Grade Badge */}
      <div className="absolute top-4 right-4">
        <motion.div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg"
          style={{ backgroundColor: gradeInfo.color }}
          whileHover={{ scale: 1.1 }}
        >
          {item.carbonGrade}
        </motion.div>
      </div>

      <div className="relative z-10">
        {/* Item name */}
        <h3 className="text-lg font-bold text-gray-900 pr-16 mb-3 line-clamp-2">
          {item.name}
        </h3>

        {/* Carbon score info */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Carbon Emission</span>
            <span className="font-semibold text-gray-900">
              {item.carbonScore.toFixed(2)} kg CO₂
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: gradeInfo.color }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((item.carbonScore / 10) * 100, 100)}%` }}
              transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
            />
          </div>
        </div>

        {/* Details */}
        {(item.description || item.price || item.distance) && (
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            {item.description && <p className="line-clamp-2">{item.description}</p>}
            {item.price && (
              <p>
                <span className="font-medium">₹{item.price.toFixed(0)}</span>
              </p>
            )}
            {item.distance && (
              <p>
                <span className="font-medium">{item.distance.toFixed(1)} km away</span>
              </p>
            )}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="text-sm font-semibold text-green-600 group-hover:text-green-700 flex items-center gap-2"
          animate={{ x: 0 }}
          whileHover={{ x: 4 }}
        >
          View Details →
        </motion.div>
      </div>
    </motion.div>
  );
}
