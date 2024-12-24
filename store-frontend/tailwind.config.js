/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend:{
      colors: {
        'amazon_blue': '#232f3e',
        'white': '#ffffff',
        'saffron': {'100':'#F0C142', '200':'#EEBB2F', '300':'#EDB51D', '400':'#E2AB12', '500':'#D09D11'},
        'goldenrod': '#D09D11',
        'night': '#161616',
        'eeire-black': {'100':'#262626', '200':'#212121'},
      },
    },
  },
  plugins: [],
}

