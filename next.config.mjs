/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  allowedDevOrigins: [
    "https://rnhbf-58-136-254-209.a.free.pinggy.link",
    "*.local-origin.dev",
  ],
  reactStrictMode: false,
};

export default nextConfig;
