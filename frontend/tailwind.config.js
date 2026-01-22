/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Minecraft color palette
        minecraft: {
          grass: '#7CB342',
          dirt: '#8D6E63',
          stone: '#757575',
          wood: '#6D4C41',
          gold: '#FFD700',
          diamond: '#00BCD4',
          iron: '#9E9E9E',
          coal: '#424242',
          redstone: '#F44336',
          lapis: '#3F51B5',
          emerald: '#4CAF50',
          obsidian: '#263238',
        },
        // UI colors
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        minecraft: ['"Minecraftia"', 'monospace'],
        sans: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'block-break': 'blockBreak 0.5s ease-out',
        'mining': 'mining 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blockBreak: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(1.1) rotate(5deg)', opacity: '0.8' },
          '100%': { transform: 'scale(0) rotate(10deg)', opacity: '0' },
        },
        mining: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
      },
      boxShadow: {
        'minecraft': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'minecraft-inset': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
        'pixel': '0 0 0 2px currentColor',
      },
      backgroundImage: {
        'minecraft-grass': 'linear-gradient(180deg, #7CB342 0%, #558B2F 100%)',
        'minecraft-stone': 'linear-gradient(180deg, #757575 0%, #424242 100%)',
        'minecraft-dirt': 'linear-gradient(180deg, #8D6E63 0%, #5D4037 100%)',
        'minecraft-wood': 'linear-gradient(180deg, #6D4C41 0%, #3E2723 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      const newUtilities = {
        '.pixel-border': {
          border: '2px solid currentColor',
          boxShadow: '0 0 0 2px currentColor',
        },
        '.pixel-text': {
          textShadow: '2px 2px 0px rgba(0,0,0,0.5)',
          imageRendering: 'pixelated',
        },
        '.minecraft-block': {
          borderStyle: 'solid',
          borderWidth: '2px',
          borderColor: '#000',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
          imageRendering: 'pixelated',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
