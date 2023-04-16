/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
