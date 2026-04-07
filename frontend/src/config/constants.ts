// Frontend Configuration - Modular constants

// Number of recommendations to display (configurable)
export const K_RECOMMENDATIONS = 5;

// Lambda slider values
export const LAMBDA_VALUES = [0, 0.2, 0.5, 0.7, 0.9, 1.0];

// Carbon emission grading thresholds (will be updated after data exploration)
// Format: { grade: [minValue, maxValue] }
export const CARBON_GRADING = {
  A: { label: 'A', color: '#10B981', bgColor: '#ECFDF5' }, // Green - Low emissions
  B: { label: 'B', color: '#3B82F6', bgColor: '#EFF6FF' }, // Blue - Low-Medium
  C: { label: 'C', color: '#F59E0B', bgColor: '#FFFBEB' }, // Amber - Medium
  D: { label: 'D', color: '#EF4444', bgColor: '#FEF2F2' }, // Red - High
  E: { label: 'E', color: '#7C3AED', bgColor: '#FAF5FF' }  // Purple - Very High
} as const;

export type CarbonGrade = keyof typeof CARBON_GRADING;

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    SEARCH: '/search',
    RECOMMENDATIONS: '/recommendations',
    CARBON_AWARE_RERANK: '/rerank'
  }
};
