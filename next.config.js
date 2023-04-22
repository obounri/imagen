/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net', 'replicate.delivery'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
