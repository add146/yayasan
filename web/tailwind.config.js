/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: 'var(--color-primary-50, #eff6ff)',
                    100: 'var(--color-primary-100, #dbeafe)',
                    200: 'var(--color-primary-200, #bfdbfe)',
                    300: 'var(--color-primary-300, #93c5fd)',
                    400: 'var(--color-primary-400, #60a5fa)',
                    500: 'var(--color-primary-500, #3b82f6)',
                    600: 'var(--color-primary-600, #2563eb)',
                    700: 'var(--color-primary-700, #1d4ed8)',
                    800: 'var(--color-primary-800, #1e40af)',
                    900: 'var(--color-primary-900, #1e3a8a)',
                    950: 'var(--color-primary-950, #172554)',
                },
                secondary: {
                    50: 'var(--color-secondary-50, #f0fdf4)',
                    100: 'var(--color-secondary-100, #dcfce7)',
                    200: 'var(--color-secondary-200, #bbf7d0)',
                    300: 'var(--color-secondary-300, #86efac)',
                    400: 'var(--color-secondary-400, #4ade80)',
                    500: 'var(--color-secondary-500, #22c55e)',
                    600: 'var(--color-secondary-600, #16a34a)',
                    700: 'var(--color-secondary-700, #15803d)',
                    800: 'var(--color-secondary-800, #166534)',
                    900: 'var(--color-secondary-900, #14532d)',
                    950: 'var(--color-secondary-950, #052e16)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
