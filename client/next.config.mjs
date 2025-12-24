import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  
  // Disable TypeScript and ESLint errors for production builds
  typescript: {
    ignoreBuildErrors: true,
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
      "fs": false,
      "path": false,
      "crypto": false,
    };

    // Ignore React Native specific modules in browser build
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@react-native-async-storage/async-storage": false,
        "react-native": false,
      };
    }

    // Add path alias for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": resolve(__dirname, "app"),
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

 turbopack:{}
};

export default nextConfig;