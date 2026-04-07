"use client";

import { motion } from "framer-motion";
import RecommendationCard from "./RecommendationCard";

interface FoodItem {
  id: string | number;
  name: string;
  carbonScore: number;
  carbonGrade: "A" | "B" | "C" | "D" | "E";
  description?: string;
  price?: number;
  distance?: number;
  ingredients?: any[];
}

interface RecommendationsListProps {
  baselineItems: FoodItem[];
  carbonAwareItems: FoodItem[];
  onViewDetails: (item: FoodItem) => void;
  loading: boolean;
}

export default function RecommendationsList({
  baselineItems,
  carbonAwareItems,
  onViewDetails,
  loading,
}: RecommendationsListProps) {
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-6xl mx-auto flex items-center justify-center py-12"
      >
        <div className="text-center">
          <div className="inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full"
            />
          </div>
          <p className="mt-4 text-gray-600 font-medium">Finding recommendations...</p>
        </div>
      </motion.div>
    );
  }

  if (baselineItems.length === 0 && carbonAwareItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto text-center py-12"
      >
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-8">
          <p className="text-gray-700 font-medium">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Baseline Model */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-red-50 rounded-lg border-2 border-red-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              🍽️ Popular Picks
            </h2>
            <p className="text-sm text-gray-700">
              Traditional recommendations based on taste & popularity only
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
            <div className="text-center py-8 text-gray-500">
              <p>No baseline recommendations available</p>
            </div>
          )}
        </div>

        {/* Carbon-Aware Model */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              🌱 Eco-Friendly Picks
            </h2>
            <p className="text-sm text-gray-700">
              Personalized based on carbon emissions & environmental impact
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
            <div className="text-center py-8 text-gray-500">
              <p>No carbon-aware recommendations available</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
