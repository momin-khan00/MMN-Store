/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['api.backblazeb2.com', 'f002.backblazeb2.com', 'your-project-ref.supabase.co'],
    unoptimized: true, // Static export के लिए जरूरी
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
  // Static export के लिए यह line add करें
  output: 'export',
  // Trailing slash को handle करने के लिए
  trailingSlash: true,
  // Base path के लिए (अगर आप subdirectory में deploy कर रहे हैं)
  // basePath: '/your-repo-name',
};

module.exports = nextConfig;
