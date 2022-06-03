module.exports = {
   content: [
     "./pages/**/*.{ts,tsx}",
     "./components/**/*.{ts,tsx}",
   ],
   theme: {
      extend: {
         animation: {
            fadeIn: 'fadeIn .15s ease-in'
         },
         keyframes: {
            fadeIn: {
               from: { opacity: 0 },
               to: { opacity: 1 }
            }
         }
      },
   },
   plugins: [],
}
