/** @type {import('next').NextConfig} */
const nextConfig = {
  // The API runs as a separate process; proxying it under /api keeps the whole
  // platform on one origin so session cookies are first-party.
  async rewrites() {
    const target = process.env.API_INTERNAL_URL || "http://127.0.0.1:3001";
    return [{ source: "/api/:path*", destination: `${target}/:path*` }];
  },
  async redirects() {
    return [
      { source: "/marketplace", destination: "/trade", permanent: true },
      { source: "/docs", destination: "/help", permanent: true },
    ];
  },
  poweredByHeader: false,
};

export default nextConfig;
