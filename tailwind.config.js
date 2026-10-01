/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          cream: '#F9F6F0',    // لون الخلفية الأساسي
          leather: '#332418',  // لون النصوص والتفاصيل
          copper: '#D4AF37',   // لون اللمسات (الزراير)
          dark: '#1A1817',     // للـ Dark mode أو الهيدر
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // للنصوص العادية
        serif: ['Playfair Display', 'serif'], // للعناوين
      }
    },
  },
  plugins: [],
}