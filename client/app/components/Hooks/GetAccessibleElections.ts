import { ElectionFactory } from "@/abi/artifacts/ElectionFactory";
import { ELECTION_FACTORY_ADDRESS } from "@/app/constants";
import { sepolia } from "viem/chains";
import { useReadContract } from "wagmi";
import { useWeb3Auth } from "@/app/context/Web3AuthContext";
import { getCurrentUserIdentifier } from "@/app/helpers/userIdentification";
import { useEffect, useState } from "react";

export const useAccessibleElections = () => {
  const { web3auth, address, isAuthenticated } = useWeb3Auth();
  const [userIdentifier, setUserIdentifier] = useState<{value: string; type: number} | null>(null);

  // Get user identifier
  useEffect(() => {
    const fetchUserIdentifier = async () => {
      if (isAuthenticated && web3auth) {
        try {
          const identifier = await getCurrentUserIdentifier(web3auth);
          if (identifier) {
            setUserIdentifier({
              value: identifier.value,
              type: identifier.type
            });
          } else if (address) {
            // Fallback to wallet address
            setUserIdentifier({
              value: address,
              type: 4 // IdentifierType.WALLET
            });
          }
        } catch (error) {
          console.error("Error getting user identifier:", error);
          if (address) {
            // Fallback to wallet address
            setUserIdentifier({
              value: address,
              type: 4 // IdentifierType.WALLET
            });
          }
        }
      }
    };

    fetchUserIdentifier();
  }, [isAuthenticated, web3auth, address]);

  // Fetch accessible elections using the new smart contract function
  const { data: accessibleElections, isLoading: isLoadingAccessible } = useReadContract({
    chainId: sepolia.id,
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "getAccessibleElections" as any, // Type assertion since ABI doesn't include this yet
    args: userIdentifier ? [
      address || "0x0000000000000000000000000000000000000000",
      userIdentifier.value,
      userIdentifier.type
    ] : undefined,
    query: {
      enabled: !!userIdentifier && !!address
    }
  });

  // Fallback to open elections if user is not authenticated or accessible elections fail
  const { data: openElections, isLoading: isLoadingOpen } = useReadContract({
    chainId: sepolia.id,
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "getOpenElections",
    query: {
      enabled: !userIdentifier || !accessibleElections
    }
  });

  const elections = accessibleElections || openElections;
  const isLoading = isLoadingAccessible || isLoadingOpen;

  return { 
    elections, 
    isLoading, 
    userIdentifier,
    isAuthenticated 
  };
};

// Backward compatibility - hook that returns the same interface as useOpenElection
export const useOpenElection = () => {
  return useAccessibleElections();
};

