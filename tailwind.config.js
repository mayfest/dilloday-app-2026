/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#173885', // blue
        secondary: '#841973', // purple
        accent: '#F6F2A3', // yellow
        'accent-pink': '#FFB1CD',
        'accent-red': '#D61919',
        neutral: '#AABCCD', // gray-blue

        // Semantic mappings
        background: '#173885', // using primary blue
        'card-bg': '#F6F2A3', // using accent yellow
        'card-alt': '#FFB1CD', // using accent pink

        // Text colors
        'text-primary': '#F6F2A3', // yellow on blue
        'text-on-card': '#173885', // blue on yellow
        'text-on-action': '#F6F2A3', // yellow on purple/blue
      },
    },
  },
  plugins: [],
};
