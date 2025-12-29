/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return {
          beforeFiles: [
            {
              source: '/demo-assets/:path*',
              destination: 'https://artist-spotlight-hub.vercel.app/assets/:path*',
            },
          ],
          fallback: [
            {
              source: '/:path*',
              destination: 'https://artist-spotlight-hub.vercel.app/:path*',
            },
          ],
        }
      },
}

module.exports = nextConfig