const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing New Contract...");
  
  const factoryAddress = "0x35CBc8a19D9073e619fd63B513bC2e3410A72168";
  const factory = await ethers.getContractAt("ElectionFactory", factoryAddress);
  
  console.log("Contract address:", factoryAddress);
  
  // Test the exact failing case from the frontend
  const electionInfo = {
    startTime: BigInt("1759097471"),
    endTime: BigInt("1759183811"),
    name: "test",
    description: "123",
    isPrivate: true
  };
  
  const candidates = [
    { candidateID: BigInt(0), name: "qw", description: "as" },
    { candidateID: BigInt(1), name: "dfdf", description: "cv" }
  ];
  
  const ballotType = 1;
  const resultType = 1;
  
  const whitelist = [
    { identifier: "crunchypaan@gmail.com", identifierType: 0, isActive: true },
    { identifier: "literallyzk", identifierType: 1, isActive: true },
    { identifier: "0xf7d0a0de8a3abb3522be2e8ecf03ab99a2982d9c", identifierType: 4, isActive: true }
  ];
  
  console.log("\n📋 Test Parameters:");
  console.log("Election Info:", electionInfo);
  console.log("Candidates:", candidates);
  console.log("Ballot Type:", ballotType);
  console.log("Result Type:", resultType);
  console.log("Whitelist:", whitelist);
  console.log("Sponsorship Value: 0.01 ETH");
  
  try {
    console.log("\n⛽ Estimating gas...");
    const gasEstimate = await factory.createPrivateElection.estimateGas(
      electionInfo,
      candidates,
      ballotType,
      resultType,
      whitelist,
      { value: ethers.parseEther("0.01") }
    );
    
    console.log("✅ Gas estimate successful:", gasEstimate.toString());
    console.log("🎉 Transaction should work now!");
    
  } catch (error) {
    console.log("❌ Still failing:");
    console.log("Error:", error.message);
    console.log("Error data:", error.data);
    console.log("Error reason:", error.reason);
    
    // Let's try with simpler whitelist
    console.log("\n🧪 Testing with single whitelist entry...");
    try {
      const simpleWhitelist = [
        { identifier: "test@gmail.com", identifierType: 0, isActive: true }
      ];
      
      const simpleGasEstimate = await factory.createPrivateElection.estimateGas(
        electionInfo,
        candidates,
        ballotType,
        resultType,
        simpleWhitelist,
        { value: ethers.parseEther("0.01") }
      );
      
      console.log("✅ Simple whitelist works:", simpleGasEstimate.toString());
      
    } catch (simpleError) {
      console.log("❌ Simple whitelist also fails:");
      console.log("Error:", simpleError.message);
      console.log("Error data:", simpleError.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

