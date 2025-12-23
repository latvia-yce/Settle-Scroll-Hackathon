// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1ff968", // New bright green for success page
        "primary-hover": "#1adb5b",
        "background-light": "#f5f8f6",
        "background-dark": "#050505",
        "surface-dark": "#121212",
        "border-dark": "#1f2923",
        // Keep existing colors from other pages
        "text-secondary": "#9db9a6",
        "danger": "#ef4444",
        "danger-surface": "rgba(239, 68, 68, 0.1)",
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px",
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .5 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      },
      boxShadow: {
        'neon': '0 0 10px rgba(31, 249, 104, 0.2)',
      }
    },
  },
  plugins: [],
}