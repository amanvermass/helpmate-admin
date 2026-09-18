/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/media/:path*",
        destination: "http://localhost:5005/api/media/:path*",
      },
    ];
  },
};

export default nextConfig;
