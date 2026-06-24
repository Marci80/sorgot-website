/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#bc404a',
          dark: '#a03540',
        },
      },
      fontFamily: {
        ploni: ['Ploni', 'Heebo', 'sans-serif'],
        heebo: ['Heebo', 'sans-serif'],
        abraham: ['Abraham', 'serif'],
        fbtipograf: ['FbTipograf', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
