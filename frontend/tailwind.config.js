/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#94A3B8", // Slate/Silver
        secondary: "#030712", // Midnight Blue
        accent: "#1E293B", // Deep Slate
        background: "#0B0F1A", // Dark Charcoal
        text: "#F8FAFC", // Off-white
        border: "#1E293B",
      },
      fontFamily: {
        serif: ["'Playfair Display'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDots: {
          "0%, 80%, 100%": { opacity: "0.3" },
          "40%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 500ms ease-out forwards",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0, 0, 0, 0.5)",
        premium: "0 4px 20px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};
