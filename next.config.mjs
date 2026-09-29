/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: "http://localhost:5005/api/media/:path*",
      },
      {
        source: "/backend/media/:path*",
        destination: "https://helpmate-api.kvtmedia.com/api/media/:path*",
      },
    ];
  },
};

export default nextConfig;