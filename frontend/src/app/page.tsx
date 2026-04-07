"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Leaf, MapPin, RotateCcw } from "lucide-react";
import CitySelector from "@/components/CitySelector";
import AreaSelector from "@/components/AreaSelector";
import SearchBar from "@/components/SearchBar";
import LambdaSlider from "@/components/LambdaSlider";
import RecommendationsList from "@/components/RecommendationsList";
import ItemDetailPlacard from "@/components/ItemDetailPlacard";
import { K_RECOMMENDATIONS, API_CONFIG } from "@/config/constants";


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

interface RecommendationResponse {
  baseline: FoodItem[];
  carbon_aware: FoodItem[];
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"city" | "area" | "search">("city");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [lambda, setLambda] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [baselineRecommendations, setBaselineRecommendations] = useState<FoodItem[]>([]);
  const [carbonAwareRecommendations, setCarbonAwareRecommendations] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showDetailPlacard, setShowDetailPlacard] = useState(false);

  const handleCitySelect = useCallback((city: string) => {
    setSelectedCity(city);
    setCurrentStep("area");
  }, []);

  const handleAreaSelect = useCallback((area: string) => {
    setSelectedArea(area);
    setCurrentStep("search");
  }, []);

  const handleChangeLocation = useCallback(() => {
    setCurrentStep("city");
    setSelectedCity("");
    setSelectedArea("");
    setSearchQuery("");
    setBaselineRecommendations([]);
    setCarbonAwareRecommendations([]);
  }, []);

  const handleSearch = useCallback(async () => {
    if (!selectedCity || !selectedArea || !searchQuery.trim()) return;

    setLoading(true);
    try {
      // First request - get initial recommendations with lambda value
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECOMMENDATIONS}?` +
        `query=${encodeURIComponent(searchQuery)}&` +
        `city=${encodeURIComponent(selectedCity)}&` +
        `area=${encodeURIComponent(selectedArea)}&` +
        `lambda=${lambda}&` +
        `k=${K_RECOMMENDATIONS}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data: RecommendationResponse = await response.json();
      setBaselineRecommendations(data.baseline || []);
      setCarbonAwareRecommendations(data.carbon_aware || []);
    } catch (error) {
      console.error("Search error:", error);
      // Fallback: show empty results
      setBaselineRecommendations([]);
      setCarbonAwareRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCity, selectedArea, searchQuery, lambda]);

  const handleLambdaChange = useCallback(
    async (newLambda: number) => {
      setLambda(newLambda);

      // Only update carbon-aware recommendations when lambda changes
      if (!selectedCity || !selectedArea || !searchQuery.trim()) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CARBON_AWARE_RERANK}?` +
          `query=${encodeURIComponent(searchQuery)}&` +
          `city=${encodeURIComponent(selectedCity)}&` +
          `area=${encodeURIComponent(selectedArea)}&` +
          `lambda=${newLambda}&` +
          `k=${K_RECOMMENDATIONS}`,
          { method: "GET" }
        );

        if (!response.ok) throw new Error("Failed to rerank recommendations");

        const data = await response.json();
        setCarbonAwareRecommendations(data.carbon_aware || []);
      } catch (error) {
        console.error("Lambda update error:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCity, selectedArea, searchQuery]
  );

  const handleViewDetails = (item: FoodItem) => {
    setSelectedItem(item);
    setShowDetailPlacard(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white bg-opacity-80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">EcoRecSys</h1>
                <p className="text-xs text-gray-600">Carbon-Aware Food Recommendations</p>
              </div>
            </div>

            {currentStep === "search" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleChangeLocation}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
              >
                <MapPin className="w-4 h-4" />
                Change Location
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step: City & Area Selection */}
        <CitySelector
          isOpen={currentStep === "city"}
          onSelect={handleCitySelect}
        />

        <AreaSelector
          isOpen={currentStep === "area"}
          city={selectedCity}
          onSelect={handleAreaSelect}
          onBack={() => setCurrentStep("city")}
        />

        {/* Step: Search & Results */}
        {currentStep === "search" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Location Display */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-700 bg-green-50 rounded-xl border border-green-200 p-4"
            >
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-semibold">{selectedCity}</span>
              <span className="text-gray-400">•</span>
              <span className="font-semibold">{selectedArea}</span>
            </motion.div>

            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              loading={loading}
              city={selectedCity}
              area={selectedArea}
            />

            {/* Results with Lambda Slider */}
            {baselineRecommendations.length > 0 || carbonAwareRecommendations.length > 0 ? (
              <>
                {/* Lambda Slider */}
                <LambdaSlider
                  value={lambda}
                  onChange={handleLambdaChange}
                  loading={loading}
                />

                {/* Recommendations Grid */}
                <RecommendationsList
                  baselineItems={baselineRecommendations}
                  carbonAwareItems={carbonAwareRecommendations}
                  onViewDetails={handleViewDetails}
                  loading={false}
                />
              </>
            ) : null}
          </motion.div>
        )}
      </div>

      {/* Item Detail Placard */}
      <ItemDetailPlacard
        item={selectedItem}
        isOpen={showDetailPlacard}
        onClose={() => setShowDetailPlacard(false)}
      />

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border-t border-gray-200 bg-white mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>
              Making sustainable food choices, one recommendation at a time.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Powered by lifecycle carbon-aware recommendation models
            </p>
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
