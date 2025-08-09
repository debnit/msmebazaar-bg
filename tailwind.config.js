/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // Adjust to your source dirs
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // enable dark mode via `.dark` class on <html> or <body>
  theme: {
    extend: {
      // You can extend colors from your CSS variables if you want, example:
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        muted: 'var(--muted)',
        destructive: 'var(--destructive)',
        // add more as needed
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'), // assuming you installed tailwindcss-animate plugin
  ],
}
