"use client";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";

// Web3Auth configuration
export const web3AuthConfig = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "YOUR_CLIENT_ID", // Get from https://dashboard.web3auth.io
  web3AuthNetwork: "testnet" as const,
  enableLogging: true,
};

// Singleton Web3Auth instance
let web3authInstance: Web3Auth | null = null;
let isInitializing = false;

// Initialize Web3Auth instance (singleton)
export const initWeb3Auth = async (): Promise<Web3Auth> => {
  if (web3authInstance && web3authInstance.connected !== undefined) {
    return web3authInstance;
  }
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return web3authInstance!;
  }
  isInitializing = true;
  try {
    web3authInstance = new Web3Auth({
      clientId: web3AuthConfig.clientId,
      web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
      enableLogging: web3AuthConfig.enableLogging,
    });
    await web3authInstance.initModal(); // <-- CRITICAL: ensure modal is initialized
    console.log("Web3Auth initialized successfully");
    return web3authInstance;
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    web3authInstance = null;
    throw error;
  } finally {
    isInitializing = false;
  }
}; 