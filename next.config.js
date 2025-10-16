/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['api.backblazeb2.com', 'f002.backblazeb2.com', 'https://vioqetdvaoxzrqcuuclu.supabase.co'],
  },
  env: {
    BACKBLAZE_BUCKET_URL: process.env.BACKBLAZE_BUCKET_URL,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Static export नहीं करें
  // output: 'export', // इस line को remove करें या comment करें
};

module.exports = nextConfig;
