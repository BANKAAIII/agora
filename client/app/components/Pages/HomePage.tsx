"use client";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";

// Client-only component to handle Web3Auth integration
const ClientHomePage = () => {
  const { isConnected: wagmiConnected } = useAccount();
  const [web3AuthConnected, setWeb3AuthConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to check Web3Auth state
  const checkWeb3Auth = () => {
    try {
      // Access Web3Auth context from window or global state
      const web3AuthState = (window as any).__WEB3AUTH_STATE__;
      if (web3AuthState && web3AuthState.isAuthenticated) {
        setWeb3AuthConnected(true);
      } else {
        setWeb3AuthConnected(false);
      }
    } catch (error) {
      console.log("Web3Auth not available");
      setWeb3AuthConnected(false);
    }
  };
  
  useEffect(() => {
    // Initial check
    checkWeb3Auth();
    setIsLoading(false);
    
    // Additional check after a short delay to ensure Web3Auth is initialized
    const timeoutId = setTimeout(() => {
      checkWeb3Auth();
    }, 500);
    
    // Listen for Web3Auth state changes
    const handleWeb3AuthStateChange = (event: CustomEvent) => {
      console.log("Web3Auth state changed:", event.detail);
      setWeb3AuthConnected(event.detail.isAuthenticated);
    };
    
    // Add event listener
    window.addEventListener('web3auth-state-changed', handleWeb3AuthStateChange as EventListener);
    
    // Cleanup event listener and timeout on unmount
    return () => {
      window.removeEventListener('web3auth-state-changed', handleWeb3AuthStateChange as EventListener);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // User is connected if either Wagmi or Web3Auth is connected
  const isUserConnected = wagmiConnected || web3AuthConnected;
  
  // Debug logging
  console.log("Authentication State:", {
    wagmiConnected,
    web3AuthConnected,
    isUserConnected,
    web3AuthState: (window as any).__WEB3AUTH_STATE__
  });
  
  if (isLoading) {
    return (
      <main className="h-screen pt-20 w-full bg-white overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="h-screen pt-20 w-full bg-white overflow-hidden">
      {isUserConnected ? <Dashboard /> : <LoginPage />}
    </main>
  );
};

const HomePage = () => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Show loading during SSR
  if (!isClient) {
    return (
      <main className="h-screen pt-20 w-full bg-white overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </main>
    );
  }
  
  return <ClientHomePage />;
};

export default HomePage;
