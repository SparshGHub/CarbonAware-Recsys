"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, MapPin, Sparkles, RefreshCw, ChevronDown, Zap, ChevronLeft, Home as HomeIcon } from "lucide-react";
import CitySelector from "@/components/CitySelector";
import AreaSelector from "@/components/AreaSelector";
import SearchBar from "@/components/SearchBar";
import LambdaSlider from "@/components/LambdaSlider";
import RecommendationsList from "@/components/RecommendationsList";
import ItemDetailPlacard from "@/components/ItemDetailPlacard";
import {
  getMockRecommendations,
  type ApiRecommendationItem,
  type RecommendationMode,
} from "@/data/mockApi";
import {
  K_RECOMMENDATIONS,
  API_CONFIG,
  CarbonGrade,
  getCarbonGrade,
} from "@/config/constants";

interface FoodItem {
  id: string | number;
  name: string;
  restaurantName: string;
  carbonScore: number;
  deliveryCarbon: number;
  totalCarbon: number;
  carbonGrade: CarbonGrade;
  price?: number;
  distance?: number;
  relevanceScore?: number;
  totalScore?: number;
}

const normalizeRecommendation = (item: ApiRecommendationItem): FoodItem => {
  const totalCarbon = item.total_carbon ?? item.carbon_score ?? 0;
  return {
    id: item.id,
    name: item.name,
    restaurantName: item.restaurant_name ?? "Unknown Restaurant",
    carbonScore: item.carbon_score ?? 0,
    deliveryCarbon: item.delivery_carbon ?? 0,
    totalCarbon,
    carbonGrade: getCarbonGrade(totalCarbon),
    price: item.price,
    distance: item.distance,
    relevanceScore: item.relevance_score,
    totalScore: item.total_score,
  };
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState<"city" | "area" | "search">("city");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [lambda, setLambda] = useState(0.5);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingRerank, setLoadingRerank] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [usingMockData, setUsingMockData] = useState(API_CONFIG.USE_MOCK_API);
  const [baselineRecommendations, setBaselineRecommendations] = useState<FoodItem[]>([]);
  const [carbonAwareRecommendations, setCarbonAwareRecommendations] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showDetailPlacard, setShowDetailPlacard] = useState(false);
  const requestIdRef = useRef(0);

  const hasResults = baselineRecommendations.length > 0 || carbonAwareRecommendations.length > 0;
  const isBusy = loadingSearch || loadingRerank;

  const locationLabel = useMemo(() => {
    if (!selectedCity || !selectedArea) return null;
    return `${selectedCity} · ${selectedArea}`;
  }, [selectedCity, selectedArea]);

  const handleCitySelect = useCallback((city: string) => {
    setSelectedCity(city);
    setCurrentStep("area");
  }, []);

  const handleAreaSelect = useCallback((area: string) => {
    setSelectedArea(area);
    setCurrentStep("search");
  }, []);

  const handleHome = useCallback(() => {
    setCurrentStep("city");
    setSelectedCity("");
    setSelectedArea("");
    setSearchQuery("");
    setErrorMessage("");
    setHasSearched(false);
    setBaselineRecommendations([]);
    setCarbonAwareRecommendations([]);
  }, []);

  const handleBackToArea = useCallback(() => {
    setCurrentStep("area");
  }, []);

  const fetchRecommendations = useCallback(
    async (mode: RecommendationMode, lambdaValue: number) => {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        city: selectedCity,
        area: selectedArea,
        mode,
        limit: String(K_RECOMMENDATIONS),
      });
      if (mode === "lifecycle_aware") params.set("lambda", String(lambdaValue));

      if (API_CONFIG.USE_MOCK_API) {
        const mockData = await getMockRecommendations({
          query: searchQuery.trim(),
          city: selectedCity,
          area: selectedArea,
          mode,
          lambdaValue,
          limit: K_RECOMMENDATIONS,
        });
        setUsingMockData(true);
        return mockData.map(normalizeRecommendation).slice(0, K_RECOMMENDATIONS);
      }

      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECOMMENDATIONS}?${params.toString()}`,
          { method: "GET" }
        );
        if (!response.ok) throw new Error(`Failed to fetch ${mode} recommendations`);
        const data = (await response.json()) as ApiRecommendationItem[];
        setUsingMockData(false);
        return data.map(normalizeRecommendation).slice(0, K_RECOMMENDATIONS);
      } catch (error) {
        console.warn("Falling back to mock:", error);
        const mockData = await getMockRecommendations({
          query: searchQuery.trim(),
          city: selectedCity,
          area: selectedArea,
          mode,
          lambdaValue,
          limit: K_RECOMMENDATIONS,
        });
        setUsingMockData(true);
        return mockData.map(normalizeRecommendation).slice(0, K_RECOMMENDATIONS);
      }
    },
    [searchQuery, selectedCity, selectedArea]
  );

  const handleSearch = useCallback(async () => {
    if (!selectedCity || !selectedArea || !searchQuery.trim()) return;
    const requestId = ++requestIdRef.current;
    setLoadingSearch(true);
    setErrorMessage("");
    setHasSearched(true);
    try {
      const [baselineItems, carbonItems] = await Promise.all([
        fetchRecommendations("commercial", lambda),
        fetchRecommendations("lifecycle_aware", lambda),
      ]);
      if (requestId !== requestIdRef.current) return;
      setBaselineRecommendations(baselineItems);
      setCarbonAwareRecommendations(carbonItems);
    } catch (error) {
      console.error("Search error:", error);
      setBaselineRecommendations([]);
      setCarbonAwareRecommendations([]);
      setErrorMessage("Could not fetch recommendations. Please check API availability and try again.");
    } finally {
      if (requestId === requestIdRef.current) setLoadingSearch(false);
    }
  }, [selectedCity, selectedArea, searchQuery, lambda, fetchRecommendations]);

  const handleLambdaChange = useCallback(
    async (newLambda: number) => {
      setLambda(newLambda);
      if (!hasSearched || !selectedCity || !selectedArea || !searchQuery.trim()) return;
      const requestId = ++requestIdRef.current;
      setLoadingRerank(true);
      setErrorMessage("");
      try {
        const lifecycleItems = await fetchRecommendations("lifecycle_aware", newLambda);
        if (requestId !== requestIdRef.current) return;
        setCarbonAwareRecommendations(lifecycleItems);
      } catch (error) {
        console.error("Lambda update error:", error);
        setErrorMessage("Could not update lifecycle-aware ranking.");
      } finally {
        if (requestId === requestIdRef.current) setLoadingRerank(false);
      }
    },
    [hasSearched, selectedCity, selectedArea, searchQuery, fetchRecommendations]
  );

  const handleViewDetails = (item: FoodItem) => {
    setSelectedItem(item);
    setShowDetailPlacard(true);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: "#060b1d" }}>
      {/* Background layers */}
      <div className="aurora-bg" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />
      <div className="orb orb-lime" aria-hidden="true" />
      <div className="orb orb-cyan" aria-hidden="true" />
      <div className="orb orb-coral" aria-hidden="true" />
      <div className="orb orb-violet" aria-hidden="true" />

      {/* ── HEADER ── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="sticky top-0 z-40"
        style={{
          background: "rgba(6,11,29,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button 
              onClick={handleHome}
              className="flex items-center gap-3 text-left transition-transform hover:scale-[1.02]"
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{
                  background: "linear-gradient(135deg, rgba(132,204,22,0.25) 0%, rgba(16,185,129,0.2) 100%)",
                  border: "1px solid rgba(132,204,22,0.35)",
                  boxShadow: "0 0 20px rgba(132,204,22,0.2)",
                }}
              >
                <Leaf className="h-5 w-5" style={{ color: "#bef264" }} />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-tight" style={{ color: "#f8fafc" }}>
                  EcoRecSys
                </h1>
                <p className="text-[11px] leading-none" style={{ color: "#475569" }}>
                  Carbon-aware recommendations
                </p>
              </div>
            </button>

            {/* Location pill + change button */}
            <div className="flex items-center gap-3">
              {/* FR-4: location context always shown */}
              <AnimatePresence>
                {locationLabel && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="hidden sm:flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{
                      background: "rgba(34,211,238,0.08)",
                      border: "1px solid rgba(34,211,238,0.22)",
                      color: "#67e8f9",
                    }}
                  >
                    <MapPin className="h-3 w-3" />
                    {locationLabel}
                  </motion.div>
                )}
              </AnimatePresence>

              {currentStep === "search" && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleBackToArea}
                  whileHover={{ y: -1 }}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#94a3b8",
                  }}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Back
                </motion.button>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleHome}
                whileHover={{ y: -1 }}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8",
                }}
              >
                <HomeIcon className="h-3.5 w-3.5" />
                Home
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-4 pt-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide"
            style={{
              background: "linear-gradient(135deg, rgba(132,204,22,0.12) 0%, rgba(34,211,238,0.12) 100%)",
              border: "1px solid rgba(132,204,22,0.25)",
              color: "#bef264",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Lifecycle Carbon-Aware Recommendation Engine
          </div>

          {/* Main heading */}
          <h2 className="font-display mx-auto max-w-3xl text-4xl font-bold leading-tight sm:text-5xl"
            style={{ color: "#f8fafc", letterSpacing: "-0.02em" }}>
            Compare{" "}
            <span style={{
              background: "linear-gradient(135deg, #fb923c 0%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>commercial</span>{" "}
            vs{" "}
            <span style={{
              background: "linear-gradient(135deg, #22d3ee 0%, #84cc16 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>lifecycle-aware</span>{" "}
            picks
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg" style={{ color: "#64748b" }}>
            Select your city and delivery area, describe your food intent, and tune the lambda slider to control how strongly carbon footprint shapes recommendations.
          </p>

          {/* Step indicators */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {(["city", "area", "search"] as const).map((step, i) => {
              const stepIdx = ["city", "area", "search"].indexOf(currentStep);
              const isActive = step === currentStep;
              const isDone = i < stepIdx;
              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300"
                    style={{
                      background: isDone
                        ? "rgba(132,204,22,0.2)"
                        : isActive
                        ? "rgba(34,211,238,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: isDone
                        ? "1px solid rgba(132,204,22,0.4)"
                        : isActive
                        ? "1px solid rgba(34,211,238,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                      color: isDone ? "#bef264" : isActive ? "#67e8f9" : "#334155",
                    }}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>
                  <span className="text-xs font-medium hidden sm:block capitalize"
                    style={{ color: isActive ? "#94a3b8" : isDone ? "#475569" : "#334155" }}>
                    {step === "city" ? "City" : step === "area" ? "Area" : "Search"}
                  </span>
                  {i < 2 && (
                    <div className="mx-1 h-px w-6 sm:w-10 transition-all duration-300"
                      style={{ background: isDone ? "rgba(132,204,22,0.3)" : "rgba(255,255,255,0.07)" }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Scroll hint */}
          {currentStep === "search" && hasResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 flex justify-center"
            >
              <div className="flex flex-col items-center gap-1 text-xs" style={{ color: "#334155" }}>
                <ChevronDown className="h-4 w-4 animate-bounce" />
                scroll to results
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ── SELECTORS (fullscreen modals) ── */}
      <CitySelector isOpen={currentStep === "city"} onSelect={handleCitySelect} />
      <AreaSelector
        isOpen={currentStep === "area"}
        city={selectedCity}
        onSelect={handleAreaSelect}
        onBack={() => setCurrentStep("city")}
      />

      {/* ── SEARCH + RESULTS ── */}
      <AnimatePresence>
        {currentStep === "search" && (
          <motion.div
            key="search-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 sm:px-6 lg:px-8"
          >
            {/* Mobile location pill */}
            {locationLabel && (
              <div className="flex sm:hidden items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold mx-auto"
                style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.22)", color: "#67e8f9" }}>
                <MapPin className="h-3 w-3" />
                {locationLabel}
              </div>
            )}

            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              loading={loadingSearch}
              city={selectedCity}
              area={selectedArea}
            />

            {/* Error */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto w-full max-w-4xl rounded-2xl px-5 py-3.5 text-sm"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#fca5a5",
                  }}
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>



            {/* Lambda Slider — FR-8 */}
            <LambdaSlider value={lambda} onChange={handleLambdaChange} loading={isBusy} />

            {/* Pre-search prompt */}
            <AnimatePresence>
              {!hasSearched && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mx-auto w-full max-w-4xl rounded-2xl px-6 py-5 text-center"
                  style={{
                    background: "rgba(34,211,238,0.05)",
                    border: "1px solid rgba(34,211,238,0.15)",
                  }}
                >
                  <p className="text-sm" style={{ color: "#67e8f9" }}>
                    Search once to load both recommendation lists, then fine-tune lifecycle ranking with the lambda slider.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results — FR-5, FR-6 */}
            <AnimatePresence>
              {hasResults || loadingSearch ? (
                <RecommendationsList
                  baselineItems={baselineRecommendations}
                  carbonAwareItems={carbonAwareRecommendations}
                  onViewDetails={handleViewDetails}
                  loading={loadingSearch}
                  reranking={loadingRerank}
                  k={K_RECOMMENDATIONS}
                />
              ) : hasSearched && !loadingSearch ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto w-full max-w-4xl rounded-3xl px-6 py-12 text-center"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <p className="text-lg font-bold" style={{ color: "#f8fafc" }}>No recommendations found</p>
                  <p className="mt-2 text-sm" style={{ color: "#475569" }}>
                    Try a broader query like "pizza", "biryani", or "salad".
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DETAIL MODAL ── */}
      <ItemDetailPlacard
        item={selectedItem}
        isOpen={showDetailPlacard}
        onClose={() => setShowDetailPlacard(false)}
      />

      {/* ── FOOTER ── */}
      <footer
        className="relative z-10 mt-8"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(6,11,29,0.7)" }}
      >
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-4 w-4" style={{ color: "#84cc16" }} />
            <span className="text-sm font-semibold" style={{ color: "#475569" }}>
              Making sustainable food choices, one recommendation at a time
            </span>
          </div>
          <p className="text-xs" style={{ color: "#334155" }}>
            Powered by lifecycle carbon-aware dual-model recommendation engine
          </p>
          {isBusy && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.2)", color: "#bef264" }}>
              <RefreshCw className="h-3 w-3 animate-spin-slow" />
              Updating recommendation engine
            </div>
          )}
        </div>
      </footer>
    </main>
  );
}
