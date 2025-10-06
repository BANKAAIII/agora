const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Private Election Fix...");
  
  // Deploy a minimal ElectionFactory for testing
  const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
  const router = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"; // Sepolia CCIP Router
  
  console.log("📦 Deploying minimal ElectionFactory...");
  const factory = await ElectionFactory.deploy(router);
  await factory.waitForDeployment();
  
  const address = await factory.getAddress();
  console.log("✅ ElectionFactory deployed to:", address);
  
  // Test the fixed addToWhitelist function
  console.log("\n🔍 Testing addToWhitelist fix...");
  
  // Create a test private election
  const electionInfo = {
    startTime: Math.floor(Date.now() / 1000) + 60, // 1 minute from now
    endTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    name: "Test Private Election",
    description: "Testing the fix",
    isPrivate: true
  };
  
  const candidates = [
    { candidateID: 0, name: "Candidate 1", description: "Test candidate 1" },
    { candidateID: 1, name: "Candidate 2", description: "Test candidate 2" }
  ];
  
  const whitelist = [
    { identifier: "test@example.com", identifierType: 0, isActive: true }
  ];
  
  try {
    console.log("🚀 Creating private election...");
    const tx = await factory.createPrivateElection(
      electionInfo,
      candidates,
      1, // ballotType
      1, // resultType
      whitelist,
      { value: ethers.parseEther("0.01") }
    );
    
    console.log("⏳ Waiting for transaction...");
    const receipt = await tx.wait();
    
    if (receipt.status === 1) {
      console.log("🎉 SUCCESS! Private election created successfully!");
      console.log("✅ The addToWhitelist fix is working!");
      
      // Get the created election address
      const events = receipt.logs.filter(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === 'PrivateElectionCreated';
        } catch (e) {
          return false;
        }
      });
      
      if (events.length > 0) {
        const event = factory.interface.parseLog(events[0]);
        console.log("📋 Election address:", event.args.election);
      }
    } else {
      console.log("❌ Transaction failed");
    }
    
  } catch (error) {
    console.error("❌ Error creating private election:", error.message);
    
    if (error.message.includes("OwnerPermissioned")) {
      console.log("🔍 This confirms the original issue - addToWhitelist was failing");
    }
  }
}

main()
  .then(() => {
    console.log("\n✅ Test completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
