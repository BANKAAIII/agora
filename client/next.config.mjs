/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },

  async rewrites() {
    return [
      {
        source: "/api/chat",
        destination:
          "https://agora-blockchain-production.up.railway.app/api/chat", // Proxy to Flask Backend
      },
    ];
  },
};

export default nextConfig;
