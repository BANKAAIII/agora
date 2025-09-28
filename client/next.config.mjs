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

  webpack: (config, { isServer }) => {
    // Fix Web3Auth dependency issues
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "react-native": false,
      "react-native-keychain": false,
      "react-native-mmkv": false,
      "react-native-fs": false,
    };

    // Ignore React Native specific modules in browser build
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@react-native-async-storage/async-storage": false,
        "react-native": false,
      };
    }

    return config;
  },

  // Suppress warnings for React Native dependencies
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
