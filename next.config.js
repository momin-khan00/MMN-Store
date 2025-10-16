/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['api.backblazeb2.com', 'f002.backblazeb2.com', 'your-project-ref.supabase.co'],
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
  // Static export हटा दें
  // output: 'export', // इस line को comment करें या delete करें
};

module.exports = nextConfig;
