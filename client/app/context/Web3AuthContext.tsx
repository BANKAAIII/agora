"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { IProvider } from "@web3auth/base";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import toast from "react-hot-toast";

interface Web3AuthContextType {
  isAuthenticated: boolean;
  userInfo: any;
  address: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isWeb3AuthReady: boolean;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(undefined);

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};

// Singleton Web3Auth instance
let web3authInstance: Web3Auth | null = null;
let isInitializing = false;
let isInitialized = false;

// Initialize Web3Auth instance (singleton)
const initWeb3Auth = async (): Promise<Web3Auth> => {
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
    // Check environment variable
    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
    console.log("Web3Auth Client ID:", clientId);
    console.log("Client ID type:", typeof clientId);
    console.log("Client ID length:", clientId?.length);
    
    if (!clientId || clientId === "YOUR_CLIENT_ID") {
      throw new Error("Web3Auth Client ID is not set or is using placeholder value");
    }

    // Create new instance with different configuration
    web3authInstance = new Web3Auth({
      clientId: clientId,
      web3AuthNetwork: "sapphire_devnet",
      enableLogging: true,
    });

    console.log("Web3Auth instance created successfully");
    
    // Initialize the Web3Auth instance properly
    console.log("Initializing Web3Auth instance...");
    await web3authInstance.init();
    console.log("Web3Auth instance initialized successfully");
    
    // Check if there's an initModal method available
    if (typeof (web3authInstance as any).initModal === 'function') {
      console.log("Found initModal method, calling it...");
      await (web3authInstance as any).initModal();
      console.log("initModal called successfully");
    } else {
      console.log("No initModal method found");
    }
    
    // Check for other modal-related methods
    console.log("Available methods on web3auth instance:", Object.getOwnPropertyNames(Object.getPrototypeOf(web3authInstance)));
    
    // Try to manually trigger modal rendering if possible
    if (typeof (web3authInstance as any).showModal === 'function') {
      console.log("Found showModal method, calling it...");
      (web3authInstance as any).showModal();
      console.log("showModal called");
    }
    
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

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWeb3AuthReady, setIsWeb3AuthReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const { isConnected: wagmiConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connectAsync } = useConnect();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Web3Auth only on client side
  useEffect(() => {
    if (!isClient) return;

    const initializeWeb3Auth = async () => {
      try {
        console.log("Initializing Web3Auth on client side...");
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.log("Not in browser environment, skipping Web3Auth initialization");
          return;
        }

        // Check if Web3Auth is available
        if (typeof Web3Auth === 'undefined') {
          console.error("Web3Auth is not available");
          return;
        }

        // Initialize Web3Auth using singleton pattern
        const web3AuthInstance = await initWeb3Auth();
        
        console.log("Web3Auth instance created, setting up event listeners...");
        
        // Set up event listeners before any operations
        web3AuthInstance.on("connected", (data) => {
          console.log("Web3Auth connected:", data);
          setIsAuthenticated(true);
        });

        web3AuthInstance.on("connecting", () => {
          console.log("Web3Auth connecting...");
        });

        web3AuthInstance.on("disconnected", () => {
          console.log("Web3Auth disconnected");
          setIsAuthenticated(false);
          setUserInfo(null);
          setAddress(null);
        });

        web3AuthInstance.on("errored", (error) => {
          console.error("Web3Auth error:", error);
        });

        // Store the instance
        setWeb3auth(web3AuthInstance);
        console.log("Web3Auth instance stored in context");
        
        // Wait for modal to be fully initialized
        console.log("Waiting for modal to be ready...");
        
        // Add a longer delay to ensure modal DOM elements are fully ready
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if modal elements are present in DOM
        const modalElements = document.querySelectorAll('[data-web3auth-modal]');
        console.log("Modal elements found:", modalElements.length);
        
        // Web3Auth Modal SDK is ready after instantiation
        setIsWeb3AuthReady(true);
        console.log("Web3Auth marked as ready");
        
      } catch (error) {
        console.error("Failed to initialize Web3Auth:", error);
        setIsWeb3AuthReady(false);
        toast.error("Failed to initialize Web3Auth. Please check your configuration.");
      }
    };

    initializeWeb3Auth();
  }, [isClient]);

  // Check authentication status after Web3Auth is ready
  useEffect(() => {
    if (isWeb3AuthReady && web3auth) {
      checkAuthStatus();
    }
  }, [isWeb3AuthReady, web3auth]);

  // Expose Web3Auth state to window for other components to access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__WEB3AUTH_STATE__ = {
        isAuthenticated,
        userInfo,
        address,
        isWeb3AuthReady,
      };
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('web3auth-state-changed', {
        detail: {
          isAuthenticated,
          userInfo,
          address,
          isWeb3AuthReady,
        }
      }));
    }
  }, [isAuthenticated, userInfo, address, isWeb3AuthReady]);

  const checkAuthStatus = async () => {
    if (!web3auth) return;
    
    try {
      const connected = web3auth.connected;
      if (connected && web3auth.provider) {
        const user = await web3auth.getUserInfo();
        const accounts = await web3auth.provider.request({
          method: "eth_accounts",
        }) as string[];
        
        setUserInfo(user);
        setAddress(accounts?.[0] || null);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  const handleLogin = async () => {
    if (!isClient) {
      toast.error("Web3Auth is not available on server side.");
      return;
    }

    if (!isWeb3AuthReady || !web3auth) {
      toast.error("Web3Auth is not ready yet. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting to connect with Web3Auth...");
      console.log("Web3Auth connected state:", web3auth.connected);
      
      // Try to connect with retry mechanism
      let provider = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (!provider && retryCount < maxRetries) {
        try {
          console.log(`Login attempt ${retryCount + 1}/${maxRetries}`);
          
          // Use the official connect method
          provider = await web3auth.connect();
          
          if (provider) {
            console.log("Successfully connected to Web3Auth");
            break;
          }
        } catch (connectError: any) {
          console.error(`Login attempt ${retryCount + 1} failed:`, connectError);
          
          if (connectError.message?.includes("Wallet is not ready yet")) {
            console.log("Modal not ready, waiting and retrying...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            retryCount++;
            continue;
          } else {
            throw connectError;
          }
        }
      }
      
      if (!provider) {
        throw new Error("Failed to connect after multiple attempts");
      }
      
      // Get user info after successful connection
      const user = await web3auth.getUserInfo();
      const accounts = await provider.request({
        method: "eth_accounts",
      }) as string[];
      
      setUserInfo(user);
      setAddress(accounts[0] || null);
      setIsAuthenticated(true);
      
      // Note: Wagmi integration will be handled separately
      // For now, the Web3Auth login is successful
      console.log("Web3Auth login successful, address:", accounts[0]);
      
      toast.success("Successfully logged in!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!isWeb3AuthReady || !web3auth) {
      toast.error("Web3Auth is not ready yet. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      await web3auth.logout();
      disconnect(); // Disconnect from Wagmi as well
      setUserInfo(null);
      setAddress(null);
      setIsAuthenticated(false);
      toast.success("Successfully logged out!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value: Web3AuthContextType = {
    isAuthenticated,
    userInfo,
    address,
    login: handleLogin,
    logout: handleLogout,
    isLoading,
    isWeb3AuthReady,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}; 