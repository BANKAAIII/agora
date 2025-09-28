"use client";
import { sepolia, avalancheFuji } from "viem/chains";

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export const SUPPORTED_CHAINS: Record<string, ChainConfig> = {
  sepolia: {
    id: sepolia.id,
    name: sepolia.name,
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    blockExplorer: sepolia.blockExplorers.default.url,
    nativeCurrency: sepolia.nativeCurrency,
  },
  avalancheFuji: {
    id: avalancheFuji.id,
    name: avalancheFuji.name,
    rpcUrl: process.env.NEXT_PUBLIC_FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc",
    blockExplorer: avalancheFuji.blockExplorers.default.url,
    nativeCurrency: avalancheFuji.nativeCurrency,
  },
};

/**
 * Add a chain to the user's wallet
 */
export async function addChainToWallet(chainConfig: ChainConfig): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Wallet not found");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chainConfig.id.toString(16)}`,
        chainName: chainConfig.name,
        rpcUrls: [chainConfig.rpcUrl],
        blockExplorerUrls: [chainConfig.blockExplorer],
        nativeCurrency: chainConfig.nativeCurrency,
      }],
    });
    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain already added
      return true;
    }
    throw error;
  }
}

/**
 * Switch to a specific chain
 */
export async function switchToChain(chainId: number): Promise<boolean> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("Wallet not found");
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added, try to add it first
      const chainConfig = Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId);
      if (chainConfig) {
        await addChainToWallet(chainConfig);
        // Try switching again
        return await switchToChain(chainId);
      }
    }
    throw error;
  }
}

/**
 * Get current chain ID
 */
export async function getCurrentChainId(): Promise<number | null> {
  if (typeof window === 'undefined' || !window.ethereum) {
    return null;
  }

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return parseInt(chainId, 16);
  } catch (error) {
    console.error("Failed to get current chain ID:", error);
    return null;
  }
}

/**
 * Check if a chain is supported
 */
export function isChainSupported(chainId: number): boolean {
  return Object.values(SUPPORTED_CHAINS).some(chain => chain.id === chainId);
}

/**
 * Get chain configuration by ID
 */
export function getChainConfig(chainId: number): ChainConfig | null {
  return Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId) || null;
}
