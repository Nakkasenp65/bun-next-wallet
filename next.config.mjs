/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "store.storeimages.cdn-apple.com"],
  },
  allowedDevOrigins: [
    "https://rnhbf-58-136-254-209.a.free.pinggy.link",
    "*.local-origin.dev",
  ],
  reactStrictMode: false,
};

export default nextConfig;
