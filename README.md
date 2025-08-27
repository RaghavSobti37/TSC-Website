# The Shakti Collective — Next.js Starter

This project is a lightweight Next.js + Tailwind CSS scaffold using Framer Motion for animations. It uses the assets you provided.

Quick start:

1. npm install
2. npm run dev

The app serves pages: Home (Hero), About, Projects, Team and Footer. Edit components in `components/`.

Important asset setup:

- Move your video file `src/assets/hero video TSC.mp4` into `public/assets/` and rename it to `hero-video.mp4` (no spaces). This avoids bundling binary files and lets Next serve it as `/assets/hero-video.mp4`.

- Static images may remain in `src/assets/` and are imported by components. If you prefer, place them in `public/assets/` and update component src paths accordingly.
