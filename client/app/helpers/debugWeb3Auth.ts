"use client";

/**
 * Debug function to check Web3Auth Account Abstraction status
 */
export function debugWeb3AuthStatus(web3auth: any): void {
  console.log("=== Web3Auth Debug Information ===");
  console.log("Web3Auth instance:", !!web3auth);
  console.log("Connected:", web3auth?.connected);
  console.log("Provider available:", !!web3auth?.provider);
  console.log("Account Abstraction Provider:", !!web3auth?.accountAbstractionProvider);
  
  if (web3auth?.accountAbstractionProvider) {
    const aap = web3auth.accountAbstractionProvider;
    console.log("AA Provider details:", {
      bundlerClient: !!aap.bundlerClient,
      smartAccount: !!aap.smartAccount,
      bundlerClientType: aap.bundlerClient?.constructor?.name,
      smartAccountType: aap.smartAccount?.constructor?.name,
      smartAccountAddress: aap.smartAccount?.address,
    });
  }
  
  console.log("=== End Web3Auth Debug ===");
}

/**
 * Check if Web3Auth has properly configured Account Abstraction
 */
export function isWeb3AuthAAReady(web3auth: any): boolean {
  return !!(
    web3auth?.connected &&
    web3auth?.provider &&
    web3auth?.accountAbstractionProvider?.bundlerClient &&
    web3auth?.accountAbstractionProvider?.smartAccount
  );
}

/**
 * Get smart account address from Web3Auth if available
 */
export function getSmartAccountAddress(web3auth: any): string | null {
  try {
    return web3auth?.accountAbstractionProvider?.smartAccount?.address || null;
  } catch (error) {
    console.error("Error getting smart account address:", error);
    return null;
  }
}
