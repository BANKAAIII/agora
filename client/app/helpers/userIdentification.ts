/**
 * User Identification Helper for Private Elections
 * Supports multiple identifier types for whitelisting
 */

export interface UserIdentifier {
  type: IdentifierType;
  value: string;
  display: string;
}

export enum IdentifierType {
  EMAIL = 0,
  TWITTER = 1,
  FARCASTER = 2,
  GITHUB = 3,
  WALLET = 4,
}

export const IDENTIFIER_TYPE_NAMES = {
  [IdentifierType.EMAIL]: "Email",
  [IdentifierType.TWITTER]: "Twitter",
  [IdentifierType.FARCASTER]: "Farcaster",
  [IdentifierType.GITHUB]: "GitHub",
  [IdentifierType.WALLET]: "Wallet Address",
};

export const IDENTIFIER_TYPE_PREFIXES = {
  [IdentifierType.EMAIL]: "",
  [IdentifierType.TWITTER]: "@",
  [IdentifierType.FARCASTER]: "@",
  [IdentifierType.GITHUB]: "@",
  [IdentifierType.WALLET]: "0x",
};

export const IDENTIFIER_TYPE_PLACEHOLDERS = {
  [IdentifierType.EMAIL]: "user@example.com",
  [IdentifierType.TWITTER]: "@username",
  [IdentifierType.FARCASTER]: "@username.farcaster",
  [IdentifierType.GITHUB]: "@username",
  [IdentifierType.WALLET]: "0x1234...abcd",
};

/**
 * Get user's current identifier from Web3Auth context
 */
export const getCurrentUserIdentifier = async (web3auth: any): Promise<UserIdentifier | null> => {
  try {
    if (!web3auth?.provider) return null;
    
    const userInfo = await web3auth.getUserInfo();
    console.log("🔍 Web3Auth userInfo raw:", userInfo);
    if (!userInfo) return null;

    // Determine identifier type based on login method
    const loginProvider = userInfo.typeOfLogin;
    console.log("🔍 Login provider detected:", loginProvider);
    console.log("🔍 Alternative groupedAuthConnectionId:", userInfo.groupedAuthConnectionId);
    
    // Check for Google login via multiple possible fields
    const isGoogleLogin = loginProvider === "google" || 
                         userInfo.groupedAuthConnectionId?.includes('google') ||
                         userInfo.verifier === "google" ||
                         userInfo.typeOfLogin === "google";
    
    if (isGoogleLogin && userInfo.email) {
      console.log("✅ Google login detected, extracting email:", userInfo.email);
      return {
        type: IdentifierType.EMAIL,
        value: userInfo.email,
        display: `${userInfo.email} (Google)`,
      };
    }
    
    switch (loginProvider) {
      case "google":
        console.log("✅ Google login via typeOfLogin, extracting email:", userInfo.email);
        return {
          type: IdentifierType.EMAIL,
          value: userInfo.email || "",
          display: `${userInfo.email} (Google)`,
        };
      
      case "twitter":
        return {
          type: IdentifierType.TWITTER,
          value: userInfo.name || userInfo.email || "",
          display: `@${userInfo.name || userInfo.email} (Twitter)`,
        };
      
      case "github":
        return {
          type: IdentifierType.GITHUB,
          value: userInfo.name || userInfo.email || "",
          display: `@${userInfo.name || userInfo.email} (GitHub)`,
        };
      
      default:
        console.log("⚠️ Unknown login provider, falling back to wallet address");
        // For other login methods, try to get wallet address
        const accounts = await web3auth.provider.request({ method: "eth_accounts" }) as string[];
        const walletAddress = accounts?.[0];
        console.log("🔍 Fallback wallet address:", walletAddress);
        
        if (walletAddress) {
          return {
            type: IdentifierType.WALLET,
            value: walletAddress,
            display: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} (Wallet)`,
          };
        }
        
        return null;
    }
  } catch (error) {
    console.error("Error getting user identifier:", error);
    return null;
  }
};

/**
 * Validate identifier format based on type
 */
export const validateIdentifier = (value: string, type: IdentifierType): boolean => {
  const trimmedValue = value.trim();
  
  switch (type) {
    case IdentifierType.EMAIL:
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(trimmedValue);
    
    case IdentifierType.TWITTER:
      // Twitter usernames can be 1-15 characters, alphanumeric and underscores
      const twitterRegex = /^@?[a-zA-Z0-9_]{1,15}$/;
      return twitterRegex.test(trimmedValue);
    
    case IdentifierType.FARCASTER:
      // Farcaster usernames (similar to Twitter but can have .farcaster suffix)
      const farcasterRegex = /^@?[a-zA-Z0-9_]{1,15}(\.farcaster)?$/;
      return farcasterRegex.test(trimmedValue);
    
    case IdentifierType.GITHUB:
      // GitHub usernames can be 1-39 characters, alphanumeric and hyphens
      const githubRegex = /^@?[a-zA-Z0-9-]{1,39}$/;
      return githubRegex.test(trimmedValue);
    
    case IdentifierType.WALLET:
      // Ethereum address format
      const walletRegex = /^0x[a-fA-F0-9]{40}$/;
      return walletRegex.test(trimmedValue);
    
    default:
      return false;
  }
};

/**
 * Normalize identifier value (remove prefixes, convert to lowercase where appropriate)
 */
export const normalizeIdentifier = (value: string, type: IdentifierType): string => {
  let normalized = value.trim();
  
  switch (type) {
    case IdentifierType.EMAIL:
      return normalized.toLowerCase();
    
    case IdentifierType.TWITTER:
    case IdentifierType.FARCASTER:
    case IdentifierType.GITHUB:
      // Remove @ prefix if present
      if (normalized.startsWith("@")) {
        normalized = normalized.slice(1);
      }
      return normalized.toLowerCase();
    
    case IdentifierType.WALLET:
      // Ensure proper 0x prefix and lowercase
      if (!normalized.startsWith("0x")) {
        normalized = "0x" + normalized;
      }
      return normalized.toLowerCase();
    
    default:
      return normalized;
  }
};

/**
 * Format identifier for display
 */
export const formatIdentifierForDisplay = (value: string, type: IdentifierType): string => {
  const normalized = normalizeIdentifier(value, type);
  const prefix = IDENTIFIER_TYPE_PREFIXES[type];
  
  switch (type) {
    case IdentifierType.WALLET:
      return `${normalized.slice(0, 6)}...${normalized.slice(-4)}`;
    default:
      return prefix + normalized;
  }
};

/**
 * Create whitelist entry for smart contract
 */
export interface WhitelistEntry {
  identifier: string;
  identifierType: number;
  isActive: boolean;
}

export const createWhitelistEntry = (value: string, type: IdentifierType): WhitelistEntry => {
  return {
    identifier: normalizeIdentifier(value, type),
    identifierType: type,
    isActive: true,
  };
};

/**
 * Parse whitelist entries from form input
 */
export const parseWhitelistEntries = (entries: Array<{ value: string; type: IdentifierType }>): WhitelistEntry[] => {
  return entries
    .filter(entry => entry.value.trim() && validateIdentifier(entry.value, entry.type))
    .map(entry => createWhitelistEntry(entry.value, entry.type));
};

