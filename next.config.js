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
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
