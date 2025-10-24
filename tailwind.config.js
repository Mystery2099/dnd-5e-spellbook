import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class', // Use class-based dark mode for manual control
    content: [
        "./index.html",
        "./src/**/*.{svelte,js,ts,jsx,tsx}",
        "./src/*.{svelte,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            }
        }
    },
    plugins: [
        typography,
    ],
}