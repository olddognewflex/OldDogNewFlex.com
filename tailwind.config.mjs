import { typography } from "@tailwindcss/typography";

export default {

  content: [
    {
      files: "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      relative: true,
    },
  ],
  theme: {
    colors: {
      background: '#0E0C1B',
      surface: '#1C1A2E',
      primaryText: '#F4F4F8',
      secondaryText: '#C9B6F2',
      accent: {
        pink: '#FF4CAD',
        orange: '#FF8C2B',
        cyan: '#5DEEFF',
        yellow: '#FFE22E',
        purple: '#B47BFF',
      },
    },
    fontFamily: {
      heading: ['Orbitron', ...fontFamily.sans],
      mono: ['Share Tech Mono', ...fontFamily.mono],
    },
    boxShadow: {
      neon: '0 0 8px rgba(255, 76, 173, 0.5)',
    },
  },
  plugins: [typography],
};
