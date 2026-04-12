/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'gold': '#dd901d',
        'gold-dim': 'rgba(221,144,29,0.50)',
        'gold-faint': 'rgba(221,144,29,0.06)',
        'gold-border': 'rgba(221,144,29,0.15)',
        'muted': '#988f81',
        'muted-50': 'rgba(152,143,129,0.50)',
        'muted-20': 'rgba(152,143,129,0.20)',
        'muted-10': 'rgba(152,143,129,0.10)',
        'bg': '#060605',
        'bg-mid': '#0e0c0a',
        'card': '#231d1a',
        'card-50': 'rgba(35,29,26,0.60)',
        'green-accent': '#22c55e',
        'green-dim': 'rgba(34,197,94,0.15)',
        'red-accent': '#ef4343',
        'red-dim': 'rgba(239,67,67,0.15)',
        'blue-accent': '#4387ef',
      },
      fontFamily: {
        'serif': "'IM Fell English', Georgia, serif",
        'sans': "'Inter', sans-serif",
      },
      animation: {
        'pulse-custom': 'pulse-custom 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.35s ease forwards',
      },
      keyframes: {
        'pulse-custom': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'fade-up': {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      gridTemplateColumns: {
        'main': '1fr 360px',
      },
      spacing: {
        '0.75': '3px',
        '1.75': '7px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '9': '36px',
        '9.5': '38px',
        '15': '60px',
      },
    },
  },
  plugins: [],
};
