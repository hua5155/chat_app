/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            animation: {},
            keyframe: {}
        }
    },
    plugins: [require('@tailwindcss/typography')]
};
