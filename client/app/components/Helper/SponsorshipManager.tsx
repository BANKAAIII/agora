"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Election } from "@/abi/artifacts/Election";
import { getElectionSponsorshipStatus } from "@/app/helpers/smartAccountV2";
import { parseEther, formatEther } from "viem";
import toast from "react-hot-toast";

interface SponsorshipManagerProps {
  electionAddress: string;
  isOwner: boolean;
}

const SponsorshipManager: React.FC<SponsorshipManagerProps> = ({
  electionAddress,
  isOwner,
}) => {
  const { writeContractAsync } = useWriteContract();
  const [sponsorshipAmount, setSponsorshipAmount] = useState<string>("0.05");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("0.01");
  const [isLoading, setIsLoading] = useState(false);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<{
    isSponsored: boolean;
    remainingBalance: string;
    totalVotesSponsored: number;
    message: string;
  } | null>(null);

  // Load sponsorship status
  useEffect(() => {
    const loadStatus = async () => {
      try {
        const status = await getElectionSponsorshipStatus(electionAddress);
        setSponsorshipStatus(status);
      } catch (error) {
        // Error loading sponsorship status
      }
    };

    loadStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, [electionAddress]);

  const addSponsorship = async () => {
    if (!isOwner) {
      toast.error("Only election owner can add sponsorship");
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseEther(sponsorshipAmount);
      
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "addSponsorship",
        value: amount,
      });

      toast.success(`Added ${sponsorshipAmount} ETH sponsorship!`);
      
      // Refresh status
      setTimeout(async () => {
        const status = await getElectionSponsorshipStatus(electionAddress);
        setSponsorshipStatus(status);
      }, 2000);

    } catch (error: any) {
      // Error adding sponsorship
      toast.error(error?.message || "Failed to add sponsorship");
    } finally {
      setIsLoading(false);
    }
  };

  const withdrawSponsorship = async () => {
    if (!isOwner) {
      toast.error("Only election owner can withdraw sponsorship");
      return;
    }

    setIsLoading(true);
    try {
      const amount = parseEther(withdrawAmount);
      
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "withdrawSponsorship",
        args: [amount],
      });

      toast.success(`Withdrew ${withdrawAmount} ETH!`);
      
      // Refresh status
      setTimeout(async () => {
        const status = await getElectionSponsorshipStatus(electionAddress);
        setSponsorshipStatus(status);
      }, 2000);

    } catch (error: any) {
      // Error withdrawing sponsorship
      toast.error(error?.message || "Failed to withdraw sponsorship");
    } finally {
      setIsLoading(false);
    }
  };

  const enableEmergencyWithdrawal = async () => {
    if (!isOwner) {
      toast.error("Only election owner can enable emergency withdrawal");
      return;
    }

    setIsLoading(true);
    try {
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "enableEmergencyWithdrawal",
      });

      toast.success("Emergency withdrawal enabled!");
    } catch (error: any) {
      // Error enabling emergency withdrawal
      toast.error(error?.message || "Failed to enable emergency withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  const emergencyWithdraw = async () => {
    if (!isOwner) {
      toast.error("Only election owner can perform emergency withdrawal");
      return;
    }

    setIsLoading(true);
    try {
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "emergencyWithdraw",
        args: ["Emergency withdrawal requested by owner"],
      });

      toast.success("Emergency withdrawal completed!");
      
      // Refresh status
      setTimeout(async () => {
        const status = await getElectionSponsorshipStatus(electionAddress);
        setSponsorshipStatus(status);
      }, 2000);

    } catch (error: any) {
      // Error performing emergency withdrawal
      toast.error(error?.message || "Failed to perform emergency withdrawal");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOwner) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Sponsorship Status</h3>
        {sponsorshipStatus && (
          <div className="space-y-2">
            <div className={`p-3 rounded ${
              sponsorshipStatus.isSponsored 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {sponsorshipStatus.message}
            </div>
            {sponsorshipStatus.isSponsored && (
              <div className="text-sm text-gray-600">
                <p>Remaining Balance: {sponsorshipStatus.remainingBalance} ETH</p>
                <p>Votes Sponsored: {sponsorshipStatus.totalVotesSponsored}</p>
                <p>Estimated Votes Remaining: {Math.floor(parseFloat(sponsorshipStatus.remainingBalance) / 0.001)}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Election Sponsorship Manager</h3>
      
      {/* Current Status */}
      {sponsorshipStatus && (
        <div className="mb-6">
          <h4 className="font-medium mb-2">Current Status</h4>
          <div className={`p-3 rounded mb-3 ${
            sponsorshipStatus.isSponsored 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {sponsorshipStatus.message}
          </div>
          {sponsorshipStatus.isSponsored && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Balance:</span> {sponsorshipStatus.remainingBalance} ETH
              </div>
              <div>
                <span className="font-medium">Votes Sponsored:</span> {sponsorshipStatus.totalVotesSponsored}
              </div>
              <div>
                <span className="font-medium">Cost per Vote:</span> 0.001 ETH
              </div>
              <div>
                <span className="font-medium">Votes Remaining:</span> {Math.floor(parseFloat(sponsorshipStatus.remainingBalance) / 0.001)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Sponsorship */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Add Sponsorship</h4>
        <div className="flex gap-3 items-center">
          <input
            type="number"
            step="0.001"
            min="0.01"
            value={sponsorshipAmount}
            onChange={(e) => setSponsorshipAmount(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
            placeholder="0.05"
          />
          <span className="text-sm text-gray-600">ETH</span>
          <button
            onClick={addSponsorship}
            disabled={isLoading || parseFloat(sponsorshipAmount) < 0.01}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 text-sm"
          >
            {isLoading ? "Adding..." : "Add Sponsorship"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Minimum: 0.01 ETH | Estimated votes: {Math.floor(parseFloat(sponsorshipAmount || "0") / 0.001)}
        </p>
      </div>

      {/* Withdraw Sponsorship */}
      {sponsorshipStatus?.isSponsored && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Withdraw Sponsorship</h4>
          <div className="flex gap-3 items-center">
            <input
              type="number"
              step="0.001"
              min="0.001"
              max={sponsorshipStatus.remainingBalance}
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
              placeholder="0.01"
            />
            <span className="text-sm text-gray-600">ETH</span>
            <button
              onClick={withdrawSponsorship}
              disabled={isLoading || parseFloat(withdrawAmount) > parseFloat(sponsorshipStatus.remainingBalance)}
              className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 text-sm"
            >
              {isLoading ? "Withdrawing..." : "Withdraw"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Available: {sponsorshipStatus.remainingBalance} ETH
          </p>
        </div>
      )}

      {/* Emergency Actions */}
      {sponsorshipStatus?.isSponsored && (
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 text-red-700">Emergency Actions</h4>
          <div className="space-y-2">
            <button
              onClick={enableEmergencyWithdrawal}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 text-sm mr-3"
            >
              {isLoading ? "Enabling..." : "Enable Emergency Mode"}
            </button>
            <button
              onClick={emergencyWithdraw}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 text-sm"
            >
              {isLoading ? "Withdrawing..." : "Emergency Withdraw All"}
            </button>
          </div>
          <p className="text-xs text-red-500 mt-2">
            Emergency withdrawal removes all sponsorship funds immediately
          </p>
        </div>
      )}
    </div>
  );
};

export default SponsorshipManager;