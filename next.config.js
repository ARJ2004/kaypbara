/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['postgres'],
  images: {
    domains: []
  }
}

module.exports = nextConfig
