/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.backblazeb2.com', 'f002.backblazeb2.com'],
  },
  env: {
    BACKBLAZE_BUCKET_URL: process.env.BACKBLAZE_BUCKET_URL,
  },
};

module.exports = nextConfig;
