"use client";

// Configuration for paymaster service
const PAYMASTER_CONFIG = {
  // For demo purposes, we'll use a simple config-based approach
  // In production, this would be fetched from a contract or API
  enabled: true,
  supportedChains: ["0xaa36a7"], // Sepolia
  maxGasLimit: "500000", // 500k gas limit
  sponsoredElections: [] as string[],
};

export interface PaymasterConfig {
  enabled: boolean;
  supportedChains: string[];
  maxGasLimit: string;
  sponsoredElections: string[];
}

export interface PaymasterData {
  paymasterAndData: string;
  preVerificationGas: string;
  verificationGasLimit: string;
  callGasLimit: string;
}

/**
 * Check if paymaster is enabled for the current chain
 */
export function isPaymasterEnabled(chainId: string): boolean {
  return PAYMASTER_CONFIG.enabled && 
         PAYMASTER_CONFIG.supportedChains.includes(chainId);
}

/**
 * Check if an election is sponsored (config-based)
 */
export function isElectionSponsored(electionAddress: string): boolean {
  return PAYMASTER_CONFIG.sponsoredElections.includes(
    electionAddress.toLowerCase()
  );
}

/**
 * Get paymaster configuration
 */
export function getPaymasterConfig(): PaymasterConfig {
  return { ...PAYMASTER_CONFIG };
}

/**
 * Add election to sponsored list (for demo purposes)
 */
export function addSponsoredElection(electionAddress: string): void {
  const normalizedAddress = electionAddress.toLowerCase();
  if (!PAYMASTER_CONFIG.sponsoredElections.includes(normalizedAddress)) {
    PAYMASTER_CONFIG.sponsoredElections.push(normalizedAddress);
  }
}

/**
 * Remove election from sponsored list
 */
export function removeSponsoredElection(electionAddress: string): void {
  const normalizedAddress = electionAddress.toLowerCase();
  const index = PAYMASTER_CONFIG.sponsoredElections.indexOf(normalizedAddress);
  if (index > -1) {
    PAYMASTER_CONFIG.sponsoredElections.splice(index, 1);
  }
}

/**
 * Get paymaster data for a transaction using Pimlico
 */
export async function getPaymasterData(
  target: string,
  data: string,
  value: string = "0x0"
): Promise<PaymasterData | null> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_PIMLICO_API_KEY;
    if (!apiKey) {
      console.warn("Pimlico API key not configured");
      return null;
    }

    const response = await fetch(
      `https://api.pimlico.io/v2/11155111/rpc`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'pm_sponsorUserOperation',
          params: [
            {
              userOperation: {
                sender: target,
                nonce: '0x0',
                callData: data,
                callGasLimit: '0x0',
                verificationGasLimit: '0x0',
                preVerificationGas: '0x0',
                maxFeePerGas: '0x0',
                maxPriorityFeePerGas: '0x0',
                paymasterAndData: '0x',
                signature: '0x',
              },
              entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
            },
            {
              type: 'payg',
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.error('Pimlico paymaster request failed:', response.statusText);
      return null;
    }

    const result = await response.json();
    if (result.error) {
      console.error('Pimlico paymaster error:', result.error);
      return null;
    }

    return {
      paymasterAndData: result.result.paymasterAndData,
      preVerificationGas: result.result.preVerificationGas,
      verificationGasLimit: result.result.verificationGasLimit,
      callGasLimit: result.result.callGasLimit,
    };
  } catch (error) {
    console.error('Error getting paymaster data:', error);
    return null;
  }
}

/**
 * Check if transaction should use paymaster
 */
export function shouldUsePaymaster(
  electionAddress: string,
  chainId: string
): boolean {
  return isPaymasterEnabled(chainId) && isElectionSponsored(electionAddress);
}

/**
 * Get sponsorship status for an election
 */
export function getSponsorshipStatus(electionAddress: string): {
  isSponsored: boolean;
  message: string;
} {
  const isSponsored = isElectionSponsored(electionAddress);
  
  return {
    isSponsored,
    message: isSponsored 
      ? "Gas fees sponsored by admin" 
      : "User pays gas fees"
  };
}

/**
 * Helper function to add test elections for demo purposes
 * Call this function in the browser console to add an election for testing
 */
export function addTestElectionForDemo(electionAddress: string): void {
  const normalizedAddress = electionAddress.toLowerCase();
  if (!PAYMASTER_CONFIG.sponsoredElections.includes(normalizedAddress)) {
    PAYMASTER_CONFIG.sponsoredElections.push(normalizedAddress);
      // Added election to sponsored list
  } else {
    // Election already sponsored
  }
}

// Expose to window for easy testing
if (typeof window !== 'undefined') {
  (window as any).addTestElectionForDemo = addTestElectionForDemo;
  (window as any).getPaymasterConfig = getPaymasterConfig;
} 