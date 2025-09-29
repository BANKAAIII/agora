const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing Whitelist Validation...");
  
  const factoryAddress = "0xd66F1173cD44c15847a4e4E213A6245b5F1F82f3";
  const factory = await ethers.getContractAt("ElectionFactory", factoryAddress);
  
  // Test individual whitelist entries
  const testCases = [
    // Case 1: Valid email
    {
      name: "Valid Email",
      whitelist: [{ identifier: "test@gmail.com", identifierType: 0, isActive: true }]
    },
    // Case 2: Valid Twitter
    {
      name: "Valid Twitter", 
      whitelist: [{ identifier: "twitter_user", identifierType: 1, isActive: true }]
    },
    // Case 3: Valid Wallet
    {
      name: "Valid Wallet",
      whitelist: [{ identifier: "0xf7d0a0de8a3abb3522be2e8ecf03ab99a2982d9c", identifierType: 4, isActive: true }]
    },
    // Case 4: Invalid identifier type (should fail)
    {
      name: "Invalid Type (>4)",
      whitelist: [{ identifier: "test", identifierType: 5, isActive: true }],
      shouldFail: true
    },
    // Case 5: Empty identifier (should fail with our new validation)
    {
      name: "Empty Identifier", 
      whitelist: [{ identifier: "", identifierType: 0, isActive: true }],
      shouldFail: true
    },
    // Case 6: The exact failing case
    {
      name: "Exact Failing Case",
      whitelist: [
        { identifier: "crunchypaan@gmail.com", identifierType: 0, isActive: true },
        { identifier: "literallyzk", identifierType: 1, isActive: true },
        { identifier: "0xf7d0a0de8a3abb3522be2e8ecf03ab99a2982d9c", identifierType: 4, isActive: true }
      ]
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log("Whitelist:", testCase.whitelist);
    
    try {
      const electionInfo = {
        startTime: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
        endTime: BigInt(Math.floor(Date.now() / 1000) + 7200),   // 2 hours from now
        name: "Test Election",
        description: "Test Description",
        isPrivate: true
      };
      
      const candidates = [
        { candidateID: BigInt(0), name: "Candidate 1", description: "Desc 1" }
      ];
      
      const ballotType = 1;
      const resultType = 1;
      
      // Try to estimate gas (this will trigger validation)
      const gasEstimate = await factory.createPrivateElection.estimateGas(
        electionInfo,
        candidates,
        ballotType,
        resultType,
        testCase.whitelist,
        { value: testCase.shouldFail ? 0 : ethers.parseEther("0.01") }
      );
      
      if (testCase.shouldFail) {
        console.log("❌ Test failed: Expected error but transaction succeeded");
        console.log("Gas estimate:", gasEstimate.toString());
      } else {
        console.log("✅ Test passed: Gas estimate:", gasEstimate.toString());
      }
      
    } catch (error) {
      if (testCase.shouldFail) {
        console.log("✅ Test passed: Expected error occurred");
        console.log("Error:", error.message);
        console.log("Error data:", error.data);
      } else {
        console.log("❌ Test failed: Unexpected error occurred");
        console.log("Error:", error.message);
        console.log("Error data:", error.data);
        console.log("Error reason:", error.reason);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

