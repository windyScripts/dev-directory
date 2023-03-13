/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.tsx',
    './components/**/*.tsx',
  ],
  important: '#__next',
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
