// File: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Recommended for helping find potential problems
  images: {
    // Whitelist domains for next/image optimization.
    // This is crucial for loading your Supabase Storage images.
    domains: [
      'lh3.googleusercontent.com', // For Google user profile pictures
      'vioqetdvaoxzrqcuuclu.supabase.co' // **REPLACE THIS** with your Supabase project ref
    ],
  },
}

module.exports = nextConfig
