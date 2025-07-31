import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { Election } from "@/abi/artifacts/Election";
import { CCIP_FUJI_ADDRESS, SEPOLIA_CHAIN_SELECTOR } from "@/app/constants";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useElectionModal } from "@/app/hooks/ElectionModal";
import { useWeb3Auth } from "@/app/context/Web3AuthContext";
import { sendTransactionWithPaymaster, getElectionSponsorshipStatus } from "@/app/helpers/smartAccountV2";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";

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
  const { chain } = useAccount();
  const { isUsingSCW, smartAccount, isAuthenticated } = useWeb3Auth();
  const [isVoting, setIsVoting] = useState(false);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<{
    isSponsored: boolean;
    message: string;
    remainingBalance?: string;
    totalVotesSponsored?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

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
    // Vote array prepared
    setIsVoting(true);
    
    try {
      // For sponsored elections, use SMART ACCOUNT with PAYMASTER for TRUE gasless voting
      if (sponsorshipStatus?.isSponsored && isUsingSCW && smartAccount && isAuthenticated) {
        // Using Smart Account for gasless voting
        
        // Use smart account with paymaster for sponsored elections
        const { ethers } = await import("ethers");
        const iface = new ethers.utils.Interface(Election);
        const voteData = iface.encodeFunctionData("userVote", [voteArray]);
        
        // Send gasless transaction via paymaster
        await sendTransactionWithPaymaster(electionAddress, voteData, "0x0", electionAddress);
        
        toast.success("🎉 Vote casted (100% gasless)!");
        await refreshSponsorshipStatus();
        
      } else if (sponsorshipStatus?.isSponsored) {
        // Sponsored election but no smart account
        toast.error("Please login with Web3Auth for gasless voting!");
        return;
        
      } else if (isUsingSCW && smartAccount && isAuthenticated) {
        // Use smart account for NON-sponsored elections if available
        // Using Smart Account for non-sponsored voting
        
        const { ethers } = await import("ethers");
        const iface = new ethers.utils.Interface(Election);
        const voteData = iface.encodeFunctionData("userVote", [voteArray]);
        
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
            abi: Election,
            functionName: "userVote",
            args: [voteArray],
          });
        }
        toast.success("Vote casted!");
      }
      
      setelectionModal(false);
    } catch (error) {
      // Voting error occurred
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
