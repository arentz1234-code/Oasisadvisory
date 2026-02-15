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
        // Updated to match logo colors
        navy: {
          DEFAULT: '#0f172a',
          50: '#1e293b',
          100: '#1a2540',
          200: '#162035',
          300: '#121b2e',
          400: '#0f172a',
          500: '#0c1322',
          600: '#090f1a',
          700: '#060b12',
          800: '#03070a',
          900: '#000102',
        },
        // Primary blue from logo "ASIS" text
        primary: {
          DEFAULT: '#1e3a5f',
          light: '#2a4a73',
          dark: '#152d4a',
        },
        // Accent blue from logo "ADVISORY" text and ring
        accent: {
          DEFAULT: '#4171b5',
          light: '#5a8fd4',
          dark: '#2d5a9e',
          50: '#e8f1fb',
          100: '#d1e3f7',
          200: '#a3c7ef',
          300: '#75abe7',
          400: '#5a8fd4',
          500: '#4171b5',
          600: '#2d5a9e',
          700: '#1e3a5f',
          800: '#152d4a',
          900: '#0c1f35',
        },
        soft: {
          DEFAULT: '#e2e8f0',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'blue-gradient': 'linear-gradient(135deg, #1e3a5f 0%, #4171b5 50%, #5a8fd4 100%)',
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
