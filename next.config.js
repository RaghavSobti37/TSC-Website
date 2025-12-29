/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return {
          beforeFiles: [
            {
              source: '/demoday',
              destination: 'https://artist-spotlight-hub.vercel.app/',
            },
            {
              source: '/demoday/:path*',
              destination: 'https://artist-spotlight-hub.vercel.app/:path*',
            },
          ],
          fallback: [
            {
              source: '/assets/:path*',
              destination: 'https://artist-spotlight-hub.vercel.app/assets/:path*',
            },
          ],
        }
      },
}

module.exports = nextConfig