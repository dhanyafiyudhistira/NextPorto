import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        scada: {
          dark: '#0a0e27',
          darker: '#060918',
          blue: '#00d4ff',
          cyan: '#00ffff',
          green: '#00ff88',
          yellow: '#ffdd00',
          red: '#ff3366',
          orange: '#ff8800',
          purple: '#8800ff',
        },
      },
      boxShadow: {
        'neon': '0 0 5px currentColor, 0 0 20px currentColor',
        'neon-sm': '0 0 2px currentColor, 0 0 10px currentColor',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
