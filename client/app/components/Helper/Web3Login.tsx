"use client";
import React from "react";
import { useWeb3Auth } from "@/app/context/Web3AuthContext";

const Web3Login = () => {
  // Try to get Web3Auth context, but handle gracefully if not available
  let authContext;
  try {
    authContext = useWeb3Auth();
  } catch (error) {
    // Context not available - render fallback UI
    return (
      <div className="p-4">
        <button
          disabled
          className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-400 bg-gray-200 rounded-lg cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          Web3Auth Not Available
        </button>
      </div>
    );
  }

  const { isAuthenticated, userInfo, address, login, logout, isLoading, isWeb3AuthReady } = authContext;

  const getDisplayName = () => {
    if (userInfo?.name) return userInfo.name;
    if (userInfo?.email) return userInfo.email;
    if (address) return `${address.slice(0, 6)}...${address.slice(-4)}`;
    return "Connect Wallet";
  };

  const getDisplayAvatar = () => {
    if (userInfo?.profileImage) return userInfo.profileImage;
    return "👤"; // Default avatar emoji
  };

  const renderAvatar = () => {
    if (userInfo?.profileImage) {
      return (
        <img 
          src={userInfo.profileImage} 
          alt="Profile" 
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
        👤
      </div>
    );
  };

  if (isAuthenticated && userInfo) {
    return (
      <div className="flex items-center gap-3 p-4">
        <div className="flex items-center gap-2">
          {renderAvatar()}
          <span className="text-sm font-medium text-gray-700">
            {getDisplayName()}
          </span>
        </div>
        <button
          onClick={logout}
          disabled={isLoading || !isWeb3AuthReady}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 disabled:opacity-50"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <button
        onClick={login}
        disabled={isLoading || !isWeb3AuthReady}
        className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 disabled:opacity-50 transition-colors"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : !isWeb3AuthReady ? (
          <>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Initializing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>
    </div>
  );
};

export default Web3Login; 