/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tse: {
          dark: '#1a1f2c',
          card: '#222836',
          green: '#00875a',
          orange: '#f36b00',
          whiteBtn: '#e2e8f0',
          keypad: '#181d28',
          yellow: '#f59e0b',
        }
      },
      fontFamily: {
        mono: ['"Courier Prime"', '"Roboto Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'urn-glow': '0 0 30px rgba(0, 135, 90, 0.25)',
        'screen-inner': 'inset 0 2px 8px rgba(0,0,0,0.6)',
      }
    },
  },
  plugins: [],
}
