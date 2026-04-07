// Frontend Configuration - Modular constants

// Number of recommendations to display (configurable)
export const K_RECOMMENDATIONS = 5;

// Lambda slider values
export const LAMBDA_VALUES = [0, 0.2, 0.5, 0.7, 0.9, 1.0];

export const CARBON_GRADING = {
  A: { label: "A", color: "#84cc16", bgColor: "#1a2e05", text: "Ultra low footprint" },
  B: { label: "B", color: "#10b981", bgColor: "#04261f", text: "Low footprint" },
  C: { label: "C", color: "#06b6d4", bgColor: "#03212a", text: "Moderate footprint" },
  D: { label: "D", color: "#f59e0b", bgColor: "#321f03", text: "High footprint" },
  E: { label: "E", color: "#f97316", bgColor: "#361608", text: "Very high footprint" },
} as const;

export type CarbonGrade = keyof typeof CARBON_GRADING;

export const getCarbonGrade = (totalCarbonKg: number): CarbonGrade => {
  if (totalCarbonKg <= 1.2) return "A";
  if (totalCarbonKg <= 2.5) return "B";
  if (totalCarbonKg <= 4.0) return "C";
  if (totalCarbonKg <= 7.0) return "D";
  return "E";
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  ENDPOINTS: {
    RECOMMENDATIONS: "/recommend",
    LOCATIONS: "/locations",
  },
};
