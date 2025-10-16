/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google user profile pictures
      'vioqetdvaoxzrqcuuclu.supabase.co' // <-- YAHAN APNA SUPABASE URL DAALEIN
    ],
  },
}

module.exports = nextConfig
