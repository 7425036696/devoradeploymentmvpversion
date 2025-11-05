/** @type {import('next').NextConfig} */
const nextConfig = {
  // -------------------------------------------------
  // 1. Allow Cloudinary images in <Image />
  // -------------------------------------------------
  images: {
    // Legacy way (still works in Next 13+)
    domains: ['res.cloudinary.com'],

    // Recommended way – fine-grained remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // optional: limit to specific paths (e.g. /image/upload)
        // pathname: '/image/upload/**',
      },
    ],
  },

  // -------------------------------------------------
  // 2. (Optional) Other common Next.js tweaks
  // -------------------------------------------------
  reactStrictMode: true,
  swcMinify: true,

  // Example: if you also use other CDNs
  // remotePatterns: [
  //   { protocol: 'https', hostname: 'res.cloudinary.com' },
  //   { protocol: 'https', hostname: 'images.example.com' },
  // ],
};

export default nextConfig;