/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/harshad-duhita',
                destination: '/harshadduhita',
                permanent: true,
            },
        ];
    },
}

module.exports = nextConfig