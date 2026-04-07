import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        shell: {
          ink: "#060b1d",
          card: "#111a38",
          cream: "#f8fafc",
          fog: "#c5d1e8",
        },
        obsidian: {
          50: '#f8fafc',
          100: '#f1f5f9',
          150: '#e6eef7',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          850: '#1a202c',
          900: '#0f172a',
          950: '#020617',
        },
        emerald: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#145231',
          950: '#052e16',
        },
        sapphire: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#051e3e',
        },
        zinc: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1a6',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 41, 55, 0.1), inset 0 1px 2px 0 rgba(255, 255, 255, 0.15)',
        'premium': '0 20px 50px -12px rgba(0, 0, 0, 0.5)',
        'premium-lg': '0 32px 64px -16px rgba(0, 0, 0, 0.6)',
        'emerald-glow': '0 0 30px rgba(16, 185, 129, 0.4), 0 0 60px rgba(16, 185, 129, 0.2)',
        'inner-glow': 'inset 0 0 20px rgba(16, 185, 129, 0.1)',
        'card-hover': '0 25px 50px -12px rgba(16, 185, 129, 0.1)',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        'perlin-gradient': 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="perlin"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23perlin)" /%3E%3C/svg%3E")',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'cloud-rotate': 'cloud-rotate 20s linear infinite',
        'cloud-hover': 'cloud-hover 0.5s ease-out forwards',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
          '100%': { backgroundPosition: '0% center' },
        },
        'cloud-rotate': {
          'from': { transform: 'rotate(0deg) translateX(150px) rotate(0deg)' },
          'to': { transform: 'rotate(360deg) translateX(150px) rotate(-360deg)' },
        },
        'cloud-hover': {
          'from': { transform: 'scale(1)', filter: 'brightness(1)' },
          'to': { transform: 'scale(1.15)', filter: 'brightness(1.2)' },
        },
      },
      backdropBlur: {
        'xl': '20px',
        '2xl': '40px',
      },
      transitionTiming: {
        'in-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      borderRadius: {
        'full-lg': '3rem',
        'full-xl': '4rem',
      },
    },
  },
  plugins: [],
};
export default config;
