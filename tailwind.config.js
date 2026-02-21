import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                blog: {
                    primary: 'var(--blog-color-primary)',
                    secondary: 'var(--blog-color-secondary)',
                    accent: 'var(--blog-color-accent)',
                    neutral: 'var(--blog-color-neutral)',
                    base: 'var(--blog-color-base)',
                },
                brand: {
                    dark: '#0C0A09',
                    surface: '#1C1917',
                    elevated: '#292524',
                    border: '#44403C',
                    cream: '#FAFAF9',
                    muted: '#A8A29E',
                    gold: '#CA8A04',
                    'gold-light': '#FDE68A',
                },
            },
            fontFamily: {
                sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
                serif: ['Cormorant', 'serif'],
                mono: ['Space Mono', 'monospace'],
            },
            borderRadius: {
                none: '0px',
            },
        },
    },

    plugins: [forms],
};
