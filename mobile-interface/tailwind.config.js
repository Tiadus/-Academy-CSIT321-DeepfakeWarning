/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'background-primary': '#000003',
      'background-secondary': '#01002E',
      'background-tertiary': '#040240',
      'text-primary': '#F1F1F1',
      'text-secondary': '#767676',
      'text-success': '#12E200',
      'text-danger': '#E20000',
      'text-warning': '#E27A00',
      'app-primary': '#1A5AFF',
      'app-primary-glow': '#0793F9',
      'app-secondary': '#99008A',
      'app-secondary-glow': '#DD00C7',
      'border-outline': '#7B78DB',
      'button-primary': '#020063',
      'button-secondary': '#6E0E59'
    },
    extend: {},
  },
  plugins: [],
}

