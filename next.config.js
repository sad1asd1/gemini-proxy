/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/gemini',
        destination: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      },
    ]
  },
}

module.exports = nextConfig 