"use client";
import { QueryClient } from "@tanstack/react-query";
import { createConfig, http } from "wagmi";
import { sepolia, avalancheFuji } from "wagmi/chains";

// Create Wagmi configuration
export const config = createConfig({
  chains: [sepolia, avalancheFuji],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org"),
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_FUJI_RPC_URL || "https://api.avax-test.network/ext/bc/C/rpc"),
  },
});

export const queryClient = new QueryClient();
