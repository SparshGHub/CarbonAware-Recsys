"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Leaf, MapPin, Sparkles, RefreshCw } from "lucide-react";
import CitySelector from "@/components/CitySelector";
import AreaSelector from "@/components/AreaSelector";
import SearchBar from "@/components/SearchBar";
import LambdaSlider from "@/components/LambdaSlider";
import RecommendationsList from "@/components/RecommendationsList";
import ItemDetailPlacard from "@/components/ItemDetailPlacard";
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

interface ApiRecommendationItem {
  id: string | number;
  name: string;
  restaurant_name?: string;
  carbon_score?: number;
  delivery_carbon?: number;
  total_carbon?: number;
  price?: number;
  distance?: number;
  relevance_score?: number;
  total_score?: number;
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
  const [baselineRecommendations, setBaselineRecommendations] = useState<FoodItem[]>([]);
  const [carbonAwareRecommendations, setCarbonAwareRecommendations] = useState<FoodItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [showDetailPlacard, setShowDetailPlacard] = useState(false);
  const requestIdRef = useRef(0);

  const hasResults =
    baselineRecommendations.length > 0 || carbonAwareRecommendations.length > 0;

  const isBusy = loadingSearch || loadingRerank;

  const locationLabel = useMemo(() => {
    if (!selectedCity || !selectedArea) {
      return "Select city and area";
    }
    return `${selectedCity} • ${selectedArea}`;
  }, [selectedCity, selectedArea]);

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
    setErrorMessage("");
    setHasSearched(false);
    setBaselineRecommendations([]);
    setCarbonAwareRecommendations([]);
  }, []);

  const fetchRecommendations = useCallback(
    async (mode: "commercial" | "lifecycle_aware", lambdaValue: number) => {
      const params = new URLSearchParams({
        query: searchQuery.trim(),
        city: selectedCity,
        area: selectedArea,
        mode,
        limit: String(K_RECOMMENDATIONS),
      });

      // Backend may choose to honor lambda only for lifecycle mode.
      if (mode === "lifecycle_aware") {
        params.set("lambda", String(lambdaValue));
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RECOMMENDATIONS}?${params.toString()}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${mode} recommendations`);
      }

      const data = (await response.json()) as ApiRecommendationItem[];
      return data.map(normalizeRecommendation).slice(0, K_RECOMMENDATIONS);
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

      // Ignore stale response if a newer request was fired.
      if (requestId !== requestIdRef.current) return;

      setBaselineRecommendations(baselineItems);
      setCarbonAwareRecommendations(carbonItems);
    } catch (error) {
      console.error("Search error:", error);
      setBaselineRecommendations([]);
      setCarbonAwareRecommendations([]);
      setErrorMessage(
        "Could not fetch recommendations right now. Please check API availability and try again."
      );
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingSearch(false);
      }
    }
  }, [selectedCity, selectedArea, searchQuery, lambda, fetchRecommendations]);

  const handleLambdaChange = useCallback(
    async (newLambda: number) => {
      setLambda(newLambda);

      // Lambda changes should only rerank lifecycle-aware results.
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
        setErrorMessage(
          "Could not update lifecycle-aware ranking for the selected lambda value."
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoadingRerank(false);
        }
      }
    },
    [hasSearched, selectedCity, selectedArea, searchQuery, fetchRecommendations]
  );

  const handleViewDetails = (item: FoodItem) => {
    setSelectedItem(item);
    setShowDetailPlacard(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-shell-ink text-shell-cream">
      <div className="aurora-bg" aria-hidden="true" />
      <div className="orb orb-lime" aria-hidden="true" />
      <div className="orb orb-cyan" aria-hidden="true" />
      <div className="orb orb-coral" aria-hidden="true" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-white/10 bg-shell-ink/80 backdrop-blur-xl"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-lime-300/30 bg-lime-300/15 p-2.5 shadow-[0_0_40px_rgba(190,242,100,0.2)]">
                <Leaf className="h-6 w-6 text-lime-200" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-shell-cream">
                  EcoRecSys
                </h1>
                <p className="text-xs text-shell-fog">
                  Carbon-aware recommendations for real delivery locations
                </p>
              </div>
            </div>

            {currentStep === "search" && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleChangeLocation}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-shell-cream transition hover:border-cyan-300/60 hover:bg-cyan-300/10"
              >
                <MapPin className="h-4 w-4" />
                Change Location
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-shell text-center"
        >
          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-coral-300/40 bg-coral-400/15 px-4 py-1.5 text-xs font-semibold tracking-wide text-coral-100">
            <Sparkles className="h-4 w-4" />
            Choose cleaner meals without losing taste
          </div>
          <h2 className="font-display text-3xl leading-tight text-shell-cream sm:text-4xl">
            Compare commercial picks vs lifecycle-aware picks
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-shell-fog sm:text-base">
            Select your city and area, search your food intent, and tune lambda to control
            how strongly carbon emissions affect ranking.
          </p>
          <div className="mx-auto mt-6 flex w-fit flex-wrap items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-shell-cream">
            <MapPin className="h-4 w-4 text-cyan-200" />
            <span className="font-semibold">{locationLabel}</span>
          </div>
        </motion.section>

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
            className="space-y-6"
          >
            {/* Search Bar */}
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              loading={loadingSearch}
              city={selectedCity}
              area={selectedArea}
            />

            {errorMessage && (
              <div className="mx-auto w-full max-w-4xl rounded-2xl border border-coral-300/50 bg-coral-400/15 px-4 py-3 text-sm text-coral-50">
                {errorMessage}
              </div>
            )}

            {/* Lambda Slider */}
            <LambdaSlider
              value={lambda}
              onChange={handleLambdaChange}
              loading={isBusy}
            />

            {/* Results with Lambda Slider */}
            {hasResults ? (
              <RecommendationsList
                baselineItems={baselineRecommendations}
                carbonAwareItems={carbonAwareRecommendations}
                onViewDetails={handleViewDetails}
                loading={loadingSearch}
                reranking={loadingRerank}
                k={K_RECOMMENDATIONS}
              />
            ) : null}

            {!hasResults && hasSearched && !loadingSearch && (
              <div className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center">
                <p className="text-lg font-semibold text-shell-cream">No recommendations yet</p>
                <p className="mt-2 text-sm text-shell-fog">
                  Try a broader food query like "pizza", "biryani" or "salad".
                </p>
              </div>
            )}

            {!hasSearched && (
              <div className="mx-auto w-full max-w-4xl rounded-3xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 text-center text-sm text-cyan-100">
                Search once to load both recommendation lists, then fine-tune lifecycle ranking
                with lambda.
              </div>
            )}
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
        className="relative z-10 mt-16 border-t border-white/10 bg-shell-ink/60"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <div className="text-sm text-shell-fog">
            <p>
              Making sustainable food choices, one recommendation at a time.
            </p>
            <p className="mt-2 text-xs text-shell-fog/80">
              Powered by lifecycle carbon-aware recommendation models
            </p>
            {isBusy && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-lime-200/30 bg-lime-300/10 px-3 py-1 text-xs font-semibold text-lime-100">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Updating recommendation engine
              </p>
            )}
          </div>
        </div>
      </motion.footer>
    </main>
  );
}
