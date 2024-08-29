module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        expand: {
          '0%': { maxHeight: '0' },
          '100%': { maxHeight: '200px' },
        },
      },
      animation: {
        expand: 'expand 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}