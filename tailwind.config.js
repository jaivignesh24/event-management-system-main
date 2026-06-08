/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkNavy: '#0A0B1A',
        darkNavyLight: '#0E1026',
        neonPurple: '#9333EA',
        neonCyan: '#06B6D4',
        neonPink: '#EC4899',
        auroraNavy: '#1D2A44',
        auroraPurple: '#6D28D9',
        auroraPink: '#EC4899',
        auroraAmber: '#FB923C',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'neon-pink': '0 0 15px rgba(236, 72, 153, 0.4)',
        'neon-purple': '0 0 15px rgba(147, 51, 234, 0.4)',
      },
    },
  },
  plugins: [],
}
