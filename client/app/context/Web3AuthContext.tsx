"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Web3Auth as Web3AuthType } from "@web3auth/modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
// OpenLogin adapter not needed with pure v10 Wallet Discovery
// Using pure v10 Wallet Discovery; no explicit external adapters
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
  // Web3Auth instance
  web3auth: any | null;
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
let web3authInstance: Web3AuthType | null = null;
let isInitializing = false;
let isInitialized = false;
let didInitModal = false;

// Initialize Web3Auth instance (singleton)
const initWeb3Auth = async (): Promise<Web3AuthType> => {
  // Return existing instance if already initialized
  if (web3authInstance && isInitialized) {
    if (typeof window !== 'undefined') {
      console.debug('[Web3Auth] Reusing existing initialized instance', {
        connected: (web3authInstance as any)?.connected,
        hasProvider: !!(web3authInstance as any)?.provider,
      });
    }
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
  if (typeof window !== 'undefined') {
    (window as any).__WEB3AUTH_PHASE__ = 'initializing';
    console.debug('[Web3Auth] Starting initialization');
  }

  try {
    // Check environment variable
    const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
    console.debug('[Web3Auth] Env check', {
      hasClientId: !!clientId,
      clientIdPreview: clientId ? `${clientId.slice(0, 4)}...${clientId.slice(-4)}` : null,
      hasSepoliaRpc: !!process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    });
    // Client-only dynamic import; avoids evaluating SDK on server/build
    const { Web3Auth } = await import("@web3auth/modal");
    
    if (!clientId || clientId === "YOUR_CLIENT_ID") {
      console.error('[Web3Auth] Missing NEXT_PUBLIC_WEB3AUTH_CLIENT_ID');
      throw new Error("Web3Auth Client ID is not set or is using placeholder value");
    }

    // Create new Web3Auth instance (client-only)
    web3authInstance = new Web3Auth({
      clientId: clientId,
      web3AuthNetwork: "sapphire_devnet",
      enableLogging: false,
    });

    // Initialize Web3Auth using v10 approach
    try {
      console.debug('[Web3Auth] init() starting');
      await web3authInstance.init();
      console.debug('[Web3Auth] init() completed');
      didInitModal = true;
    } catch (e) {
      // Ignore already-initialized errors in dev hot reload; rethrow others
      const msg = (e as any)?.message || '';
      if (msg.includes('Adapter is already initialized') || msg.includes('already initialized')) {
        console.warn('[Web3Auth] init() already initialized - continuing');
        didInitModal = true;
      } else {
        console.error('[Web3Auth] init() error - aborting initialization', e);
        throw e;
      }
    }
    
    // Web3Auth Modal SDK is ready after instantiation
    isInitialized = true;
    if (typeof window !== 'undefined') {
      (window as any).__WEB3AUTH_PHASE__ = 'ready';
      (window as any).__WEB3AUTH_INSTANCE__ = web3authInstance;
      console.debug('[Web3Auth] Initialization complete');
    }
    return web3authInstance;
  } catch (error) {
    if (typeof window !== 'undefined') {
      (window as any).__WEB3AUTH_PHASE__ = 'error';
      console.error('[Web3Auth] Initialization error', error);
    }
    web3authInstance = null;
    isInitialized = false;
    throw error;
  } finally {
    isInitializing = false;
  }
};

export const Web3AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3auth, setWeb3auth] = useState<Web3AuthType | null>(null);
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
    console.debug('[Web3Auth] useEffect setIsClient(true)');
  }, []);

  // Initialize Web3Auth only on client side
  useEffect(() => {
    if (!isClient) return;

    const initializeWeb3Auth = async () => {
      try {
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          console.debug('[Web3Auth] Skipping init: not in browser');
          return;
        }

        // Initialize Web3Auth using singleton pattern with Smart Accounts enabled
        console.debug('[Web3Auth] Calling initWeb3Auth() ...');
        const web3AuthInstance = await initWeb3Auth();
        console.debug('[Web3Auth] initWeb3Auth() resolved', {
          connected: (web3AuthInstance as any)?.connected,
          hasProvider: !!(web3AuthInstance as any)?.provider,
        });
        
        // Set up event listeners before any operations
        web3AuthInstance.on("connected", (data: any) => {
          console.debug('[Web3Auth] Event: connected', data);
          setIsAuthenticated(true);
        });

        web3AuthInstance.on("connecting", () => {
          console.debug('[Web3Auth] Event: connecting');
        });

        web3AuthInstance.on("disconnected", () => {
          console.debug('[Web3Auth] Event: disconnected');
          setIsAuthenticated(false);
          setUserInfo(null);
          setAddress(null);
        });

        web3AuthInstance.on("errored", (error: any) => {
          console.error('[Web3Auth] Event: errored', error);
          // Silent error handling - errors will be caught by try/catch blocks
        });

        // Store the instance
        setWeb3auth(web3AuthInstance);
        
        // Web3Auth Modal SDK is ready after modal has been initialized
        setIsWeb3AuthReady(didInitModal);
        console.debug('[Web3Auth] isWeb3AuthReady =', didInitModal);
        
      } catch (error) {
        setIsWeb3AuthReady(false);
        toast.error("Failed to initialize Web3Auth. Please check your configuration.");
        console.error('[Web3Auth] Failed to initialize', error);
      }
    };

    initializeWeb3Auth();
  }, [isClient]);

  // Check authentication status after Web3Auth is ready
  useEffect(() => {
    if (isWeb3AuthReady && web3auth) {
      console.debug('[Web3Auth] checkAuthStatus() triggered');
      checkAuthStatus();
    }
  }, [isWeb3AuthReady, web3auth]);

  // Additional debug logging for Web3Auth state
  useEffect(() => {
    console.debug('[Web3Auth] Context state debug:', {
      isClient,
      isWeb3AuthReady,
      hasWeb3auth: !!web3auth,
      isAuthenticated,
      userInfo: userInfo ? 'present' : 'null',
      address,
      scwAddress,
      isUsingSCW
    });
  }, [isClient, isWeb3AuthReady, web3auth, isAuthenticated, userInfo, address, scwAddress, isUsingSCW]);

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
        console.debug('[Web3Auth] checkAuthStatus: connected, fetching user & accounts');
        const user = await web3auth.getUserInfo();
        console.debug('[Web3Auth] userInfo', user);
        const accounts = await web3auth.provider.request({ method: "eth_accounts" }) as string[];
        console.debug('[Web3Auth] accounts', accounts);
        setUserInfo(user);
        setAddress(accounts?.[0] || null);
        setIsAuthenticated(true);
        
        // Restore smart account if Account Abstraction is available
        if (web3auth.accountAbstractionProvider) {
          setTimeout(() => initializeSmartAccount(), 500);
        } else {
          console.log("Account Abstraction not configured in Web3Auth Dashboard");
        }
      } else {
        console.debug('[Web3Auth] checkAuthStatus: not connected');
        // Ensure clean state if not connected
        setIsAuthenticated(false);
        setUserInfo(null);
        setAddress(null);
        setScwAddress(null);
        setIsUsingSCW(false);
        setSmartAccount(null);
      }
    } catch (error) {
      console.error('[Web3Auth] checkAuthStatus error', error);
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
    if (!web3auth?.provider || !(web3auth as any)?.accountAbstractionProvider) {
      console.warn('[SmartAccount] initializeSmartAccount called without AA provider or provider', {
        hasProvider: !!web3auth?.provider,
        hasAA: !!(web3auth as any)?.accountAbstractionProvider,
      });
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
      console.debug('[SmartAccount] Initialized', { scwAddr });
      
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
      console.debug('[Web3Auth] login() starting');
      // Use Web3Auth connect method to open the modal
      const provider = await web3auth.connect();
      console.debug('[Web3Auth] connect() resolved', { hasProvider: !!provider });
      if (!provider) {
        throw new Error('Web3Auth connect() returned null provider');
      }
      const user = await web3auth.getUserInfo();
      console.debug('[Web3Auth] getUserInfo() resolved', user);
      const accounts = await provider.request({ method: "eth_accounts" }) as string[];
      console.debug('[Web3Auth] eth_accounts', accounts);
      setUserInfo(user);
      setAddress(accounts[0] || null);
      setIsAuthenticated(true);
      
      // Login successful - initialize smart account if available
      
      toast.success("Successfully logged in!");
      
      // Initialize smart account after successful login
      if (web3auth.accountAbstractionProvider) {
        setTimeout(() => initializeSmartAccount(), 500);
      } else {
        console.log("Account Abstraction not available after login - check Web3Auth Dashboard configuration");
      }
    } catch {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
      console.debug('[Web3Auth] login() finished');
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
      console.error('[Web3Auth] logout() error');
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
    // Web3Auth instance
    web3auth,
  };

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
}; 