"use client";
import React, { FormEvent, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { ELECTION_FACTORY_ADDRESS } from "../constants";
import { ElectionFactory } from "../../abi/artifacts/ElectionFactory";
import { ExtendedElectionFactoryABI } from "../helpers/extendedElectionFactoryABI";
import { useWeb3Auth } from "../context/Web3AuthContext";
import { sendTransactionWithPaymaster } from "../helpers/smartAccountV2";
import { ballotTypeMap } from "../helpers/votingInfo";
import { DatePicker } from "rsuite";
import { ErrorMessage } from "../helpers/ErrorMessage";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { sepolia } from "@/app/config/chains";
import { ArrowPathIcon , PlusIcon, TrashIcon} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import ElectionInfoPopup from "../components/Modal/ElectionInfoPopup";
import { parseEther, formatEther } from "viem";
import { ethers } from "ethers";
import WhitelistManager from "../components/Modal/WhitelistManager";
import { WhitelistEntry } from "../helpers/userIdentification";

const CreatePage: React.FC = () => {
  const router = useRouter();
  const [selectedBallot, setSelectedBallot] = useState<number>(1);
  const { switchChain } = useSwitchChain();
  const { chain, address: wagmiAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { isAuthenticated, isUsingSCW, smartAccount, web3auth, address: web3authAddress } = useWeb3Auth();
  const [startTime, setStartTime] = useState<Date | null>(new Date(Date.now() + 10 * 60 * 1000)); // 10 minutes from now
  const [endTime, setEndTime] = useState<Date | null>(new Date(Date.now() + 24 * 60 * 60 * 1000)); // 24 hours from now
  const [candidates,setCandidates] = useState<Candidate[]>([])
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorshipAmount, setSponsorshipAmount] = useState("0.01");
  const [estimatedGasCost, setEstimatedGasCost] = useState("0.005");
  
  // Private election state
  const [isPrivate, setIsPrivate] = useState(false);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  
  const changeChain = async () => {
    try {
      await switchChain({ chainId: sepolia.id });
    } catch (error: any) {
      console.error("Chain switch error:", error);
      toast.error(`Failed to switch chain: ${error.message || "Please try again."}`);
    }
  }
  interface Candidate {
    name: string;
    description: string;
  }
  const addCandidate = () => {
    setCandidates([...candidates, { name: "", description: "" }]);
  };
  
  const removeCandidate = (index: number) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };
  
  const updateCandidate = (index: number, field: keyof Candidate, value: string) => {
    const newCandidates = candidates.map((candidate, i) => {
      if (i === index) {
        return { ...candidate, [field]: value };
      }
      return candidate;
    });
    setCandidates(newCandidates);
  };
  const createElection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    console.log("🚀 ===== ELECTION CREATION START =====");
    console.log("📋 Form Data:", Object.fromEntries(formData.entries()));
    
    // Extract form data first
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ballotType = BigInt(selectedBallot);
    
    // Debug Web3Auth state
    console.log("🔐 Web3Auth Debug:", {
      isAuthenticated,
      isUsingSCW,
      hasSmartAccount: !!smartAccount,
      smartAccountType: smartAccount?.constructor?.name,
    });
    
    console.log("📊 Election Configuration:", {
      name,
      description,
      candidates: candidates.length,
      isPrivate,
      isSponsored,
      sponsorshipAmount,
      whitelist: whitelist.length,
      ballotType: ballotType.toString(),
      resultType: ballotType.toString()
    });

    console.log("🔍 Starting validation checks...");
    
    if (candidates.length<2){
      console.log("❌ Validation failed: Not enough candidates");
      toast.error("At least 2 candidates are required!");
      return;
    }
    
    console.log("✅ Candidate count validation passed");

    if (!startTime || !endTime) {
      console.log("❌ Validation failed: Missing time selection");
      toast.error("Please select both start and end times.");
      return;
    }

    const start = BigInt(Math.floor(startTime.getTime() / 1000));
    const end = BigInt(Math.floor(endTime.getTime() / 1000));
    
    console.log("⏰ Time validation:", {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      startTimestamp: start.toString(),
      endTimestamp: end.toString()
    });
    
    // Validate timestamps
    if (start >= end) {
      console.log("❌ Validation failed: Invalid time range");
      toast.error("Invalid timing. End time must be after start time.");
      return;
    }
    
    console.log("✅ Time validation passed");
    
    // Check if timestamps are reasonable (not too far in future)
    const now = Math.floor(Date.now() / 1000);
    const oneYearFromNow = now + (365 * 24 * 60 * 60); // 1 year in seconds
    
    if (Number(start) > oneYearFromNow) {
      toast.error("Start time is too far in the future (max 1 year)");
      return;
    }
    if(candidates.length>0  && candidates.some(candidate=>!candidate.name || !candidate.description)){
      toast.error("please enter all candidate information or remove empty candidates.")
      return 
    }
    
    console.log("🔒 Privacy and sponsorship validation:", {
      isPrivate,
      isSponsored,
      whitelistCount: whitelist.length,
      whitelistEntries: whitelist
    });
    
    // Sponsorship is only available for private elections
    if (isSponsored && !isPrivate) {
      console.log("❌ Validation failed: Sponsorship for public election");
      toast.error("Sponsorship is only available for private elections. Please make the election private first.");
      return;
    }

    // Private elections are now available with the new contract deployment!
    
    // Private elections need at least one whitelist entry
    if (isPrivate && whitelist.length === 0) {
      console.log("❌ Validation failed: Private election without whitelist");
      toast.error("Private elections require at least one whitelist entry.");
      return;
    }
    
    console.log("✅ Privacy and sponsorship validation passed");
    
    console.log("💰 Calculating sponsorship value...");
    // Sponsorship value only if explicitly selected
    const value = isSponsored ? parseEther(sponsorshipAmount) : BigInt(0);
    
  // passed candidates to the create election function 
    try {
      
      console.log("💸 Sponsorship details:", {
        isSponsored,
        sponsorshipAmount,
        value: value.toString(),
        valueInEth: formatEther(value)
      });
      
      // Check if Web3Auth Smart Account is available and user is authenticated
      if (isAuthenticated && isUsingSCW && smartAccount) {
        // Use Web3Auth Smart Account - this will use Pimlico automatically
        console.log("🔐 Using Web3Auth Smart Account for election creation");
        
        // Encode function data using ethers
        const { ethers } = await import("ethers");
        const iface = new ethers.utils.Interface(ExtendedElectionFactoryABI as any);
        
        console.log("📋 Transaction parameters:", {
          contractAddress: ELECTION_FACTORY_ADDRESS,
          startTime: start.toString(),
          endTime: end.toString(),
          candidates: candidates.length,
          ballotType: ballotType.toString(),
          isSponsored,
          sponsorshipAmount,
          value: value.toString(),
          isPrivate,
          whitelistCount: whitelist.length
        });
        
        console.log("🏗️ Detailed parameters:", {
          electionInfo: {
            startTime: start,
            endTime: end,
            name,
            description,
            isPrivate
          },
          candidates: candidates.map((c, i) => ({
            index: i,
            candidateID: BigInt(i),
            name: c.name,
            description: c.description
          })),
          ballotType: ballotType.toString(),
          resultType: ballotType.toString(),
          whitelist: whitelist.map((w, i) => ({
            index: i,
            identifier: w.identifier,
            identifierType: w.identifierType,
            isActive: w.isActive
          }))
        });
        
        console.log("🎯 Function selection logic:", {
          isPrivate,
          isSponsored,
          sponsorshipAmount,
          shouldUsePrivate: isPrivate,
          shouldUseSponsored: isSponsored && parseFloat(sponsorshipAmount) > 0
        });
        
        if (isPrivate || (isSponsored && parseFloat(sponsorshipAmount) > 0)) {
          const functionName = isPrivate ? "createPrivateElection" : "createElectionWithSponsorship";
          
          console.log("🔧 Selected function:", functionName);
          
          const args = isPrivate 
            ? [
                { startTime: start, endTime: end, name, description, isPrivate: true },
                candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                ballotType,
                ballotType, // resultType - using same as ballotType for now
                whitelist,
              ]
            : [
                { startTime: start, endTime: end, name, description },
                candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                ballotType,
                ballotType, // resultType - using same as ballotType for now
              ];
          
          if (isPrivate) {
            console.log("🔍 ORIGINAL WHITELIST DEBUGGING:");
            console.log("  Original whitelist entries:", whitelist.length);
            whitelist.forEach((entry, index) => {
              console.log(`  Entry ${index}:`, {
                identifier: entry.identifier,
                identifierType: entry.identifierType,
                isActive: entry.isActive
              });
            });
            
            // ✨ AUTO-ADD USER'S WALLET ADDRESSES TO WHITELIST
            console.log("🔧 Auto-adding user wallet addresses to whitelist...");
            const enhancedWhitelist = [...whitelist];
            
            // 🎯 CRITICAL: Add ALL possible Web3Auth addresses that could be used during voting
            const possibleAddresses = new Set();
            
            // Add Web3Auth address if available
            if (web3authAddress) {
              console.log("➕ Adding Web3Auth address:", web3authAddress);
              possibleAddresses.add(web3authAddress.toLowerCase());
              enhancedWhitelist.push({
                identifier: web3authAddress,
                identifierType: 4, // Wallet address type
                isActive: true
              });
            }
            
            // Add Wagmi address if different from Web3Auth
            if (wagmiAddress && wagmiAddress.toLowerCase() !== web3authAddress?.toLowerCase()) {
              console.log("➕ Adding Wagmi address:", wagmiAddress);
              possibleAddresses.add(wagmiAddress.toLowerCase());
              enhancedWhitelist.push({
                identifier: wagmiAddress,
                identifierType: 4, // Wallet address type
                isActive: true
              });
            }
            
            // Add smart account address if available and different
            if (smartAccount?.address && 
                !possibleAddresses.has(smartAccount.address.toLowerCase())) {
              console.log("➕ Adding Smart Account address:", smartAccount.address);
              possibleAddresses.add(smartAccount.address.toLowerCase());
              enhancedWhitelist.push({
                identifier: smartAccount.address,
                identifierType: 4, // Wallet address type
                isActive: true
              });
            }
            
            console.log("🔍 ENHANCED WHITELIST DEBUGGING:");
            console.log("  Enhanced whitelist entries:", enhancedWhitelist.length);
            enhancedWhitelist.forEach((entry, index) => {
              console.log(`  Enhanced Entry ${index}:`, {
                identifier: entry.identifier,
                identifierType: entry.identifierType,
                isActive: entry.isActive
              });
            });
            
            // Update the args to use the enhanced whitelist
            args[4] = enhancedWhitelist;
            
            console.log("🔍 ELECTION INFO DEBUGGING:");
            console.log("  isPrivate:", true);
            console.log("  name:", name);
            console.log("  description:", description);
          }
          
          console.log("📦 Function arguments:", {
            functionName,
            argsCount: args.length,
            args: args.map((arg, i) => ({
              index: i,
              type: typeof arg,
              isArray: Array.isArray(arg),
              length: Array.isArray(arg) ? arg.length : 'N/A',
              content: Array.isArray(arg) ? arg.slice(0, 3) : arg // Show first 3 items for arrays
            }))
          });
          
          console.log("🔨 Encoding function data...");
          const data = iface.encodeFunctionData(functionName, args);
          
          console.log("📡 Encoded transaction data:", {
            functionName,
            dataLength: data.length,
            dataPreview: data.substring(0, 100) + "...",
            fullData: data
          });
          
          try {
            console.log("🚀 Sending transaction with paymaster...");
            console.log("📤 Transaction details:", {
              to: ELECTION_FACTORY_ADDRESS,
              dataLength: data.length,
              value: value.toString(),
              valueInEth: formatEther(value)
            });
            
            await sendTransactionWithPaymaster(
              ELECTION_FACTORY_ADDRESS,
              data,
              value.toString(),
              ELECTION_FACTORY_ADDRESS, // election address for sponsorship check
              web3auth
            );
          } catch (smartAccountError: any) {
            console.error("❌ Smart Account transaction failed:", smartAccountError);
            console.error("🔍 Error details:", {
              message: smartAccountError?.message,
              code: smartAccountError?.code,
              data: smartAccountError?.data,
              reason: smartAccountError?.reason,
              stack: smartAccountError?.stack
            });
            
            console.log("🔄 Attempting fallback to regular transaction...");
            // Fallback to regular transaction
            if (isPrivate) {
              console.log("🔒 Private election fallback - using createPrivateElection with regular transaction");
              
              // Also enhance whitelist for fallback case
              let fallbackWhitelist = [...whitelist];
              
              // Add Web3Auth address if available and not already in list
              if (web3authAddress && !fallbackWhitelist.some(w => w.identifier.toLowerCase() === web3authAddress.toLowerCase())) {
                console.log("➕ Fallback: Adding Web3Auth address:", web3authAddress);
                fallbackWhitelist.push({
                  identifier: web3authAddress,
                  identifierType: 4,
                  isActive: true
                });
              }
              
              // Add Wagmi address if different and not already in list
              if (wagmiAddress && !fallbackWhitelist.some(w => w.identifier.toLowerCase() === wagmiAddress.toLowerCase())) {
                console.log("➕ Fallback: Adding Wagmi address:", wagmiAddress);
                fallbackWhitelist.push({
                  identifier: wagmiAddress,
                  identifierType: 4,
                  isActive: true
                });
              }
              
              // Add smart account address if available and different
              if (smartAccount?.address && !fallbackWhitelist.some(w => w.identifier.toLowerCase() === smartAccount.address.toLowerCase())) {
                console.log("➕ Fallback: Adding Smart Account address:", smartAccount.address);
                fallbackWhitelist.push({
                  identifier: smartAccount.address,
                  identifierType: 4,
                  isActive: true
                });
              }
              
              await (writeContractAsync as any)({
                address: ELECTION_FACTORY_ADDRESS,
                abi: ExtendedElectionFactoryABI,
                functionName: "createPrivateElection",
                args: [
                  { startTime: start, endTime: end, name, description, isPrivate: true },
                  candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                  ballotType,
                  ballotType, // resultType - using same as ballotType for now
                  fallbackWhitelist,
                ],
                value: value,
              });
            } else {
              console.log("🌐 Public election fallback - using createElectionWithSponsorship");
              await writeContractAsync({
                address: ELECTION_FACTORY_ADDRESS,
                abi: ElectionFactory,
                functionName: "createElectionWithSponsorship",
                args: [
                  { startTime: start, endTime: end, name, description, isPrivate: false },
                  candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                  ballotType,
                  ballotType, // resultType - using same as ballotType for now
                ],
                value: value,
              });
            }
          }
        } else {
          const data = iface.encodeFunctionData("createElection", [
            { startTime: start, endTime: end, name, description, isPrivate: false },
            candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
            ballotType,
            ballotType, // resultType - using same as ballotType for now
          ]);
          
          try {
            await sendTransactionWithPaymaster(
              ELECTION_FACTORY_ADDRESS,
              data,
              "0x0",
              ELECTION_FACTORY_ADDRESS, // election address for sponsorship check
              web3auth
            );
          } catch (smartAccountError) {
            console.error("Smart Account transaction failed, trying regular transaction:", smartAccountError);
            // Fallback to regular transaction
            await writeContractAsync({
              address: ELECTION_FACTORY_ADDRESS,
              abi: ElectionFactory,
              functionName: "createElection",
              args: [
                { startTime: start, endTime: end, name, description, isPrivate: false },
                candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                ballotType,
                ballotType, // resultType - using same as ballotType for now
              ],
            });
          }
        }
        console.log("🎉 Smart Account transaction successful!");
        const electionType = isPrivate ? "Private" : "Public";
        console.log(`✅ ${electionType} election created successfully using Web3Auth Smart Account!`);
        
        // Add verification logging for private elections
        if (isPrivate) {
          console.log("🔍 VERIFYING WHITELIST STORAGE...");
          console.log("⏳ Election creation successful, now we should verify the whitelist was stored correctly");
          console.log("📝 Next steps: Test voting with the whitelisted email to confirm storage worked");
        }
        
        toast.success(`${electionType} election created successfully using Web3Auth Smart Account!`);
      } else {
        // Fallback to regular wagmi transaction
        console.log("Using regular wagmi transaction for election creation");
        
        if (isPrivate || (isSponsored && parseFloat(sponsorshipAmount) > 0)) {
          if (isPrivate) {
            // Also enhance whitelist for wagmi fallback case
            let wagmiWhitelist = [...whitelist];
            
            // Add Web3Auth address if available and not already in list
            if (web3authAddress && !wagmiWhitelist.some(w => w.identifier.toLowerCase() === web3authAddress.toLowerCase())) {
              console.log("➕ Wagmi: Adding Web3Auth address:", web3authAddress);
              wagmiWhitelist.push({
                identifier: web3authAddress,
                identifierType: 4,
                isActive: true
              });
            }
            
            // Add Wagmi address if different and not already in list
            if (wagmiAddress && !wagmiWhitelist.some(w => w.identifier.toLowerCase() === wagmiAddress.toLowerCase())) {
              console.log("➕ Wagmi: Adding Wagmi address:", wagmiAddress);
              wagmiWhitelist.push({
                identifier: wagmiAddress,
                identifierType: 4,
                isActive: true
              });
            }
            
            // Add smart account address if available and different
            if (smartAccount?.address && !wagmiWhitelist.some(w => w.identifier.toLowerCase() === smartAccount.address.toLowerCase())) {
              console.log("➕ Wagmi: Adding Smart Account address:", smartAccount.address);
              wagmiWhitelist.push({
                identifier: smartAccount.address,
                identifierType: 4,
                isActive: true
              });
            }
            
            await (writeContractAsync as any)({
              address: ELECTION_FACTORY_ADDRESS,
              abi: ExtendedElectionFactoryABI,
              functionName: "createPrivateElection",
              args: [
                { startTime: start, endTime: end, name, description, isPrivate: true },
                candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                ballotType,
                ballotType, // resultType - using same as ballotType for now
                wagmiWhitelist,
              ],
              value: value,
            });
          } else {
            await writeContractAsync({
              address: ELECTION_FACTORY_ADDRESS,
              abi: ElectionFactory,
              functionName: "createElectionWithSponsorship",
              args: [
                { startTime: start, endTime: end, name, description, isPrivate: false },
                candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
                ballotType,
                ballotType, // resultType - using same as ballotType for now
              ],
              value: value,
            });
          }
        } else {
          await writeContractAsync({
            address: ELECTION_FACTORY_ADDRESS,
            abi: ElectionFactory,
            functionName: "createElection",
            args: [
              { startTime: start, endTime: end, name, description, isPrivate: false },
              candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })),
              ballotType,
              ballotType, // resultType - using same as ballotType for now
            ],
          });
        }
        console.log("🎉 Regular transaction successful!");
        const electionType = isPrivate ? "Private" : "Public";
        console.log(`✅ ${electionType} election created successfully!`);
        toast.success(`${electionType} election created successfully!`);
      }
      
      router.push("/");
    } catch (error: any) {
      console.error("❌ ===== ELECTION CREATION FAILED =====");
      console.error("🔍 Full error details:", {
        message: error?.message,
        code: error?.code,
        data: error?.data,
        reason: error?.reason,
        stack: error?.stack,
        name: error.name
      });
      console.error("📊 Context at failure:", {
        isPrivate,
        isSponsored,
        whitelistCount: whitelist.length,
        candidatesCount: candidates.length,
        value: value.toString()
      });
      toast.error(ErrorMessage(error));
    }
  };

  const handleBallotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBallot(Number(event.target.value));
  };

  return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="h-screen w-full bg-gradient-to-br pt-[50px] from-gray-100 to-gray-200 flex flex-col items-center justify-start p-4 overflow-y-auto"
  >
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-8 my-12"
    >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Create New Election
        </h2>
        <form onSubmit={createElection} className="space-y-6">
          <InputField
            name="name"
            label="Election Name"
            placeholder="Enter election name"
          />
          <TextareaField
            name="description"
            label="Description"
            placeholder="Describe the election"
          />
          {/* candidate section  shows placeholder if empty candidate and allows to add cnadidates*/ }
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
              <motion.button
                type="button"
                onClick={addCandidate}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Candidate
              </motion.button>
            </div>
            
            {candidates.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-4">
                No candidates added yet. Click "Add Candidate" to begin adding candidates.
              </p>
            ) : (
              candidates.map((candidate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-700">
                      Candidate {index + 1}
                    </h4>
                    <motion.button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-600 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => updateCandidate(index, "name", e.target.value)}
                    placeholder="Candidate Name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <textarea
                    value={candidate.description}
                    onChange={(e) => updateCandidate(index, "description", e.target.value)}
                    placeholder="Candidate Description"
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </motion.div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Voting Type
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={selectedBallot}
                onChange={handleBallotChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {Object.entries(ballotTypeMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} Voting
                  </option>
                ))}
              </select>
              <ElectionInfoPopup id={selectedBallot} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              value={startTime}
              onChange={(value) => setStartTime(value)}
              label="Start Date"
            />
            <DatePickerField
              value={endTime}
              onChange={(value) => setEndTime(value)}
              label="End Date"
            />
          </div>

          {/* Privacy Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="privateElection"
                checked={isPrivate}
                onChange={(e) => {
                  setIsPrivate(e.target.checked);
                  if (!e.target.checked) {
                    setIsSponsored(false); // Sponsorship only available for private elections
                  }
                }}
                disabled={false}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="privateElection" className="text-sm font-medium text-gray-700">
                Make this election private (restrict access to whitelisted users)
                <span className="block text-xs text-green-600">✅ Private elections now available!</span>
              </label>
            </div>
            
            {isPrivate && (
              <div className="pl-7 space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Private elections must have at least one whitelist entry.</strong> You can optionally sponsor the election to cover gas fees for voters.
                      </p>
                    </div>
                  </div>
                </div>
                
                <WhitelistManager
                  whitelist={whitelist}
                  onChange={setWhitelist}
                />
              </div>
            )}
          </div>

          {/* Sponsorship Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sponsorElection"
                checked={isSponsored}
                onChange={(e) => setIsSponsored(e.target.checked)}
                disabled={!isPrivate}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
              />
              <label htmlFor="sponsorElection" className={`text-sm font-medium ${!isPrivate ? 'text-gray-400' : 'text-gray-700'}`}>
                Sponsor this election (I'll pay gas fees for voters)
                {!isPrivate && <span className="text-xs text-gray-500 block">Only available for private elections</span>}
              </label>
            </div>
            
            {isSponsored && (
              <div className="space-y-3 pl-7">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sponsorship Amount (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    value={sponsorshipAmount}
                    onChange={(e) => setSponsorshipAmount(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="0.01"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Estimated gas cost per vote: ~{estimatedGasCost} ETH
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        <strong>Voters won't pay gas fees!</strong> You'll cover all transaction costs for this election.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Election
          </motion.button>
        </form>
      </motion.div>
      {chain?.id !== sepolia.id && <ChainSwitchModal onSwitch={changeChain} />}
      <Toaster />
    </motion.div>
  );
};

interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
}) => (
  <motion.div
    className="space-y-1"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
  >
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder={placeholder}
      required
    />
  </motion.div>
);

const TextareaField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
}) => (
  <motion.div
    className="space-y-1"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.5 }}
  >
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={4}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder={placeholder}
      required
    ></textarea>
  </motion.div>
);

interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  label,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <DatePicker
      value={value}
      placement="topStart"
      onChange={onChange}
      format="yyyy-MM-dd HH:mm"
      className="block w-full"
      caretAs={CalendarIcon}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "0.375rem",
        padding: "0.5rem",
      }}
    />
  </div>
);

interface ChainSwitchModalProps {
  onSwitch: () => void;
}

const ChainSwitchModal: React.FC<ChainSwitchModalProps> = ({ onSwitch }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed z-20 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white rounded-lg p-8 shadow-xl text-center"
    >
      <p className="text-xl mb-4 text-gray-800">
        Creating Elections is supported only on Sepolia
      </p>
      <motion.button
        onClick={onSwitch}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowPathIcon className="w-5 h-5 mr-2" />
        Switch Chain
      </motion.button>
    </motion.div>
  </motion.div>
);

export default CreatePage;