import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Updated to match logo blues
        navy: {
          DEFAULT: '#0A0F1C',
          50: '#1a2035',
          100: '#151a2e',
          200: '#101524',
          300: '#0d1220',
          400: '#0A0F1C',
          500: '#080c17',
          600: '#060912',
          700: '#04060d',
          800: '#020308',
          900: '#000003',
        },
        // Blue accent colors from logo
        accent: {
          DEFAULT: '#2563EB', // Primary blue
          light: '#3B82F6',   // Lighter blue
          dark: '#1D4ED8',    // Darker blue
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        soft: {
          DEFAULT: '#E8ECF1',
          muted: '#9CA3AF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0A0F1C 0%, #1a2035 50%, #0A0F1C 100%)',
        'blue-gradient': 'linear-gradient(135deg, #1D4ED8 0%, #3B82F6 50%, #60A5FA 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
