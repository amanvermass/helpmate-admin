/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "helpmate-api.kvtmedia.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: "https://helpmate-api.kvtmedia.com/api/media/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "https://helpmate-api.kvtmedia.com/uploads/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://helpmate-api.kvtmedia.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;