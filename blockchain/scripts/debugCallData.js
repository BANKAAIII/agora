const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Debug Call Data...");
  
  const factoryAddress = "0x35CBc8a19D9073e619fd63B513bC2e3410A72168";
  const factory = await ethers.getContractAt("ElectionFactory", factoryAddress);
  
  const [signer] = await ethers.getSigners();
  console.log("Signer address:", signer.address);
  console.log("Signer balance:", ethers.formatEther(await signer.provider.getBalance(signer.address)));
  
  // Construct the exact call data that was failing
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
  
  // First, let's manually encode the function call
  console.log("\n📦 Encoding function call...");
  try {
    const iface = factory.interface;
    const functionData = iface.encodeFunctionData("createPrivateElection", [
      electionInfo,
      candidates,
      1, // ballotType
      1, // resultType
      whitelist
    ]);
    
    console.log("✅ Function encoding successful");
    console.log("Call data length:", functionData.length);
    console.log("Call data (first 100 chars):", functionData.substring(0, 100));
    
    // Now try to call it with eth_call (read-only simulation)
    console.log("\n📞 Testing with eth_call...");
    try {
      const callResult = await signer.provider.call({
        to: factoryAddress,
        data: functionData,
        value: ethers.parseEther("0.01").toString(),
        from: signer.address
      });
      
      console.log("✅ eth_call successful");
      console.log("Result:", callResult);
      
    } catch (callError) {
      console.log("❌ eth_call failed:");
      console.log("Error:", callError.message);
      console.log("Error data:", callError.data);
      
      // Try to decode the error
      if (callError.data) {
        console.log("\n🔍 Decoding error data...");
        try {
          // Check if it's a custom error
          const errorSelector = callError.data.slice(0, 10);
          console.log("Error selector:", errorSelector);
          
          // Try to match against our known errors
          const knownErrors = {
            "0xa0acb8a4": "InvalidWhitelistEntry()",
            "0x72b237ee": "Unknown error",
            "0x08c379a0": "Error(string) - require() failure"
          };
          
          if (knownErrors[errorSelector]) {
            console.log("Identified error:", knownErrors[errorSelector]);
            
            if (errorSelector === "0x08c379a0") {
              // Try to decode the error message
              try {
                const errorMessage = ethers.AbiCoder.defaultAbiCoder().decode(
                  ["string"], 
                  "0x" + callError.data.slice(10)
                )[0];
                console.log("Error message:", errorMessage);
              } catch (decodeError) {
                console.log("Could not decode error message");
              }
            }
          } else {
            console.log("Unknown error selector");
          }
        } catch (decodeError) {
          console.log("Could not decode error data");
        }
      }
    }
    
  } catch (encodeError) {
    console.log("❌ Function encoding failed:", encodeError.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

