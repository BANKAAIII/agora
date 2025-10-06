import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { Election } from "@/abi/artifacts/Election";
import { ExtendedElectionABI } from "@/app/helpers/extendedElectionABI";
import { CCIP_FUJI_ADDRESS, SEPOLIA_CHAIN_SELECTOR } from "@/app/constants";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useElectionModal } from "@/app/hooks/ElectionModal";
import { useWeb3Auth } from "@/app/context/Web3AuthContext";
import { sendTransactionWithPaymaster, getElectionSponsorshipStatus } from "@/app/helpers/smartAccountV2";
import { getCurrentUserIdentifier } from "@/app/helpers/userIdentification";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";
import { encodeFunctionData } from "viem";
import { ethers } from "ethers";

const Vote = ({
  disabled,
  electionAddress,
  voteArray,
}: {
  disabled: boolean;
  electionAddress: any;
  voteArray: any;
}) => {
  const { setelectionModal } = useElectionModal();
  const { writeContractAsync } = useWriteContract();
  const { chain, address: wagmiAddress } = useAccount();
  const { isUsingSCW, smartAccount, isAuthenticated, web3auth, address: web3authAddress, isWeb3AuthReady } = useWeb3Auth();
  const [isVoting, setIsVoting] = useState(false);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<{
    isSponsored: boolean;
    message: string;
    remainingBalance?: string;
    totalVotesSponsored?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // User identification for private elections
  const [userIdentifier, setUserIdentifier] = useState<{
    value: string;
    type: number;
  } | null>(null);

  // Debug log when userIdentifier changes
  useEffect(() => {
    console.log("🔄 User identifier state changed:", userIdentifier);
  }, [userIdentifier]);

  // Debug log when Web3Auth context changes
  useEffect(() => {
      console.log("🔄 Web3Auth context changed:", {
        isAuthenticated,
        hasWeb3auth: !!web3auth,
        web3authType: typeof web3auth,
        web3authValue: web3auth,
        hasProvider: !!web3auth?.provider,
        isUsingSCW,
        web3authAddress,
        wagmiAddress
      });
    }, [isAuthenticated, isWeb3AuthReady, web3auth, isUsingSCW, web3authAddress, wagmiAddress]);

  // Get user identification for private elections
  useEffect(() => {
    const fetchUserIdentifier = async () => {
      console.log("🔍 ===== USER IDENTIFIER FETCH START =====");
      const currentAddress = web3authAddress || wagmiAddress;
      console.log("🔐 Authentication State:", {
        isAuthenticated,
        isWeb3AuthReady,
        hasWeb3auth: !!web3auth,
        hasWeb3authProvider: !!web3auth?.provider,
        web3authAddress,
        wagmiAddress,
        currentAddress,
        isUsingSCW
      });
      
      // Don't reset if we already have a valid identifier
      if (userIdentifier) {
        console.log("✅ Already have user identifier, skipping fetch:", userIdentifier);
        return;
      }
      
      if (isAuthenticated && isWeb3AuthReady && web3auth && web3auth.provider) {
        console.log("📋 Trying to get user identifier from Web3Auth...");
        try {
          const identifier = await getCurrentUserIdentifier(web3auth);
          console.log("✅ Web3Auth identifier result:", identifier);
          
          if (identifier) {
            console.log("🎯 Setting user identifier from Web3Auth social login:", {
              value: identifier.value,
              type: identifier.type,
              display: identifier.display
            });
            // PRIORITY: Use social login identity (email, twitter, etc.) for whitelist matching
            setUserIdentifier({
              value: identifier.value,
              type: identifier.type
            });
          } else if (currentAddress) {
            console.log("⚠️ No Web3Auth social identifier, falling back to wallet address:", currentAddress);
            // Fallback to wallet address (smart account or regular wallet)
            setUserIdentifier({
              value: currentAddress,
              type: 4 // IdentifierType.WALLET
            });
          } else {
            console.log("❌ No identifier found and no wallet address available");
          }
        } catch (error) {
          console.error("❌ Error getting user identifier:", error);
          if (currentAddress) {
            console.log("🔄 Error fallback - using wallet address:", currentAddress);
            // Fallback to wallet address
            setUserIdentifier({
              value: currentAddress,
              type: 4 // IdentifierType.WALLET
            });
          } else {
            console.log("❌ Error and no wallet address available");
          }
        }
      } else if (isAuthenticated && !web3auth) {
        console.log("⚠️ User is authenticated but Web3Auth object is missing!");
        console.log("🔧 This might be a context initialization issue");
        console.log("🚨 CRITICAL: Cannot get social login identifier without web3auth object!");
        console.log("📝 NOTE: Using smart account address, but this won't match social login whitelist entries");
        
        if (currentAddress) {
          console.log("🔄 Using smart account address as fallback:", currentAddress);
          console.log("⚠️ WARNING: This may fail whitelist check if user was whitelisted by email/social");
          setUserIdentifier({
            value: currentAddress,
            type: 4 // IdentifierType.WALLET
          });
        } else {
          console.log("❌ No wallet address available as fallback");
        }
      } else if (currentAddress) {
        console.log("🔗 User not authenticated with Web3Auth, using wallet address:", currentAddress);
        // User not authenticated with Web3Auth, use wallet address
        setUserIdentifier({
          value: currentAddress,
          type: 4 // IdentifierType.WALLET
        });
      } else {
        console.log("❌ No authentication and no wallet address");
      }
      
      console.log("🔍 ===== USER IDENTIFIER FETCH END =====");
    };

    // Add a small delay to ensure Web3Auth is fully initialized
    const timeout = setTimeout(fetchUserIdentifier, 100);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, isWeb3AuthReady, web3auth, web3authAddress, wagmiAddress, userIdentifier]);

  // Check sponsorship status when component mounts
  useEffect(() => {
    const checkSponsorship = async () => {
      if (electionAddress) {
        try {
          setLoading(true);
          const status = await getElectionSponsorshipStatus(electionAddress);
          setSponsorshipStatus({
            isSponsored: status.isSponsored,
            message: status.message,
            remainingBalance: status.remainingBalance,
            totalVotesSponsored: status.totalVotesSponsored,
          });
        } catch (error) {
          // Error checking sponsorship
          setSponsorshipStatus({
            isSponsored: false,
            message: "Error checking sponsorship status"
          });
        } finally {
          setLoading(false);
        }
      }
    };

    checkSponsorship();
  }, [electionAddress]);

  // Function to refresh sponsorship status (after voting)
  const refreshSponsorshipStatus = async () => {
    if (electionAddress) {
      try {
        const status = await getElectionSponsorshipStatus(electionAddress);
        setSponsorshipStatus({
          isSponsored: status.isSponsored,
          message: status.message,
          remainingBalance: status.remainingBalance,
          totalVotesSponsored: status.totalVotesSponsored,
        });
      } catch (error) {
        // Error refreshing sponsorship
      }
    }
  };

  const vote = async () => {
    console.log("🗳️ ===== VOTE FUNCTION START =====");
    console.log("🔐 Vote Authentication Check:", {
      isAuthenticated,
      isUsingSCW,
      hasSmartAccount: !!smartAccount,
      hasWeb3auth: !!web3auth,
      web3authAddress,
      wagmiAddress,
      currentAddress: web3authAddress || wagmiAddress,
      userIdentifier,
      hasUserIdentifier: !!userIdentifier,
      sponsorshipStatus
    });
    
    // Vote array prepared
    setIsVoting(true);
    
    // Check if user identification is available (required for private elections)
    if (!userIdentifier) {
      console.log("❌ No user identifier available - showing connect message");
      console.log("🔍 Debug info:", {
        userIdentifier,
        isAuthenticated,
        isWeb3AuthReady,
        web3authAddress,
        wagmiAddress,
        currentAddress: web3authAddress || wagmiAddress,
        hasWeb3auth: !!web3auth
      });
      
      // If Web3Auth is still initializing, show a different message
      if (isAuthenticated && !isWeb3AuthReady) {
        toast.error("Web3Auth is still initializing. Please wait a moment and try again.");
      } else {
        toast.error("Please connect your wallet or login to vote.");
      }
      setIsVoting(false);
      return;
    }
    
    console.log("✅ User identifier available, proceeding with vote:", userIdentifier);
    
    console.log("🗳️ Voting Debug Info:", {
      sponsorshipStatus,
      isUsingSCW,
      hasSmartAccount: !!smartAccount,
      isAuthenticated,
      electionAddress,
      voteArray,
      userIdentifier,
    });
    
    try {
      // For sponsored elections, use SMART ACCOUNT with PAYMASTER for TRUE gasless voting
      if (sponsorshipStatus?.isSponsored && isUsingSCW && smartAccount && isAuthenticated) {
        console.log("📡 Using Smart Account for gasless voting");
        console.log("🔧 Smart Account voting parameters:", {
          userIdentifierValue: userIdentifier?.value,
          userIdentifierType: userIdentifier?.type,
          voteArray,
          electionAddress,
          hasWeb3auth: !!web3auth,
          smartAccountType: smartAccount?.constructor?.name
        });
        
        // Use smart account with paymaster for sponsored elections
        const voteData = encodeFunctionData({
          abi: ExtendedElectionABI,
          functionName: "userVote",
          args: [
            voteArray,
            userIdentifier?.value || "",
            userIdentifier?.type ?? 4  // 🚨 FIX: Use ?? instead of || to handle type 0
          ]
        });
        
        console.log("🔍 VOTE ENCODING DEBUG:", {
          userIdentifierValue: userIdentifier?.value,
          userIdentifierType: userIdentifier?.type,
          userIdentifierTypeFinal: userIdentifier?.type ?? 4,
          isTypeZero: userIdentifier?.type === 0,
          reasonForFix: "Using ?? instead of || to handle identifierType 0 (email)"
        });
        
        console.log("🔧 Vote transaction data:", {
          target: electionAddress,
          data: voteData,
          dataLength: voteData.length,
          isSponsored: sponsorshipStatus?.isSponsored,
          voteDataPreview: voteData.substring(0, 100) + "..."
        });
        
        // Send gasless transaction via paymaster
        console.log("🔄 Sending gasless vote transaction...");
        try {
          const result = await sendTransactionWithPaymaster(electionAddress, voteData, "0x0", electionAddress, web3auth);
          console.log("✅ Gasless vote transaction result:", result);
          
          toast.success("🎉 Vote casted (100% gasless)!");
          await refreshSponsorshipStatus();
        } catch (smartAccountError) {
          console.error("❌ Smart Account gasless voting failed:", smartAccountError);
          console.error("🔍 Smart Account error details:", {
            message: smartAccountError.message,
            code: smartAccountError.code,
            data: smartAccountError.data,
            reason: smartAccountError.reason,
            stack: smartAccountError.stack,
            name: smartAccountError.name
          });
          toast.error(`Gasless voting failed: ${(smartAccountError as any)?.message || 'Unknown error'}`);
          
          // 🧪 DEBUGGING: Try direct contract call as fallback
          console.log("🔧 Attempting direct contract call fallback...");
          
        if (web3auth?.provider) {
          try {
            const { providers, Contract } = await import("ethers");
            const ethersProvider = new providers.Web3Provider(web3auth.provider);
            const signer = ethersProvider.getSigner();
              
            // Create contract instance  
            const contract = new Contract(electionAddress, ExtendedElectionABI, signer);
              
              console.log("📝 Direct call parameters:", {
                voteArray,
                userIdentifier: userIdentifier?.value,
                identifierType: userIdentifier?.type,
                signerAddress: await signer.getAddress()
              });
              
              // Direct contract call (user pays gas)
              const tx = await contract.userVote(
                voteArray,
                userIdentifier?.value || "",
                userIdentifier?.type ?? 4
              );
              
              console.log("✅ Direct call successful, waiting for confirmation...");
              await tx.wait();
              toast.success("🎉 Vote casted via direct Web3Auth transaction!");
              await refreshSponsorshipStatus();
              return; // Exit successfully
            } catch (directCallError) {
              console.log("❌ Direct call also failed:", directCallError);
              console.error("🔍 Direct call error details:", {
                message: directCallError.message,
                code: directCallError.code,
                data: directCallError.data,
                reason: directCallError.reason
              });
            }
          }
          throw smartAccountError;
        }
        
      } else if (sponsorshipStatus?.isSponsored) {
        // Sponsored election but no smart account
        toast.error("Please login with Web3Auth for gasless voting!");
        return;
        
      } else if (isUsingSCW && smartAccount && isAuthenticated) {
        // Use smart account for NON-sponsored elections if available
        console.log("📡 Using Smart Account for non-sponsored voting");
        console.log("🔧 Smart Account voting parameters:", {
          userIdentifierValue: userIdentifier?.value,
          userIdentifierType: userIdentifier?.type,
          voteArray,
          electionAddress,
          hasWeb3auth: !!web3auth,
          isAuthenticated
        });
        
        // Use viem for encoding (same as sponsored path)
        const voteData = encodeFunctionData({
          abi: ExtendedElectionABI,
          functionName: "userVote",
          args: [
            voteArray,
            userIdentifier?.value || "",
            userIdentifier?.type ?? 4
          ]
        });
        
        console.log("🔧 Vote transaction data:", {
          target: electionAddress,
          data: voteData,
          dataLength: voteData.length,
          isSponsored: false,
          voteDataPreview: `${voteData.slice(0, 50)}...${voteData.slice(-50)}`
        });
        
        console.log("🔄 Sending non-sponsored vote transaction...");
        await sendTransactionWithPaymaster(electionAddress, voteData, "0x0");
        toast.success("Vote casted via Smart Account!");
        
      } else {
        // Fallback to regular wallet
        // Using regular wallet for voting
        
        if (chain?.id === 43113) {
          await writeContractAsync({
            address: CCIP_FUJI_ADDRESS,
            abi: CCIPSender,
            functionName: "sendMessage",
            args: [SEPOLIA_CHAIN_SELECTOR, electionAddress, voteArray],
          });
        } else {
          await writeContractAsync({
            address: electionAddress,
            abi: ExtendedElectionABI as any,
            functionName: "userVote",
            args: [voteArray, userIdentifier?.value || "", userIdentifier?.type ?? 4],
          });
        }
        toast.success("Vote casted!");
      }
      
      setelectionModal(false);
    } catch (error) {
      // Voting error occurred
      console.error("❌ ===== VOTING ERROR =====");
      console.error("🔍 Error details:", {
        message: error.message,
        code: error.code,
        data: error.data,
        reason: error.reason,
        stack: error.stack,
        name: error.name,
        fullError: error
      });
      console.error("🔍 Context at failure:", {
        userIdentifier,
        electionAddress,
        voteArray,
        sponsorshipStatus,
        isUsingSCW,
        hasSmartAccount: !!smartAccount,
        isAuthenticated,
        hasWeb3auth: !!web3auth
      });
      toast.error(ErrorMessage(error));
    } finally {
      setIsVoting(false);
    }
  };
  return (
    <div className="space-y-2">
      {/* Loading State */}
      {loading && (
        <div className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
          Checking sponsorship status...
        </div>
      )}
      
      {/* Sponsorship Status */}
      {!loading && sponsorshipStatus && (
        <div className={`text-xs px-2 py-1 rounded ${
          sponsorshipStatus.isSponsored 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          <div>{sponsorshipStatus.message}</div>
          {sponsorshipStatus.isSponsored && sponsorshipStatus.remainingBalance && (
            <div className="text-xs opacity-75 mt-1">
              Balance: {parseFloat(sponsorshipStatus.remainingBalance).toFixed(4)} ETH
              {sponsorshipStatus.totalVotesSponsored && (
                <span> | Votes sponsored: {sponsorshipStatus.totalVotesSponsored}</span>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Smart Account Info */}
      {isUsingSCW && isAuthenticated && (
        <div className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
          {sponsorshipStatus?.isSponsored 
            ? "🎉 Smart Account Ready - 100% Gasless Voting!" 
            : "🔥 Smart Account Active (You pay gas)"
          }
        </div>
      )}
      
      {/* Web3Auth Required for Gasless */}
      {sponsorshipStatus?.isSponsored && !isUsingSCW && (
        <div className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
          ⚠️ Login with Web3Auth for gasless voting
        </div>
      )}
      
      {/* Not authenticated with Web3Auth but election is sponsored */}
      {sponsorshipStatus?.isSponsored && isUsingSCW && !isAuthenticated && (
        <div className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
          ⚠️ Connect Web3Auth for gasless voting
        </div>
      )}
      
      {/* Gas Fee Info for regular wallets */}
      {!isUsingSCW && sponsorshipStatus && !sponsorshipStatus.isSponsored && (
        <div className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800">
          ⛽ You will pay gas fees (~0.002 ETH)
        </div>
      )}
      
      {/* Vote Button */}
      <button
        disabled={disabled || isVoting || loading}
        onClick={vote}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium disabled:bg-gray-400 text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 ${
          sponsorshipStatus?.isSponsored && isUsingSCW && isAuthenticated
            ? 'bg-green-600 hover:bg-green-700' // Gasless ready
            : sponsorshipStatus?.isSponsored
            ? 'bg-orange-500 hover:bg-orange-600' // Need Web3Auth
            : 'bg-blue-700 hover:bg-blue-800' // Regular voting
        }`}
      >
        {isVoting 
          ? "Voting..." 
          : sponsorshipStatus?.isSponsored
            ? (isUsingSCW && isAuthenticated 
               ? "🎉 Vote (100% Gasless)"
               : "⚠️ Login with Web3Auth for Gasless")
            : "Vote"
        }
      </button>
    </div>
  );
};

export default Vote;

