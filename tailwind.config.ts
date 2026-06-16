import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF5EB',
        gold: '#B48C28',
        'gold-2': '#C8A032',
        'gold-3': '#DCB950',
        maroon: '#78141E',
        'soft-black': '#14120E',
        'dark-sidebar': '#120E08',
        border: '#DDD0B0',
      },
    },
  },
  plugins: [],
}
export default config
