"use client";
import { ethers } from "ethers";

/**
 * Send transaction using Web3Auth Account Abstraction Provider
 * This will automatically use the Pimlico bundler/paymaster configured in Web3Auth Dashboard
 */
export async function sendWeb3AuthTransaction(
  web3auth: any,
  contractAddress: string,
  abi: readonly any[] | any[],
  functionName: string,
  args: any[],
  value: string = "0x0"
): Promise<any> {
  if (!web3auth?.accountAbstractionProvider) {
    throw new Error("Web3Auth Account Abstraction not available. Please ensure you're logged in with Web3Auth.");
  }

  try {
    // Create ethers interface for encoding
    const iface = new ethers.utils.Interface(abi as any);
    const data = iface.encodeFunctionData(functionName, args);

    // Get bundler client and smart account from Web3Auth's Account Abstraction Provider
    const accountAbstractionProvider = web3auth.accountAbstractionProvider;
    const bundlerClient = accountAbstractionProvider.bundlerClient;
    const smartAccount = accountAbstractionProvider.smartAccount;

    if (!bundlerClient || !smartAccount) {
      throw new Error("Bundler client or smart account not available from Web3Auth");
    }

    console.log("Sending transaction via Web3Auth Account Abstraction");
    console.log("Contract:", contractAddress);
    console.log("Function:", functionName);
    console.log("Data:", data);

    // Use Web3Auth's bundler client - this automatically handles Pimlico paymaster from dashboard config
    const userOpHash = await bundlerClient.sendUserOperation({
      account: smartAccount,
      calls: [
        {
          to: contractAddress,
          data: data,
          value: value,
        },
      ],
    });

    console.log("UserOperation Hash:", userOpHash);

    // Wait for transaction receipt
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
    });
    
    console.log("Transaction Receipt:", receipt);
    return receipt;

  } catch (error) {
    console.error("Web3Auth transaction error:", error);
    throw error;
  }
}

/**
 * Check if Web3Auth Account Abstraction is available
 */
export function isWeb3AuthAAAvailable(web3auth: any): boolean {
  return !!(web3auth?.accountAbstractionProvider);
}

/**
 * Get smart account address from Web3Auth
 */
export async function getWeb3AuthSmartAccountAddress(web3auth: any): Promise<string | null> {
  if (!web3auth?.accountAbstractionProvider) {
    return null;
  }

  try {
    // Get smart account address from the smart account instance
    const smartAccount = web3auth.accountAbstractionProvider.smartAccount;
    if (smartAccount?.address) {
      return smartAccount.address;
    }
    
    // Fallback: try to get from provider
    const { createWalletClient, custom } = await import("viem");
    const walletClient = createWalletClient({
      transport: custom(web3auth.provider),
    });
    const addresses = await walletClient.getAddresses();
    return addresses[0] || null;
  } catch (error) {
    console.error("Error getting smart account address:", error);
    return null;
  }
}

/**
 * Get EOA address from Web3Auth
 */
export async function getWeb3AuthEOAAddress(web3auth: any): Promise<string | null> {
  if (!web3auth?.provider) {
    return null;
  }

  try {
    const accounts = await web3auth.provider.request({ method: "eth_accounts" });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error getting EOA address:", error);
    return null;
  }
}
