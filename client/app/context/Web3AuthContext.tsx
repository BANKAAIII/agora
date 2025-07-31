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
  // Smart Account fields
  scwAddress: string | null;
  isUsingSCW: boolean;
  isSponsored: boolean;
  smartAccount: any | null;
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
    return web3authInstance;
  }

  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    // Wait for initialization to complete
    while (isInitializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (web3authInstance && isInitialized) {
      return web3authInstance;
    }
  }

  isInitializing = true;

  try {
    // Check environment variable
    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
    
    if (!clientId || clientId === "YOUR_CLIENT_ID") {
      throw new Error("Web3Auth Client ID is not set or is using placeholder value");
    }

    // Create new instance with different configuration
    web3authInstance = new Web3Auth({
      clientId: clientId,
      web3AuthNetwork: "sapphire_devnet",
      enableLogging: false,
    });

    // Initialize the Web3Auth instance properly
    await web3authInstance.init();
    
    // Check if there's an initModal method available
    if (typeof (web3authInstance as any).initModal === 'function') {
      await (web3authInstance as any).initModal();
    }
    
    // Try to manually trigger modal rendering if possible
    if (typeof (web3authInstance as any).showModal === 'function') {
      (web3authInstance as any).showModal();
    }
    
    // Web3Auth Modal SDK is ready after instantiation
    isInitialized = true;
    return web3authInstance;
  } catch (error) {
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
  // Smart Account state
  const [scwAddress, setScwAddress] = useState<string | null>(null);
  const [isUsingSCW, setIsUsingSCW] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [smartAccount, setSmartAccount] = useState<any | null>(null);
  
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
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          return;
        }

        // Check if Web3Auth is available
        if (typeof Web3Auth === 'undefined') {
          return;
        }

                      // Initialize Web3Auth using singleton pattern with Smart Accounts enabled
        const web3AuthInstance = await initWeb3Auth();
        
        // Set up event listeners before any operations
        web3AuthInstance.on("connected", (data) => {
          setIsAuthenticated(true);
        });

        web3AuthInstance.on("connecting", () => {
        });

        web3AuthInstance.on("disconnected", () => {
          setIsAuthenticated(false);
          setUserInfo(null);
          setAddress(null);
        });

        web3AuthInstance.on("errored", (error) => {
          // Silent error handling - errors will be caught by try/catch blocks
        });

        // Store the instance
        setWeb3auth(web3AuthInstance);
        
        // Web3Auth Modal SDK is ready after instantiation
        setIsWeb3AuthReady(true);
        
      } catch (error) {
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

  // Smart account is now initialized explicitly after login, not automatically
  // useEffect(() => {
  //   if (isAuthenticated && web3auth?.provider && web3auth?.accountAbstractionProvider) {
  //     initializeSmartAccount();
  //   }
  // }, [isAuthenticated, web3auth]);

  // Expose Web3Auth state to window for other components to access
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__WEB3AUTH_STATE__ = {
        isAuthenticated,
        userInfo,
        address,
        isWeb3AuthReady,
        scwAddress,
        isUsingSCW,
        isSponsored,
      };
      window.dispatchEvent(new CustomEvent('web3auth-state-changed', {
        detail: {
          isAuthenticated,
          userInfo,
          address,
          isWeb3AuthReady,
          scwAddress,
          isUsingSCW,
          isSponsored,
        }
      }));
    }
  }, [isAuthenticated, userInfo, address, isWeb3AuthReady, scwAddress, isUsingSCW, isSponsored]);

  const checkAuthStatus = async () => {
    if (!web3auth) return;
    try {
      if (web3auth.connected && web3auth.provider) {
        const user = await web3auth.getUserInfo();
        const accounts = await web3auth.provider.request({ method: "eth_accounts" }) as string[];
        setUserInfo(user);
        setAddress(accounts?.[0] || null);
        setIsAuthenticated(true);
        
        // Restore smart account if Account Abstraction is available
        if (web3auth.accountAbstractionProvider) {
          setTimeout(() => initializeSmartAccount(), 500);
        }
      } else {
        // Ensure clean state if not connected
        setIsAuthenticated(false);
        setUserInfo(null);
        setAddress(null);
        setScwAddress(null);
        setIsUsingSCW(false);
        setSmartAccount(null);
      }
    } catch (error) {
      // Reset state on error
      setIsAuthenticated(false);
      setUserInfo(null);
      setAddress(null);
      setScwAddress(null);
      setIsUsingSCW(false);
      setSmartAccount(null);
    }
  };

  const initializeSmartAccount = async () => {
    if (!web3auth?.provider || !web3auth?.accountAbstractionProvider) {
      return;
    }
    
    try {
      // Import smart account utilities dynamically
      const { getSmartAccount, getSmartAccountAddress } = await import("@/app/helpers/smartAccountV2");
      
      // Pass the existing web3auth instance to avoid creating a new one
      const smartAccountInstance = await getSmartAccount(web3auth);
      const scwAddr = await getSmartAccountAddress(web3auth);
      
      setSmartAccount(smartAccountInstance);
      setScwAddress(scwAddr);
      setIsUsingSCW(true);
      setIsSponsored(false);
      
    } catch (error) {
      setIsUsingSCW(false);
      setSmartAccount(null);
      setScwAddress(null);
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
      let provider = null;
      let retryCount = 0;
      const maxRetries = 3;
      while (!provider && retryCount < maxRetries) {
        try {
          provider = await web3auth.connect();
          if (provider) break;
        } catch (connectError: any) {
          if (connectError.message?.includes("Wallet is not ready yet")) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            retryCount++;
            continue;
          } else {
            throw connectError;
          }
        }
      }
      if (!provider) throw new Error("Failed to connect after multiple attempts");
      const user = await web3auth.getUserInfo();
      const accounts = await provider.request({ method: "eth_accounts" }) as string[];
      setUserInfo(user);
      setAddress(accounts[0] || null);
      setIsAuthenticated(true);
      
      // Login successful - initialize smart account if available
      
      toast.success("Successfully logged in!");
      
      // Initialize smart account after successful login
      if (web3auth.accountAbstractionProvider) {
        setTimeout(() => initializeSmartAccount(), 500);
      }
    } catch {
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
      disconnect();
      setUserInfo(null);
      setAddress(null);
      setIsAuthenticated(false);
      toast.success("Successfully logged out!");
    } catch {
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
    // Smart Account fields
    scwAddress,
    isUsingSCW,
    isSponsored,
    smartAccount,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}; 