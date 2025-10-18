/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'vioqetdvaoxzrqcuuclu.supabase.co', // **AAPKA SUPABASE HOSTNAME YAHA AAYEGA**
      },
    ],
  },
}

module.exports = nextConfig
