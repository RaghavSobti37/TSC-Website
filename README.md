# The Shakti Collective

A modern, animated website for The Shakti Collective, built with Next.js, Tailwind CSS, and Framer Motion.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

Follow these steps to get your development environment running.

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd TSC-Website
```

### 2. Install Dependencies
Install the required npm packages.
```bash
npm install
```

### 3. Asset Setup (Important)
This project uses video backgrounds. For them to work correctly, you must place your video files inside the `public/` directory at the root of the project.

- **Hero Section Video**: Place your video as `public/hero-video.mp4`.
- **About Section Video**: Place your video as `public/hero.mp4`.

### 4. Run the Development Server
Start the Next.js development server.
```bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

## Project Structure

- `components/`: Contains all the React components for different sections of the site (e.g., `Hero.js`, `About.js`, `Projects.js`).
- `styles/globals.css`: Contains global styles and Tailwind CSS directives.
- `public/`: Contains static assets like videos and images that are served directly by the browser.

## Technologies Used

- **Next.js** - React Framework
- **Tailwind CSS** - Utility-First CSS Framework
- **Framer Motion** - Animation Library for React
