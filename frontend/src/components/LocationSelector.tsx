"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Globe, Leaf, MapPin, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface Locations {
  [city: string]: string[];
}

export default function LocationSelector({ onSelect }: { onSelect: (city: string, area: string) => void }) {
  const [locations, setLocations] = useState<Locations>({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1); // 1: City, 2: Area

  useEffect(() => {
    fetch("http://localhost:8000/locations")
      .then((res) => res.json())
      .then(setLocations)
      .catch(() => {
        setLocations({
          "Delhi": ["Connaught Place", "Hauz Khas", "Dwarka", "Saket", "Cyber Hub"],
          "Mumbai": ["Colaba", "Bandra", "Andheri", "Juhu", "Powai"],
          "Bangalore": ["Indiranagar", "Koramangala", "MG Road", "Whitefield", "HSR Layout"],
        });
      });
  }, []);

  const handleConfirm = () => {
    if (selectedCity && selectedArea) {
      onSelect(selectedCity, selectedArea);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-2xl"
        onClick={() => {}}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
        className="w-full max-w-3xl glass-panel overflow-hidden relative z-10 shadow-premium-lg"
      >
        {/* Ambient Background Effects */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-sapphire-500/5 blur-3xl rounded-full" />

        <div className="p-16 relative z-10">
          {/* Header */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-between items-start mb-16"
          >
            <div className="space-y-4 flex-1">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-emerald-500 font-mono-label"
              >
                <Globe className="w-4 h-4" />
                LOCATION SETUP
              </motion.div>
              <h2 className="font-display-large text-gradient">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {step === 1 ? 'Where are you located?' : `Neighborhoods in ${selectedCity}`}
                </motion.span>
              </h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-obsidian-400 font-medium text-lg leading-relaxed"
              >
                {step === 1 
                  ? 'Select your city to discover carbon-aware dining options optimized for sustainability.'
                  : 'Choose your delivery area to personalize recommendations based on local logistics.'
                }
              </motion.p>
            </div>
            
            {/* Back Button for Step 2 */}
            {step === 2 && (
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep(1)}
                className="p-4 glass-subtle hover:glass-panel rounded-full text-obsidian-400 hover:text-white transition-all ml-4 flex-shrink-0"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
            )}
          </motion.header>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="city-step"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              >
                {Object.keys(locations).map((city, idx) => (
                  <motion.button 
                    key={city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedCity(city); setStep(2); }}
                    className={`p-8 rounded-full-lg border-2 transition-all flex flex-col items-center gap-4 group ${
                      selectedCity === city 
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' 
                        : 'glass-subtle hover:bg-white/[0.08] hover:border-white/20'
                    }`}
                  >
                    <motion.div 
                      animate={{ scale: selectedCity === city ? [1, 1.1, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                        selectedCity === city 
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-emerald-glow' 
                          : 'bg-obsidian-800/60 text-obsidian-500 group-hover:bg-obsidian-700'
                      }`}
                    >
                      <MapPin className="w-8 h-8" />
                    </motion.div>
                    <span className="font-display font-semibold text-xl">{city}</span>
                    <span className="text-xs text-obsidian-500 font-mono-label">
                      {locations[city]?.length || 0} areas
                    </span>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="area-step"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16"
              >
                {locations[selectedCity]?.map((area, idx) => (
                  <motion.button 
                    key={area}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedArea(area)}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${
                      selectedArea === area 
                        ? 'bg-emerald-600/90 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'glass-subtle hover:border-white/20'
                    }`}
                  >
                    <span className="font-medium text-sm flex-1">{area}</span>
                    <motion.div
                      animate={{ scale: selectedArea === area ? 1.2 : 1 }}
                      className="ml-2 flex-shrink-0"
                    >
                      {selectedArea === area ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-obsidian-500 group-hover:text-obsidian-300 transition-colors" />
                      )}
                    </motion.div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 text-xs text-obsidian-500 font-mono-label">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <Leaf className="w-4 h-4 text-emerald-500" />
                Eco-Optimized
              </motion.div>
              <div className="w-1 h-1 bg-obsidian-700 rounded-full" />
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-sapphire-500" />
                Real-time Data
              </motion.div>
            </div>
            
            <motion.button 
              whileHover={{ scale: selectedArea ? 1.05 : 1, boxShadow: selectedArea ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none' }}
              whileTap={{ scale: selectedArea ? 0.95 : 1 }}
              disabled={!selectedArea}
              onClick={handleConfirm}
              className="w-full sm:w-auto px-12 py-4 rounded-full-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-obsidian-800 disabled:text-obsidian-600 text-white font-display font-bold text-lg shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:cursor-not-allowed"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.footer>
        </div>
      </motion.div>
    </div>
  );
}
