"use client";

import { Search, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading: boolean;
  city: string;
  area: string;
}

const EXAMPLE_QUERIES = [
  "chicken tikka masala",
  "cheese pizza",
  "quinoa salad",
  "butter chicken",
  "paneer wrap",
  "tofu stir fry",
];

export default function SearchBar({ value, onChange, onSearch, loading, city, area }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const locationReady = Boolean(city && area);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim() && locationReady) onSearch();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 280, damping: 26 }}
      className="mx-auto w-full max-w-4xl"
    >
      <div
        className="rounded-3xl p-6 transition-all duration-300"
        style={{
          background: "linear-gradient(145deg, rgba(17,26,56,0.85) 0%, rgba(11,18,45,0.9) 100%)",
          border: focused
            ? "1px solid rgba(34,211,238,0.4)"
            : "1px solid rgba(255,255,255,0.09)",
          boxShadow: focused
            ? "0 0 0 4px rgba(34,211,238,0.08), 0 20px 50px rgba(0,0,0,0.4)"
            : "0 20px 50px rgba(0,0,0,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top row: label + location pill */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold" style={{ color: "#f8fafc" }}>
              What are you craving?
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              Describe your food intent — we'll find the best sustainable options
            </p>
          </div>

          {/* Location context pill — FR-4 */}
          {locationReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
              style={{
                background: "rgba(34,211,238,0.1)",
                border: "1px solid rgba(34,211,238,0.3)",
                color: "#67e8f9",
              }}
            >
              <MapPin className="h-3 w-3" />
              {city} · {area}
            </motion.div>
          )}
        </div>

        {/* Input row */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="h-5 w-5" style={{ color: focused ? "#67e8f9" : "#475569" }} />
            </div>
            <input
              id="food-search-input"
              type="text"
              autoComplete="off"
              placeholder={
                locationReady
                  ? "e.g. chicken tikka, paneer pizza, protein bowl…"
                  : "Select city and area first"
              }
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={loading || !locationReady}
              className="w-full rounded-2xl py-3.5 pl-11 pr-4 text-base font-medium transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f8fafc",
                caretColor: "#67e8f9",
              }}
            />
          </div>

          <motion.button
            id="search-submit-btn"
            onClick={onSearch}
            disabled={loading || !value.trim() || !locationReady}
            whileHover={!loading && value.trim() && locationReady ? { scale: 1.03, y: -1 } : {}}
            whileTap={!loading && value.trim() && locationReady ? { scale: 0.97 } : {}}
            className="inline-flex min-w-[9rem] items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all duration-200"
            style={{
              background: loading || !value.trim() || !locationReady
                ? "rgba(255,255,255,0.07)"
                : "linear-gradient(135deg, rgba(132,204,22,0.9) 0%, rgba(16,185,129,0.9) 100%)",
              border: loading || !value.trim() || !locationReady
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(132,204,22,0.5)",
              color: loading || !value.trim() || !locationReady ? "#475569" : "#0f172a",
              boxShadow: !loading && value.trim() && locationReady
                ? "0 4px 20px rgba(132,204,22,0.3)"
                : "none",
              cursor: loading || !value.trim() || !locationReady ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin-slow" />
                <span>Searching…</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Example queries */}
        {locationReady && !value && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            <span className="text-xs" style={{ color: "#475569", paddingTop: "2px" }}>Try:</span>
            {EXAMPLE_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => onChange(q)}
                className="text-xs rounded-full px-2.5 py-1 transition-colors duration-150"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#94a3b8",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(34,211,238,0.08)";
                  (e.target as HTMLElement).style.color = "#67e8f9";
                  (e.target as HTMLElement).style.borderColor = "rgba(34,211,238,0.25)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.target as HTMLElement).style.color = "#94a3b8";
                  (e.target as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                }}
              >
                {q}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
