const { ethers } = require("hardhat");

async function main() {
  console.log("🔬 Minimal Test...");
  
  // Let's try deploying a fresh contract locally first
  console.log("\n🏗️ Deploying fresh contract locally...");
  
  try {
    const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
    const router = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"; // Sepolia CCIP Router
    
    // Deploy locally first to test
    const factory = await ElectionFactory.deploy(router);
    await factory.waitForDeployment();
    
    const localAddress = await factory.getAddress();
    console.log("✅ Local deployment successful:", localAddress);
    
    // Test basic function
    const electionCount = await factory.electionCount();
    console.log("Election count:", electionCount.toString());
    
    // Now test the minimal private election creation
    console.log("\n🧪 Testing minimal private election...");
    
    const electionInfo = {
      startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
      name: "test",
      description: "desc",
      isPrivate: true
    };
    
    const candidates = [
      { candidateID: BigInt(0), name: "A", description: "A" }
    ];
    
    const whitelist = [
      { identifier: "a@b.com", identifierType: 0, isActive: true }
    ];
    
    console.log("Test parameters:");
    console.log("- Election info:", electionInfo);
    console.log("- Candidates:", candidates);
    console.log("- Whitelist:", whitelist);
    
    try {
      const gasEstimate = await factory.createPrivateElection.estimateGas(
        electionInfo,
        candidates,
        1, // ballotType
        1, // resultType
        whitelist,
        { value: ethers.parseEther("0.01") }
      );
      
      console.log("✅ LOCAL TEST SUCCESSFUL!");
      console.log("Gas estimate:", gasEstimate.toString());
      
      // Now test the live contract
      console.log("\n🌐 Testing live contract...");
      const liveFactory = await ethers.getContractAt("ElectionFactory", "0x35CBc8a19D9073e619fd63B513bC2e3410A72168");
      
      try {
        const liveGasEstimate = await liveFactory.createPrivateElection.estimateGas(
          electionInfo,
          candidates,
          1, // ballotType
          1, // resultType
          whitelist,
          { value: ethers.parseEther("0.01") }
        );
        
        console.log("✅ LIVE TEST ALSO SUCCESSFUL!");
        console.log("Live gas estimate:", liveGasEstimate.toString());
        
      } catch (liveError) {
        console.log("❌ Live contract still fails:");
        console.log("Error data:", liveError.data);
        
        // Compare contract bytecode
        console.log("\n🔍 Comparing contracts...");
        const localCode = await ethers.provider.getCode(localAddress);
        const liveCode = await ethers.provider.getCode("0x35CBc8a19D9073e619fd63B513bC2e3410A72168");
        
        console.log("Local code length:", localCode.length);
        console.log("Live code length:", liveCode.length);
        console.log("Bytecode matches:", localCode === liveCode ? "YES" : "NO");
      }
      
    } catch (localError) {
      console.log("❌ Local test failed:");
      console.log("Error:", localError.message);
      console.log("Error data:", localError.data);
    }
    
  } catch (deployError) {
    console.log("❌ Local deployment failed:", deployError.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

