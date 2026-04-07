"use client";

import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  city: string;
  area: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  loading,
  city,
  area,
}: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim()) {
      onSearch();
    }
  };

  const locationReady = Boolean(city && area);

  const placeholder = locationReady
    ? "Try: chicken tikka, paneer pizza, protein bowl, biryani..."
    : "Select city and area first";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mx-auto w-full max-w-4xl"
    >
      <div className="card-shell">
        <div className="mb-4 flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-shell-cream">
            Search for food intent
          </label>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-shell-fog">
            semantic query mapping enabled
          </span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-cyan-200/80" />
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading || !locationReady}
              className="w-full rounded-2xl border border-white/20 bg-shell-card/70 py-3.5 pl-11 pr-4 text-base text-shell-cream outline-none ring-0 placeholder:text-shell-fog/70 transition focus:border-cyan-300/70 focus:bg-shell-card disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <motion.button
            onClick={onSearch}
            disabled={loading || !value.trim() || !locationReady}
            whileHover={!loading && value.trim() && locationReady ? { y: -2 } : {}}
            whileTap={!loading && value.trim() && locationReady ? { scale: 0.98 } : {}}
            className="inline-flex min-w-36 items-center justify-center gap-2 rounded-2xl border border-lime-300/30 bg-lime-300/20 px-6 py-3.5 text-sm font-bold text-lime-100 transition hover:border-lime-200/80 hover:bg-lime-300/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Searching</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Search</span>
              </>
            )}
          </motion.button>
        </div>

        {!locationReady && (
          <p className="mt-3 text-sm text-coral-100/90">
            Please choose city and area before searching.
          </p>
        )}

        {locationReady && (
          <p className="mt-3 text-xs text-shell-fog">
            Requests include query, city, and area so delivery-emission adjustments are location
            aware.
          </p>
        )}
      </div>
    </motion.div>
  );
}
