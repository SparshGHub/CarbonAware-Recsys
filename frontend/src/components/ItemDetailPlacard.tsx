"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, Package } from "lucide-react";
import { CARBON_GRADING } from "@/config/constants";

interface Ingredient {
  name: string;
  amount?: number;
  co2PerKg: number;
  contribution: number;
}

interface FoodItem {
  id: string | number;
  name: string;
  carbonScore: number;
  carbonGrade: "A" | "B" | "C" | "D" | "E";
  description?: string;
  price?: number;
  distance?: number;
  ingredients?: Ingredient[];
}

interface ItemDetailPlacard {
  item: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailPlacard({
  item,
  isOpen,
  onClose,
}: ItemDetailPlacard) {
  if (!item) return null;

  const gradeInfo = CARBON_GRADING[item.carbonGrade];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header with grade */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-gray-600">{item.description}</p>
                  )}
                </div>
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center font-bold text-white text-3xl shadow-lg flex-shrink-0"
                  style={{ backgroundColor: gradeInfo.color }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.carbonGrade}
                </motion.div>
              </div>

              {/* Basic info grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Carbon Emissions</p>
                  <p className="text-2xl font-bold text-green-700">
                    {item.carbonScore.toFixed(2)} kg CO₂
                  </p>
                </div>
                {item.price && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-2xl font-bold text-blue-700">₹{item.price.toFixed(0)}</p>
                  </div>
                )}
                {item.distance && (
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-sm text-gray-600 mb-1">Distance</p>
                    <p className="text-2xl font-bold text-amber-700">
                      {item.distance.toFixed(1)} km
                    </p>
                  </div>
                )}
              </div>

              {/* Carbon Score explanation */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-start gap-3 mb-3">
                  <Leaf className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Carbon Emission Grade: <span style={{ color: gradeInfo.color }}>{item.carbonGrade}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      This item has a carbon footprint of{" "}
                      <span className="font-semibold">{item.carbonScore.toFixed(2)} kg CO₂</span>.
                      This includes emissions from ingredient production, processing, packaging, and
                      delivery to your location.
                    </p>
                  </div>
                </div>
                <div className="w-full bg-white rounded-full h-3 border border-gray-200">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: gradeInfo.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((item.carbonScore / 10) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>

              {/* Ingredients breakdown */}
              {item.ingredients && item.ingredients.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-orange-600" />
                    <h4 className="font-semibold text-gray-900">Ingredients & Carbon Impact</h4>
                  </div>
                  <div className="space-y-2">
                    {item.ingredients.map((ingredient, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">
                            {ingredient.name}
                            {ingredient.amount && (
                              <span className="text-sm text-gray-600 ml-2">({ingredient.amount} g)</span>
                            )}
                          </span>
                          <span className="text-sm font-semibold text-orange-600">
                            {ingredient.contribution.toFixed(3)} kg CO₂
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{ingredient.co2PerKg.toFixed(2)} kg CO₂/kg</span>
                          <div className="w-24 bg-gray-200 rounded-full h-1.5">
                            <motion.div
                              className="h-full rounded-full bg-orange-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((ingredient.contribution / 2) * 100, 100)}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.1 + 0.2 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Close Details
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
