/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Image optimization
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256],
    },
    
    // Enable compression
    compress: true,
    
    // Production optimizations
    poweredByHeader: false,
    
    // Better caching headers
    async headers() {
        return [
            {
                source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                ],
            },
        ];
    },
    
    experimental: {
        serverComponentsExternalPackages: ['better-sqlite3'],
    },
}
module.exports = nextConfig