/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        totem: {
          jordy: '#88AFF9',
          marian: '#2B3D8D',
          black: '#0A0A0A',
          champagne: '#DAC9BF',
          gray: '#BDBBBE',
          platinum: '#DBDFE2',
        },
      },
      fontFamily: {
        archivo: ['Archivo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
