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

  // Efficiently check Web3Auth state
  const checkWeb3Auth = () => {
    try {
      const web3AuthState = (window as any).__WEB3AUTH_STATE__;
      setWeb3AuthConnected(!!(web3AuthState && web3AuthState.isAuthenticated));
    } catch {
      setWeb3AuthConnected(false);
    }
  };

  useEffect(() => {
    // Immediate check
    checkWeb3Auth();
    setIsLoading(false);
    
    // Optimized check with shorter delay for better UX
    const timeoutId = setTimeout(checkWeb3Auth, 300);
    
    // Listen for Web3Auth state changes
    const handleWeb3AuthStateChange = (event: CustomEvent) => {
      setWeb3AuthConnected(event.detail.isAuthenticated);
      setIsLoading(false); // Ensure loading stops when state changes
    };
    
    window.addEventListener('web3auth-state-changed', handleWeb3AuthStateChange as EventListener);
    
    return () => {
      window.removeEventListener('web3auth-state-changed', handleWeb3AuthStateChange as EventListener);
      clearTimeout(timeoutId);
    };
  }, []);

  const isUserConnected = wagmiConnected || web3AuthConnected;

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
  useEffect(() => { setIsClient(true); }, []);
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
