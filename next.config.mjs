const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:4000").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Le navigateur appelle /api/* sur le même domaine ; Next relaie vers l'API Node.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${BACKEND_URL}/api/:path*` }];
  }
};

export default nextConfig;
