"use client";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";

// Web3Auth configuration
export const web3AuthConfig = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "YOUR_CLIENT_ID", // Get from https://dashboard.web3auth.io
  web3AuthNetwork: "testnet" as const,
  enableLogging: true,
};

// Singleton Web3Auth instance with proper state tracking
let web3authInstance: Web3Auth | null = null;
let isInitializing = false;
let isInitialized = false;

// Initialize Web3Auth instance (singleton)
export const initWeb3Auth = async (): Promise<Web3Auth> => {
  // Return existing instance if already initialized
  if (web3authInstance && isInitialized) {
    console.log("Returning existing Web3Auth instance");
    return web3authInstance;
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    console.log("Web3Auth is already initializing, waiting...");
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (web3authInstance && isInitialized) {
      return web3authInstance;
    }
  }

  isInitializing = true;
  console.log("Starting Web3Auth initialization...");

  try {
    // Create new instance
    web3authInstance = new Web3Auth({
      clientId: web3AuthConfig.clientId,
      web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
      enableLogging: web3AuthConfig.enableLogging,
    });

    console.log("Web3Auth instance created successfully");
    
    // Web3Auth Modal SDK is ready after instantiation
    isInitialized = true;
    console.log("Web3Auth initialized successfully");
    return web3authInstance;
  } catch (error) {
    console.error("Error initializing Web3Auth:", error);
    web3authInstance = null;
    isInitialized = false;
    throw error;
  } finally {
    isInitializing = false;
  }
};

// Get Web3Auth provider for Wagmi
export const getWeb3AuthProvider = async (): Promise<IProvider> => {
  const web3auth = await initWeb3Auth();
  
  if (!web3auth.provider) {
    throw new Error("Web3Auth provider not initialized");
  }

  return web3auth.provider;
};

// Login function
export const login = async () => {
  try {
    console.log("Starting login process...");
    const web3auth = await initWeb3Auth();
    
    if (!web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    console.log("Web3Auth ready, attempting to connect...");
    const web3authProvider = await web3auth.connect();
    
    // Get user info after successful connection
    const userInfo = await web3auth.getUserInfo();
    console.log("User info:", userInfo);
    
    return web3authProvider;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const web3auth = await initWeb3Auth();
    
    if (!web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    await web3auth.logout();
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

// Get user info
export const getUserInfo = async () => {
  try {
    const web3auth = await initWeb3Auth();
    
    if (!web3auth) {
      throw new Error("Web3Auth not initialized");
    }

    if (web3auth.connected) {
      return await web3auth.getUserInfo();
    }
    
    return null;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
};

// Check if user is connected
export const isConnected = async (): Promise<boolean> => {
  try {
    const web3auth = await initWeb3Auth();
    return web3auth.connected;
  } catch (error) {
    console.error("Error checking connection status:", error);
    return false;
  }
};

// Get user's wallet address
export const getAddress = async (): Promise<string | null> => {
  try {
    const web3auth = await initWeb3Auth();
    
    if (!web3auth.connected || !web3auth.provider) {
      return null;
    }

    const accounts = await web3auth.provider.request({
      method: "eth_accounts",
    }) as string[];

    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting address:", error);
    return null;
  }
};

// Get user's private key (for Account Abstraction)
export const getPrivateKey = async (): Promise<string | null> => {
  try {
    const web3auth = await initWeb3Auth();
    
    if (!web3auth.connected || !web3auth.provider) {
      return null;
    }

    const privateKey = await web3auth.provider.request({
      method: "private_key",
    }) as string;

    return privateKey || null;
  } catch (error) {
    console.error("Error getting private key:", error);
    return null;
  }
}; 