/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
          {
            source: '/demoday',
            destination: 'https://artist-spotlight-hub.vercel.app',
          },
          {
            source: '/demoday/:path*',
            destination: 'https://artist-spotlight-hub.vercel.app/:path*',
          },
        ]
      },
}

module.exports = nextConfig