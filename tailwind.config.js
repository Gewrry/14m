/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#FFF0F5',
          100: '#FFE0EC',
          200: '#FFC1D9',
          300: '#F8C8D8',
          400: '#F0A0C0',
          500: '#E87CA8',
          600: '#D45D8E',
          DEFAULT: '#F8C8D8',
        },
        champagne: {
          50: '#FFF8F0',
          100: '#FFEFD6',
          200: '#FFDFA8',
          300: '#E8C89C',
          400: '#D4A574',
          500: '#C08A52',
          DEFAULT: '#D4A574',
        },
        ivory: {
          50: '#FFFCF8',
          100: '#FFF8F0',
          200: '#FFF3E6',
          DEFAULT: '#FFF8F0',
        },
        lavender: {
          50: '#F8F0FF',
          100: '#F0E4FA',
          200: '#E8D5F5',
          300: '#D4B8E8',
          400: '#C09EDB',
          DEFAULT: '#E8D5F5',
        },
        cream: {
          50: '#FFFDF8',
          100: '#FDF5E6',
          200: '#FAECD0',
          DEFAULT: '#FDF5E6',
        },
        'rose-dark': '#8B2252',
        midnight: '#1A0A2E',
        'warm-black': '#0D0A0B',
        'deep-plum': '#2D1B3D',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'drift': 'drift 12s linear infinite',
        'sway': 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(248,200,216,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(248,200,216,0.5)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        drift: {
          '0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)' },
          '100%': { transform: 'translateX(100vw) translateY(-50px) rotate(360deg)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'romantic-gradient': 'linear-gradient(135deg, #1A0A2E 0%, #2D1B3D 30%, #1A0A2E 60%, #0D0A0B 100%)',
        'card-glow': 'radial-gradient(ellipse at center, rgba(248,200,216,0.08) 0%, transparent 70%)',
        'champagne-shine': 'linear-gradient(135deg, #D4A574 0%, #E8C89C 50%, #D4A574 100%)',
      },
    },
  },
  plugins: [],
};
