const { ethers } = require("hardhat");

async function main() {
  console.log("🔬 Isolating the Issue...");
  
  const factoryAddress = "0x35CBc8a19D9073e619fd63B513bC2e3410A72168";
  const factory = await ethers.getContractAt("ElectionFactory", factoryAddress);
  
  // Test 1: Try with no whitelist (should fail for different reason)
  console.log("\n🧪 Test 1: Empty whitelist");
  try {
    const electionInfo = {
      startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
      name: "test",
      description: "123",
      isPrivate: true
    };
    
    const candidates = [
      { candidateID: BigInt(0), name: "candidate1", description: "desc1" }
    ];
    
    const emptyWhitelist = [];
    
    await factory.createPrivateElection.estimateGas(
      electionInfo,
      candidates,
      1, // ballotType
      1, // resultType
      emptyWhitelist,
      { value: ethers.parseEther("0.01") }
    );
    
    console.log("✅ Empty whitelist worked (unexpected)");
    
  } catch (error) {
    console.log("❌ Empty whitelist failed as expected");
    console.log("Error data:", error.data);
  }
  
  // Test 2: Try with minimal valid entry
  console.log("\n🧪 Test 2: Single character identifier");
  try {
    const electionInfo = {
      startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
      name: "test",
      description: "123",
      isPrivate: true
    };
    
    const candidates = [
      { candidateID: BigInt(0), name: "candidate1", description: "desc1" }
    ];
    
    const minimalWhitelist = [
      { identifier: "a", identifierType: 0, isActive: true }
    ];
    
    const gasEstimate = await factory.createPrivateElection.estimateGas(
      electionInfo,
      candidates,
      1, // ballotType
      1, // resultType
      minimalWhitelist,
      { value: ethers.parseEther("0.01") }
    );
    
    console.log("✅ Minimal whitelist worked:", gasEstimate.toString());
    
  } catch (error) {
    console.log("❌ Minimal whitelist failed");
    console.log("Error data:", error.data);
  }
  
  // Test 3: Try without sponsorship value
  console.log("\n🧪 Test 3: No sponsorship value");
  try {
    const electionInfo = {
      startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
      endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
      name: "test",
      description: "123",
      isPrivate: true
    };
    
    const candidates = [
      { candidateID: BigInt(0), name: "candidate1", description: "desc1" }
    ];
    
    const whitelist = [
      { identifier: "test@gmail.com", identifierType: 0, isActive: true }
    ];
    
    const gasEstimate = await factory.createPrivateElection.estimateGas(
      electionInfo,
      candidates,
      1, // ballotType
      1, // resultType
      whitelist,
      { value: 0 } // No sponsorship
    );
    
    console.log("✅ No sponsorship worked:", gasEstimate.toString());
    
  } catch (error) {
    console.log("❌ No sponsorship failed");
    console.log("Error data:", error.data);
  }
  
  // Test 4: Test with different identifier types
  console.log("\n🧪 Test 4: Different identifier types");
  for (let identifierType = 0; identifierType <= 4; identifierType++) {
    try {
      const electionInfo = {
        startTime: BigInt(Math.floor(Date.now() / 1000) + 3600),
        endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),
        name: "test",
        description: "123",
        isPrivate: true
      };
      
      const candidates = [
        { candidateID: BigInt(0), name: "candidate1", description: "desc1" }
      ];
      
      const whitelist = [
        { identifier: `test_${identifierType}`, identifierType: identifierType, isActive: true }
      ];
      
      const gasEstimate = await factory.createPrivateElection.estimateGas(
        electionInfo,
        candidates,
        1, // ballotType
        1, // resultType
        whitelist,
        { value: 0 } // No sponsorship
      );
      
      console.log(`✅ IdentifierType ${identifierType} worked:`, gasEstimate.toString());
      
    } catch (error) {
      console.log(`❌ IdentifierType ${identifierType} failed`);
      console.log("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

