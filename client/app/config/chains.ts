// Custom chain definitions to avoid viem/chains import issues
export const sepolia = {
  id: 11155111,
  name: "Sepolia",
  network: "sepolia",
  nativeCurrency: { 
    name: "Sepolia Ether", 
    symbol: "SEP", 
    decimals: 18 
  },
  rpcUrls: {
    default: { 
      http: ["https://rpc.sepolia.org"] 
    },
    public: { 
      http: ["https://rpc.sepolia.org"] 
    },
  },
  blockExplorers: {
    default: { 
      name: "Etherscan", 
      url: "https://sepolia.etherscan.io" 
    },
  },
  testnet: true,
} as const;

export const avalancheFuji = {
  id: 43113,
  name: "Avalanche Fuji",
  network: "avalanche-fuji",
  nativeCurrency: { 
    name: "Avalanche", 
    symbol: "AVAX", 
    decimals: 18 
  },
  rpcUrls: {
    default: { 
      http: ["https://api.avax-test.network/ext/bc/C/rpc"] 
    },
    public: { 
      http: ["https://api.avax-test.network/ext/bc/C/rpc"] 
    },
  },
  blockExplorers: {
    default: { 
      name: "SnowTrace", 
      url: "https://testnet.snowtrace.io" 
    },
  },
  testnet: true,
} as const;
