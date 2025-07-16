"use client";
import React from "react";
import { useWeb3Auth } from "@/app/context/Web3AuthContext";
import { useAccount } from "wagmi";

const TestWeb3Auth = () => {
  const { isAuthenticated, userInfo, address, login, logout, isLoading } = useWeb3Auth();
  const { isConnected: wagmiConnected } = useAccount();

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Web3Auth Test</h2>
      
      <div className="space-y-4">
        <div>
          <strong>Web3Auth Status:</strong> {isAuthenticated ? "✅ Connected" : "❌ Disconnected"}
        </div>
        
        <div>
          <strong>Wagmi Status:</strong> {wagmiConnected ? "✅ Connected" : "❌ Disconnected"}
        </div>
        
        {userInfo && (
          <div>
            <strong>User Info:</strong>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
              {JSON.stringify(userInfo, null, 2)}
            </pre>
          </div>
        )}
        
        {address && (
          <div>
            <strong>Address:</strong> {address}
          </div>
        )}
        
        <div className="flex gap-2">
          {!isAuthenticated ? (
            <button
              onClick={login}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <button
              onClick={logout}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "Disconnecting..." : "Disconnect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestWeb3Auth; 