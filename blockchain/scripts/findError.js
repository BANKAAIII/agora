const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Finding the Real Error...");
  
  const errorData = "0x72b237ee";
  console.log("Mystery Error Data:", errorData);
  
  // Let's try to extract more information by calling the contract directly
  const factoryAddress = "0x35CBc8a19D9073e619fd63B513bC2e3410A72168";
  
  console.log("\n📋 Contract Analysis:");
  console.log("Factory Address:", factoryAddress);
  
  try {
    const factory = await ethers.getContractAt("ElectionFactory", factoryAddress);
    
    // Test basic contract functions first
    console.log("\n🧪 Testing basic contract functions:");
    
    const electionCount = await factory.electionCount();
    console.log("✅ Election count:", electionCount.toString());
    
    const maxSponsorship = await factory.MAX_SPONSORSHIP_PER_CREATOR();
    console.log("✅ Max sponsorship:", ethers.formatEther(maxSponsorship), "ETH");
    
    const minSponsorship = await factory.MIN_SPONSORSHIP_AMOUNT();
    console.log("✅ Min sponsorship:", ethers.formatEther(minSponsorship), "ETH");
    
    // Check if the function exists
    console.log("\n🔍 Checking function existence:");
    try {
      const functionFragment = factory.interface.getFunction("createPrivateElection");
      console.log("✅ createPrivateElection function exists");
      console.log("Function signature:", functionFragment.format());
    } catch (e) {
      console.log("❌ createPrivateElection function not found");
    }
    
    // Try a simpler approach - test public election creation first
    console.log("\n🧪 Testing public election creation (for comparison):");
    try {
      const publicElectionInfo = {
        startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
        name: "test",
        description: "123"
      };
      
      const candidates = [
        { candidateID: BigInt(0), name: "candidate1", description: "desc1" }
      ];
      
      const gasEstimate = await factory.createElection.estimateGas(
        publicElectionInfo,
        candidates,
        1, // ballotType
        1  // resultType
      );
      
      console.log("✅ Public election gas estimate:", gasEstimate.toString());
      
    } catch (publicError) {
      console.log("❌ Public election also fails:");
      console.log("Error data:", publicError.data);
    }
    
  } catch (error) {
    console.log("❌ Contract connection failed:", error.message);
  }
  
  // Let's manually calculate what 0x72b237ee might be
  console.log("\n🧮 Manual error signature calculation:");
  
  // Check if it's a common Solidity error
  const solidityErrors = [
    "Ownable: caller is not the owner",
    "Pausable: paused",
    "ReentrancyGuard: reentrant call",
    "SafeERC20: low-level call failed"
  ];
  
  for (const error of solidityErrors) {
    const hash = ethers.id(`Error(string)`);
    console.log(`Error(string) selector: ${hash.slice(0, 10)}`);
    break; // Just need one example
  }
  
  // Check if it's related to our specific errors
  const ourErrors = [
    "OwnerPermissioned()",
    "AlreadyVoted()",
    "GetVotes()",
    "ElectionIncomplete()",
    "ElectionInactive()",
    "InvalidCandidateID()"
  ];
  
  for (const error of ourErrors) {
    const hash = ethers.id(error);
    const selector = hash.slice(0, 10);
    console.log(`${selector}: ${error}`);
    if (selector === errorData) {
      console.log(`🎯 FOUND MATCH: ${error}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

