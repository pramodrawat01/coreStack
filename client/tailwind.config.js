/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08090A',
        surface: '#0E0F11',
        panel: '#141517',
        line: '#26282C',
        muted: '#8B8D93',
        faint: '#57595E',
        accent: '#FF5A2D',
        accent2: '#3B82F6',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, #1A1B1E 1px, transparent 1px), linear-gradient(to bottom, #1A1B1E 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
    },
  },
  plugins: [],
}
