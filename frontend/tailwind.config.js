/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          50:  '#fdf4f5',
          100: '#fbe6e9',
          200: '#f5ccd4',
          300: '#eba3b1',
          400: '#dd6d84',
          500: '#c73856',
          600: '#a81c3c',
          700: '#8b102c', // Classic deep maroon
          800: '#740c24', // Rich imperial maroon
          900: '#5c081c', // Dark maroon
          950: '#380410', // Deepest maroon-black
        },
        pearl: {
          50:  '#ffffff',
          100: '#faf7f7',
          200: '#f4eeee',
          300: '#ebe1e3',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:   { '0%': { opacity: 0 },                                            '100%': { opacity: 1 } },
        slideIn:  { '0%': { transform: 'translateX(-10px)', opacity: 0 },             '100%': { transform: 'translateX(0)', opacity: 1 } },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
