import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "liquid-dark-blue": "#60a5fa",
        "liquid-white": "#F7F7F7",
        "liquid-dark-white": "#F2F2F2",
        "liquid-blue": "#7bc6e3",
        "liquid-black": "#111314",
        "liquid-popup-bg": "#2d3748",
        "liquid-gray": "#495158",
        "liquid-card-gray-bg":"#181c1e"
      },
      fontFamily: {
        "liquid-bold": ["NeueMachina Bold", "sans-serif"],
        "liquid-regular": ["NeueMachina Regular", "sans-serif"],
        "liquid-light": ["NeueMachina Light", "sans-serif"],
        "liquid-semibold": ["NeueMachina Seminbold", "sans-serif"],
      },
      fontSize: {
        "liquid-banner-header": "6rem",
        "liquid-banner-header-mobile": "3.5rem",
        "liquid-logo":"2rem",
        "liquid-title": "1.5rem",
        "liquid-title-mobile": "1rem",
        "liquid-subtitle": "1rem",
        "liquid-subtitle-mobile": "0.75rem",
        "liquid-text": "0.75rem",
        "liquid-text-mobile": "0.5rem",
      },
      screens: {
        "liquid-sm": "321px",
        "liquid-md": "688px",
        "liquid-lg": "980px",
        "liquid-xl": "1248px",
      },
      boxShadow:{
        cardHover: "0 0 5px 2px rgba(96, 165, 250, 0.6);",
      },
      scale: {
        '98': '0.98',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 255, 255, 1)' },
        },
      },
      animation: {
        glow: 'glow 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
export default config;
