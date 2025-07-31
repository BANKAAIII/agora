"use client";
import { Web3Auth } from "@web3auth/modal";
import { createWalletClient, custom, parseEther } from "viem";

// Configuration for supported chains
const SUPPORTED_CHAINS = {
  SEPOLIA: "0xaa36a7",
  AVALANCHE_FUJI: "0xa869",
} as const;

export interface SmartAccountConfig {
  chainId: string;
  bundlerUrl: string;
  paymasterUrl?: string;
}

export interface UserOperation {
  target: string;
  data: string;
  value?: string;
}

let smartAccountInstance: any = null;
let walletClient: any = null;
let initPromise: Promise<any> | null = null;

/**
 * Initialize Web3Auth Smart Account
 */
export async function initSmartAccount(existingWeb3Auth?: any): Promise<any> {
  if (smartAccountInstance) return smartAccountInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      let web3auth = existingWeb3Auth;
      
      // If no existing Web3Auth instance provided, create a new one (fallback)
      if (!web3auth) {
        // Creating new Web3Auth instance
        // Import Web3Auth dynamically to avoid SSR issues
        const { Web3Auth } = await import("@web3auth/modal");
        
        web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "YOUR_CLIENT_ID",
          web3AuthNetwork: "sapphire_devnet",
          enableLogging: false,
          accountAbstractionConfig: {
            smartAccountType: "metamask",
            chains: [
              {
                chainId: "0xaa36a7", // Sepolia
                bundlerConfig: {
                  url: "https://api.pimlico.io/v2/11155111/rpc?apikey=pim_MiaYuXkQNsWzVGLeRJdyUG",
                },
                paymasterConfig: {
                  url: "https://api.pimlico.io/v2/11155111/rpc?apikey=pim_MiaYuXkQNsWzVGLeRJdyUG",
                },
              },
            ],
          },
          // Override the chain config to ensure Sepolia RPC consistency
          chainConfig: {
            chainNamespace: "eip155",
            chainId: "0xaa36a7", // Sepolia
            rpcTarget: "https://ethereum-sepolia-rpc.publicnode.com",
            displayName: "Ethereum Sepolia",
            blockExplorerUrl: "https://sepolia.etherscan.io",
            ticker: "ETH",
            tickerName: "Sepolia Ether",
          },
        } as any);

        await web3auth.init();
      } else {
        // Using existing Web3Auth instance from context
      }

      // Check if user is already connected
      if (!web3auth.provider) {
        throw new Error("Web3Auth provider not available. Please login first.");
      }

      // Create wallet client for Smart Account
      walletClient = createWalletClient({
        transport: custom(web3auth.provider),
      });

      // Get Smart Account provider
      const accountAbstractionProvider = web3auth.accountAbstractionProvider;
      if (!accountAbstractionProvider) {
        throw new Error("Smart Account provider not available");
      }

      const bundlerClient = accountAbstractionProvider.bundlerClient!;
      const smartAccount = accountAbstractionProvider.smartAccount!;

      // Get addresses
      const addresses = await walletClient.getAddresses();
      const smartAccountAddress = addresses[0];
      const eoaAddress = addresses[1];

      smartAccountInstance = {
        web3auth,
        provider: web3auth.provider,
        accountAbstractionProvider,
        bundlerClient,
        smartAccount,
        walletClient,
        smartAccountAddress,
        eoaAddress,
        isReady: true,
        
        // Send user operation with optional paymaster
        async sendUserOperation(userOp: UserOperation, paymasterContext?: any) {
          if (!this.bundlerClient || !this.smartAccount) {
            throw new Error("Smart Account not initialized");
          }

          const userOpHash = await this.bundlerClient.sendUserOperation({
            account: this.smartAccount,
            calls: [
              {
                to: userOp.target,
                data: userOp.data,
                value: userOp.value || "0x0",
              },
            ],
            ...(paymasterContext && { paymasterContext }),
          });

          // Wait for transaction
          const receipt = await this.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
          });

          return receipt;
        },

        // Send batch transaction
        async sendBatchTransaction(calls: Array<{ to: string; data: string; value?: string }>) {
          if (!this.bundlerClient || !this.smartAccount) {
            throw new Error("Smart Account not initialized");
          }

          const userOpHash = await this.bundlerClient.sendUserOperation({
            account: this.smartAccount,
            calls,
          });

          const receipt = await this.bundlerClient.waitForUserOperationReceipt({
            hash: userOpHash,
          });

          return receipt;
        },

        // Get smart account address
        async getSmartAccountAddress(): Promise<string> {
          return this.smartAccountAddress;
        },

        // Get EOA address
        async getEOAAddress(): Promise<string> {
          return this.eoaAddress;
        },

        // Check if account has sufficient balance
        async hasBalance(): Promise<boolean> {
          if (!this.provider) return false;
          const balance = await this.provider.request({
            method: "eth_getBalance",
            params: [this.smartAccountAddress, "latest"],
          });
          return BigInt(balance) > parseEther("0.001");
        },

        // Sign message
        async signMessage(message: string): Promise<string> {
          if (!this.walletClient) {
            throw new Error("Wallet client not available");
          }
          return await this.walletClient.signMessage({
            account: this.smartAccountAddress,
            message,
          });
        },
      };

      return smartAccountInstance;
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
 * Get smart account instance
 */
export async function getSmartAccount(existingWeb3Auth?: any) {
  return await initSmartAccount(existingWeb3Auth);
}

/**
 * Send transaction with paymaster for sponsored elections
 * TRUE GASLESS VOTING - user pays $0, paymaster covers gas
 */
export async function sendTransactionWithPaymaster(
  target: string,
  data: string,
  value: string = "0x0",
  electionAddress?: string
): Promise<any> {
  const smartAccount = await getSmartAccount();
  
  // Check if election is sponsored and should be gasless
  const isSponsored = await checkElectionSponsorship(electionAddress);
  
  if (isSponsored) {
    // Sending gasless transaction
    // Web3Auth will automatically use the Pimlico paymaster configured in accountAbstractionConfig
    return await smartAccount.sendUserOperation({ target, data, value });
  } else {
    // Sending regular transaction
    // For non-sponsored elections: User pays gas
    return await smartAccount.sendUserOperation({ target, data, value });
  }
}

/**
 * Check if an election is sponsored
 */
async function checkElectionSponsorship(electionAddress?: string): Promise<boolean> {
  if (!electionAddress) return false;
  
  try {
    // Import ethers dynamically - using v5 syntax
    const { ethers } = await import("ethers");
    const { Election } = await import("@/abi/artifacts/Election");
    
    // Get current provider (ethers v5)
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"
    );
    
    // Create contract instance
    const electionContract = new ethers.Contract(electionAddress, Election, provider);
    
    // Get sponsorship status from contract
    const sponsorshipStatus = await electionContract.getSponsorshipStatus();
    
    // Check if sponsored and has funds (minimum 0.01 ETH) - ethers v5
    const minAmount = ethers.utils.parseEther("0.01");
    const hasEnoughFunds = sponsorshipStatus.remainingBalance.gte(minAmount);
    
    return sponsorshipStatus.isSponsored && hasEnoughFunds;
  } catch (error) {
    // Error checking election sponsorship
    return false;
  }
}

/**
 * Get smart account address
 */
export async function getSmartAccountAddress(existingWeb3Auth?: any): Promise<string | null> {
  try {
    const smartAccount = await getSmartAccount(existingWeb3Auth);
    return await smartAccount.getSmartAccountAddress();
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

/**
 * Get detailed sponsorship status for an election
 */
export async function getElectionSponsorshipStatus(electionAddress: string): Promise<{
  isSponsored: boolean;
  remainingBalance: string;
  totalVotesSponsored: number;
  message: string;
  costPerVote: string;
}> {
  try {
    // Import ethers dynamically
    const { ethers } = await import("ethers");
    const { Election } = await import("@/abi/artifacts/Election");
    
    // Get current provider (ethers v5)
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"
    );
    
    // Create contract instance
    const electionContract = new ethers.Contract(electionAddress, Election, provider);
    
    // Get sponsorship status from contract
    const sponsorshipStatus = await electionContract.getSponsorshipStatus();
    
    // Check if sponsored and has funds (minimum 0.01 ETH) - ethers v5
    const minAmount = ethers.utils.parseEther("0.01");
    const hasEnoughFunds = sponsorshipStatus.remainingBalance.gte(minAmount);
    const isActive = sponsorshipStatus.isSponsored && hasEnoughFunds;
    
    // Format remaining balance (ethers v5)
    const remainingBalanceEth = ethers.utils.formatEther(sponsorshipStatus.remainingBalance);
    
    // Calculate estimated votes remaining (0.001 ETH per vote)
    const estimatedVotesRemaining = Math.floor(
      Number(remainingBalanceEth) / 0.001
    );
    
    let message: string;
    if (!sponsorshipStatus.isSponsored) {
      message = "No sponsorship - user pays gas fees";
    } else if (!hasEnoughFunds) {
      message = "Sponsorship depleted - user pays gas fees";
    } else {
      message = `Gas sponsored (${estimatedVotesRemaining} votes remaining)`;
    }
    
    return {
      isSponsored: isActive,
      remainingBalance: remainingBalanceEth,
      totalVotesSponsored: Number(sponsorshipStatus.totalVotesSponsored),
      message,
      costPerVote: "0.001" // Fixed cost per vote
    };
  } catch (error) {
    // Error getting election sponsorship status
    return {
      isSponsored: false,
      remainingBalance: "0",
      totalVotesSponsored: 0,
      message: "Error checking sponsorship status",
      costPerVote: "0.001"
    };
  }
}

/**
 * Check if sponsorship funds can cover a vote (public function for UI)
 */
export async function canVoteWithSponsorship(electionAddress: string): Promise<boolean> {
  return await checkElectionSponsorship(electionAddress);
} 