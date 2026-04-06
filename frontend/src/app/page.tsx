"use client";
import LocationSelector from "@/components/LocationSelector";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    ArrowRight,
    BarChart3,
    ChevronRight,
    Leaf,
    MapPin as MapPinIcon,
    RefreshCw,
    Search,
    Sparkles,
    TrendingUp,
    X
} from "lucide-react";
import { useCallback, useState } from "react";

interface Recommendation {
  id: number;
  name: string;
  restaurant_name: string;
  carbon_score: number;
  delivery_carbon: number;
  total_carbon: number;
  price: number;
  distance: number;
  relevance_score: number;
  total_score: number;
}

interface ComparisonData {
  commercial: Recommendation | null;
  ingredient_aware: Recommendation | null;
  lifecycle_aware: Recommendation | null;
}

const getCarbonGrade = (val: number): 'A' | 'B' | 'C' | 'D' | 'E' => {
  if (val < 1.0) return 'A';
  if (val < 2.5) return 'B';
  if (val < 4.5) return 'C';
  if (val < 7.0) return 'D';
  return 'E';
};

const gradeColors = {
  A: { bg: 'grade-A', text: 'text-emerald-400' },
  B: { bg: 'grade-B', text: 'text-lime-400' },
  C: { bg: 'grade-C', text: 'text-amber-400' },
  D: { bg: 'grade-D', text: 'text-orange-400' },
  E: { bg: 'grade-E', text: 'text-red-400' },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.165, 0.84, 0.44, 1],
    },
  },
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState({ city: "", area: "" });
  const [results, setResults] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [metricMode, setMetricMode] = useState<"grade" | "value">("grade");
  const [hoveredCloud, setHoveredCloud] = useState<string | null>(null);

  const handleSearch = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!location.city || !query.trim()) return;
    
    setLoading(true);
    setShowCompare(false);
    try {
      const res = await fetch(
        `http://localhost:8000/recommend?query=${encodeURIComponent(query)}&city=${encodeURIComponent(location.city)}&area=${encodeURIComponent(location.area)}&mode=lifecycle_aware`,
        { method: 'GET' }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, location]);

  const handleCompare = async () => {
    if (!query.trim() || !location.city) return;
    setComparisonLoading(true);
    setShowCompare(true);
    setComparisonData(null);
    try {
      const res = await fetch(
        `http://localhost:8000/recommend/compare?query=${encodeURIComponent(query)}&city=${encodeURIComponent(location.city)}&area=${encodeURIComponent(location.area)}`,
        { method: 'GET' }
      );
      if (res.ok) {
        const data = await res.json();
        setComparisonData(data);
      }
    } catch (err) {
      console.error('Compare error:', err);
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleCloseCompare = () => {
    setShowCompare(false);
    setComparisonData(null);
    setHoveredCloud(null);
  };

  return (
    <main className="min-h-screen mesh-bg relative overflow-x-hidden">
      <LocationSelector onSelect={(city, area) => setLocation({ city, area })} />
      
      {/* Premium Header Navigation */}
      <header className="fixed top-0 inset-x-0 z-40 p-6 md:p-8 pointer-events-none">
        <div className="max-w-7xl mx-auto pointer-events-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-panel px-8 py-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8"
          >
            {/* Brand Identity */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-emerald-glow"
              >
                <Leaf className="text-white w-6 h-6" />
              </motion.div>
              <div className="space-y-1">
                <h1 className="text-2xl font-display font-semibold text-gradient leading-none">Terra<span className="text-emerald-400">Bite</span></h1>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="font-mono-label text-emerald-500/70">RESEARCH GRADE AI</span>
                </div>
              </div>
            </div>

            {/* Search Bar with Enhanced Styling */}
            <form onSubmit={handleSearch} className="relative w-full lg:max-w-2xl group flex-1">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-obsidian-500 group-focus-within:text-emerald-400 transition-colors w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Query sustainable choices..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input w-full"
                disabled={!location.city}
              />
              {query && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              )}
            </form>

            {/* Control Panel */}
            <div className="flex items-center gap-3">
              {/* Metric Toggle */}
              <motion.div 
                className="flex p-1.5 glass-subtle rounded-full border border-white/10"
                whileHover={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}
              >
                {(['grade', 'value'] as const).map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setMetricMode(mode)}
                    className={`px-4 py-2 rounded-full font-mono-label transition-all ${
                      metricMode === mode
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'text-obsidian-500 hover:text-obsidian-200'
                    }`}
                  >
                    {mode === 'grade' ? 'Grade' : 'CO₂e'}
                  </button>
                ))}
              </motion.div>

              {/* Compare Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCompare}
                disabled={!query.trim() || !location.city || results.length === 0}
                className="p-3.5 glass-subtle hover:glass-panel rounded-full text-emerald-400 hover:text-emerald-300 hover:shadow-emerald-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BarChart3 className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-8 pt-40 pb-32">
        {/* Comparison Section - Cinematic Rotating Clouds */}
        <AnimatePresence mode="wait">
          {showCompare && (
            <motion.section 
              key="comparison"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-32 relative"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="space-y-2">
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-mono-label text-emerald-500"
                  >
                    COMPARATIVE ANALYSIS
                  </motion.p>
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="font-display-medium text-gradient"
                  >
                    Three Models, One Query
                  </motion.h2>
                </div>
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseCompare}
                  className="p-3 glass-subtle hover:glass-panel rounded-full text-obsidian-400 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Rotating Clouds Container */}
              <div className="relative h-96 flex items-center justify-center perspective">
                {comparisonLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="flex items-center gap-3 text-emerald-400"
                  >
                    <RefreshCw className="w-6 h-6" />
                    <span className="font-display text-lg">Aggregating lifecycle data...</span>
                  </motion.div>
                ) : comparisonData ? (
                  <>
                    <ComparisonCloud 
                      position={0}
                      model={{
                        name: 'Commercial',
                        subtitle: 'Standard Market Baseline',
                        data: comparisonData.commercial,
                        description: 'Ignores carbon entirely',
                      }}
                      metricMode={metricMode}
                      isHovered={hoveredCloud === 'commercial'}
                      onHover={(val) => setHoveredCloud(val)}
                    />
                    <ComparisonCloud 
                      position={1}
                      model={{
                        name: 'Ingredient-Aware',
                        subtitle: 'Partial Sustainability',
                        data: comparisonData.ingredient_aware,
                        description: 'Raw ingredients only',
                      }}
                      metricMode={metricMode}
                      isHovered={hoveredCloud === 'ingredient'}
                      onHover={(val) => setHoveredCloud(val)}
                    />
                    <ComparisonCloud 
                      position={2}
                      model={{
                        name: 'Lifecycle',
                        subtitle: 'Full Spectrum Awareness',
                        data: comparisonData.lifecycle_aware,
                        description: 'Production + Logistics',
                        highlight: true,
                      }}
                      metricMode={metricMode}
                      isHovered={hoveredCloud === 'lifecycle'}
                      onHover={(val) => setHoveredCloud(val)}
                    />
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-obsidian-500"
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No comparison data available</p>
                  </motion.div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Dashboard Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-12"
        >
          {/* Dashboard Header with Stats */}
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/5 pb-8">
              <div className="space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 text-obsidian-500 text-xs font-mono-label"
                >
                  <MapPinIcon className="w-4 h-4 text-emerald-500" />
                  <span>DELIVERY NODE</span>
                  {location.city && (
                    <>
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-obsidian-300">{location.area} @ {location.city}</span>
                    </>
                  )}
                </motion.div>
                <h2 className="font-display-large text-gradient">
                  {results.length > 0 ? `${results.length} Recommendations` : 'Ready to Search'}
                </h2>
              </div>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="badge-emerald"
              >
                <Sparkles className="w-4 h-4" />
                Lifecycle-Aware Model
              </motion.div>
            </div>

            {/* Results Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate={results.length > 0 ? "visible" : "hidden"}
              className="bento-grid"
            >
              {loading ? (
                Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : results.length > 0 ? (
                results.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <ResultCard 
                      item={item} 
                      index={index} 
                      metricMode={metricMode}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  variants={itemVariants}
                  className="col-span-full"
                >
                  <EmptyState query={query} location={location} />
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

// Comparison Cloud Component - Rotating Animation
function ComparisonCloud({ 
  position, 
  model, 
  metricMode,
  isHovered,
  onHover,
}: { 
  position: number
  model: {
    name: string
    subtitle: string
    data: Recommendation | null
    description: string
    highlight?: boolean
  }
  metricMode: 'grade' | 'value'
  isHovered: boolean
  onHover: (val: string | null) => void
}) {
  const angle = (position * 120) * (Math.PI / 180);
  const radius = 150;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  
  const grade = model.data ? getCarbonGrade(model.data.total_carbon) : 'N/A';
  const gradeConfig = gradeColors[grade as 'A' | 'B' | 'C' | 'D' | 'E'] || gradeColors.E;

  const modelKey = model.name.toLowerCase().replace('-', '');

  return (
    <motion.div
      animate={{
        x: isHovered ? x * 0.8 : x,
        y: isHovered ? y * 0.8 : y,
        z: isHovered ? 100 : 0,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute"
      style={{
        animation: isHovered ? 'none' : `cloud-rotate 28s linear infinite`,
        animationDelay: `${position * -9.33}s`,
      }}
      onMouseEnter={() => onHover(modelKey)}
      onMouseLeave={() => onHover(null)}
    >
      <motion.div 
        animate={{
          scale: isHovered ? 1.2 : 1,
          filter: isHovered ? 'brightness(1.3)' : 'brightness(1)',
        }}
        className="comparison-card group"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <p className={`font-mono-label ${model.highlight ? 'text-emerald-500' : 'text-obsidian-500'}`}>
              {model.name.toUpperCase()}
            </p>
            <p className="text-sm text-obsidian-400 font-medium">{model.subtitle}</p>
          </div>

          {/* Item Name */}
          <div className="min-h-[3rem] flex items-start">
            <p className="font-display font-semibold text-lg text-white line-clamp-2">
              {model.data?.name || '—'}
            </p>
          </div>

          {/* Carbon Grade Badge - Large */}
          <div className="flex items-center justify-between">
            <div className={`w-20 h-20 rounded-full grade-badge ${gradeConfig.bg} flex items-center justify-center text-4xl font-display font-black transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}>
              {metricMode === 'grade' ? grade : model.data?.total_carbon.toFixed(1) || '—'}
            </div>
            {metricMode === 'value' && (
              <div className="text-right space-y-1">
                <p className="text-xs text-obsidian-500 font-mono-label">CO₂e (kg)</p>
                <p className={`text-lg font-display font-bold ${gradeConfig.text}`}>{grade}</p>
              </div>
            )}
          </div>

          {/* Restaurant & Price */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-xs text-obsidian-500 font-mono-label">Restaurant</p>
              <p className="text-sm font-medium text-white line-clamp-1">
                {model.data?.restaurant_name || '—'}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs text-obsidian-500 font-mono-label">Price</p>
                <p className="text-lg font-display font-bold text-emerald-400">
                  ${model.data?.price.toFixed(2) || '—'}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-obsidian-500 font-mono-label">Distance</p>
                <p className="text-sm text-white font-medium">
                  {model.data?.distance.toFixed(1) || '—'}km
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-obsidian-500 italic leading-relaxed">
            {model.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Result Card Component
function ResultCard({ 
  item, 
  index, 
  metricMode 
}: { 
  item: Recommendation
  index: number
  metricMode: 'grade' | 'value' 
}) {
  const grade = getCarbonGrade(item.total_carbon);
  const gradeConfig = gradeColors[grade];

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="glass-card group p-8 flex flex-col h-full relative overflow-hidden"
    >
      {/* Background Blur Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all duration-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start gap-4 mb-8">
          <div className="space-y-2 flex-1">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="font-mono-label text-obsidian-500"
            >
              PICK #{index + 1}
            </motion.p>
            <h3 className="font-display text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-500 line-clamp-2 leading-tight">
              {item.name}
            </h3>
          </div>
          
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className={`w-16 h-16 rounded-2xl grade-badge ${gradeConfig.bg} flex items-center justify-center text-3xl font-display font-black flex-shrink-0`}
          >
            {metricMode === 'grade' ? grade : item.total_carbon.toFixed(1)}
          </motion.div>
        </div>

        {/* Restaurant & Pricing Section */}
        <div className="mt-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="font-mono-label text-obsidian-500">Restaurant</p>
              <p className="text-sm font-medium text-white line-clamp-2">
                {item.restaurant_name}
              </p>
            </div>
            <div className="text-right space-y-1.5">
              <p className="font-mono-label text-obsidian-500">Price</p>
              <p className="text-2xl font-display font-black text-emerald-400">
                ${item.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Metrics Footer */}
          <div className="relative pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-obsidian-500 font-mono-label">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              {item.distance.toFixed(1)} km transit
            </div>
            <motion.div 
              whileHover={{ scale: 1.1, x: 4 }}
              className="p-3 bg-white/5 group-hover:bg-emerald-500 group-hover:text-white rounded-xl transition-all duration-500"
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Specular Light Effect */}
      <div className="specular-light" />
    </motion.div>
  );
}

// Skeleton Card for Loading State
function SkeletonCard() {
  return (
    <div className="glass-card p-8 space-y-8 animate-pulse border-white/5 opacity-50">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-3 flex-1">
          <div className="h-2 w-16 bg-obsidian-700 rounded-full" />
          <div className="h-6 w-full bg-obsidian-700 rounded-lg" />
        </div>
        <div className="w-16 h-16 bg-obsidian-700 rounded-2xl flex-shrink-0" />
      </div>
      <div className="space-y-4 mt-auto">
        <div className="h-4 w-3/4 bg-obsidian-700 rounded-lg" />
        <div className="h-4 w-1/2 bg-obsidian-700 rounded-lg" />
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ 
  query, 
  location 
}: { 
  query: string
  location: { city: string; area: string }
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full"
    >
      <div className="glass-panel rounded-full-lg p-16 md:p-24 flex flex-col items-center justify-center text-center space-y-8">
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-sapphire-500/10 rounded-3xl flex items-center justify-center"
        >
          <Search className="w-16 h-16 text-obsidian-700" />
        </motion.div>
        
        <div className="space-y-3 max-w-md">
          <h3 className="font-display-medium text-white">
            {!location.city 
              ? 'Select Your Location' 
              : !query 
              ? 'Start Your Sustainability Journey' 
              : 'No Results Found'}
          </h3>
          <p className="text-obsidian-400 font-medium leading-relaxed">
            {!location.city 
              ? 'Choose a delivery location to discover food recommendations optimized for sustainability.' 
              : !query 
              ? 'Enter a query to find carbon-aware dining options tailored to your preferences.' 
              : `Try adjusting your search terms for "${query}" or explore other options.`}
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="btn-emerald"
        >
          <Sparkles className="w-4 h-4" />
          Explore Now
        </motion.button>
      </div>
    </motion.div>
  );
}
