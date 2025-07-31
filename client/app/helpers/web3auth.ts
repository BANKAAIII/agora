"use client";
import { Web3Auth } from "@web3auth/modal";
import { IProvider } from "@web3auth/base";

// Suppress Web3Auth SDK logs for production
if (typeof window !== "undefined" && (window as any).log && typeof (window as any).log.setLevel === "function") {
  (window as any).log.setLevel("error");
}

export const web3AuthConfig = {
  clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "YOUR_CLIENT_ID",
  web3AuthNetwork: "sapphire_devnet" as const,
  enableLogging: false,
};

let web3authInstance: Web3Auth | null = null;
let initializing: Promise<Web3Auth> | null = null;

export const initWeb3Auth = async (): Promise<Web3Auth> => {
  if (web3authInstance) return web3authInstance;
  if (initializing) return initializing;
  initializing = (async () => {
    try {
      const instance = new Web3Auth({
        clientId: web3AuthConfig.clientId,
        web3AuthNetwork: web3AuthConfig.web3AuthNetwork,
        enableLogging: web3AuthConfig.enableLogging,
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
      web3authInstance = instance;
      return instance;
    } catch (error) {
      web3authInstance = null;
      throw error;
    } finally {
      initializing = null;
    }
  })();
  return initializing;
};

export const getWeb3AuthProvider = async (): Promise<IProvider> => {
  const web3auth = await initWeb3Auth();
  if (!web3auth.provider) throw new Error("Web3Auth provider not initialized");
  return web3auth.provider;
};

export const login = async () => {
  const web3auth = await initWeb3Auth();
  if (!web3auth) throw new Error("Web3Auth not initialized");
  const provider = await web3auth.connect();
  await web3auth.getUserInfo();
  return provider;
};

export const logout = async () => {
  const web3auth = await initWeb3Auth();
  if (!web3auth) throw new Error("Web3Auth not initialized");
  await web3auth.logout();
};

export const getUserInfo = async () => {
  const web3auth = await initWeb3Auth();
  if (!web3auth) throw new Error("Web3Auth not initialized");
  return web3auth.getUserInfo();
};

export const isConnected = async (): Promise<boolean> => {
  const web3auth = await initWeb3Auth();
  return !!web3auth.provider;
};

export const getAddress = async (): Promise<string | null> => {
  const web3auth = await initWeb3Auth();
  if (!web3auth.provider) return null;
  const accounts = await web3auth.provider.request({ method: "eth_accounts" }) as string[];
  return accounts?.[0] || null;
};

export const getPrivateKey = async (): Promise<string | null> => {
  const web3auth = await initWeb3Auth();
  if (!web3auth.provider) return null;
  const privateKey = await web3auth.provider.request({ method: "eth_private_key" });
  return typeof privateKey === "string" ? privateKey : null;
}; 