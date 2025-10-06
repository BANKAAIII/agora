"use client";
import { Web3Auth } from "@web3auth/modal";
import { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

// Configuration for Sepolia network
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 in hex
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org";

// Config-based sponsorship (for demo purposes)
const SPONSORED_ELECTIONS: string[] = [
  // Add election addresses that should be sponsored
  // Example: "0x1234567890123456789012345678901234567890"
];

export interface SmartAccountConfig {
  chainId: string;
  rpcUrl: string;
  bundlerUrl?: string;
  paymasterUrl?: string;
}

export interface UserOperation {
  target: string;
  data: string;
  value?: string;
}

let smartAccountInstance: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Initialize Web3Auth and create a smart account instance
 */
export async function initSmartAccount(): Promise<any> {
  if (smartAccountInstance) return smartAccountInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Reuse existing Web3Auth instance initialized by the context
      const web3auth: any = typeof window !== 'undefined' ? (window as any).__WEB3AUTH_INSTANCE__ : null;
      if (!web3auth) {
        throw new Error("Web3Auth not initialized. Initialize via Web3AuthContext.initModal() first.");
      }

      if (typeof window !== 'undefined') {
        console.debug('[SmartAccount] initSmartAccount: provider?', !!web3auth.provider);
      }

      // Check if user is already connected
      if (!web3auth.provider) {
        throw new Error("Web3Auth provider not available. Please login first.");
      }

      // Create a simple smart account wrapper
      const smartAccount = {
        web3auth,
        provider: web3auth.provider,
        address: await getProviderAddress(web3auth.provider),
        chainId: SEPOLIA_CHAIN_ID,
        isReady: true,
        
        // Send user operation (simplified for now)
        async sendUserOperation(userOp: UserOperation) {
          return await this.sendTransaction(userOp);
        },

        // Send transaction using the provider
        async sendTransaction(userOp: UserOperation) {
          if (!this.provider) {
            throw new Error("Provider not available");
          }

          const ethersProvider = new ethers.providers.Web3Provider(this.provider);
          const signer = ethersProvider.getSigner();

          const tx = {
            to: userOp.target,
            data: userOp.data,
            value: userOp.value || "0x0",
          };

          const transaction = await signer.sendTransaction(tx);
          return await transaction.wait();
        },

        // Get account address
        async getAddress(): Promise<string> {
          if (!this.provider) {
            throw new Error("Provider not available");
          }
          const accounts = await this.provider.request({ method: "eth_accounts" }) as string[];
          return accounts[0];
        },

        // Check if account has sufficient balance
        async hasBalance(): Promise<boolean> {
          if (!this.provider) return false;
          const ethersProvider = new ethers.providers.Web3Provider(this.provider);
          const address = await this.getAddress();
          const balance = await ethersProvider.getBalance(address);
          return balance.gt(ethers.utils.parseEther("0.001")); // At least 0.001 ETH
        }
      };

      smartAccountInstance = smartAccount;
      return smartAccount;
    } catch (error) {
      // Failed to initialize smart account
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

/**
 * Get smart account address from Web3Auth provider (internal helper)
 */
async function getProviderAddress(provider: IProvider): Promise<string> {
  try {
    const accounts = await provider.request({ method: "eth_accounts" }) as string[];
    if (!accounts || accounts.length === 0) {
      console.warn('[SmartAccount] getProviderAddress: no accounts returned');
      return '';
    }
    return accounts[0];
  } catch (err) {
    console.error('[SmartAccount] getProviderAddress error', err);
    return '';
  }
}

/**
 * Get smart account instance
 */
export async function getSmartAccount() {
  return await initSmartAccount();
}

/**
 * Check if an election is sponsored (config-based)
 */
export function isElectionSponsored(electionAddress: string): boolean {
  return SPONSORED_ELECTIONS.includes(electionAddress.toLowerCase());
}

/**
 * Send user operation with optional paymaster support
 */
export async function sendUserOpWithPaymaster(
  target: string,
  data: string,
  value: string = "0x0"
): Promise<any> {
  const smartAccount = await getSmartAccount();
  
  const userOp: UserOperation = {
    target,
    data,
    value,
  };

  // Check if election is sponsored
  const isSponsored = isElectionSponsored(target);
  
  if (isSponsored) {
    // For sponsored elections, we could implement paymaster logic here
    // For now, we'll just send the transaction normally
    // Election is sponsored
  } else {
    // Check if user has sufficient balance
    const hasBalance = await smartAccount.hasBalance();
    if (!hasBalance) {
      throw new Error("Insufficient balance for gas fees. This election is not sponsored.");
    }
  }

  return await smartAccount.sendUserOperation(userOp);
}

/**
 * Get smart account address
 */
export async function getSmartAccountAddress(): Promise<string | null> {
  try {
    const smartAccount = await getSmartAccount();
    return await smartAccount.getAddress();
  } catch (error) {
    // Failed to get smart account address
    return null;
  }
}

/**
 * Check if smart account is ready
 */
export async function isSmartAccountReady(): Promise<boolean> {
  try {
    const smartAccount = await getSmartAccount();
    return smartAccount.isReady;
  } catch (error) {
    return false;
  }
}

/**
 * Check if user has sufficient balance for gas
 */
export async function hasSufficientBalance(): Promise<boolean> {
  try {
    const smartAccount = await getSmartAccount();
    return await smartAccount.hasBalance();
  } catch (error) {
    return false;
  }
} 