const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Decoding Error Signature...");
  
  const errorData = "0xa0acb8a4";
  console.log("Error Data:", errorData);
  
  // Get the contract factory to access error definitions
  const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
  const Election = await ethers.getContractFactory("Election");
  
  // Common error signatures
  const commonErrors = {
    "0xa0acb8a4": "InvalidWhitelistEntry()",
    "0x8c379a00": "Error(string)",
    "0x4e487b71": "Panic(uint256)",
    "0x08c379a0": "Error(string)", // Alternative encoding
  };
  
  console.log("\n📋 Known Error Signatures:");
  for (const [sig, name] of Object.entries(commonErrors)) {
    console.log(`${sig}: ${name}`);
  }
  
  if (commonErrors[errorData]) {
    console.log(`\n✅ Found match: ${commonErrors[errorData]}`);
    
    if (errorData === "0xa0acb8a4") {
      console.log("\n🚨 InvalidWhitelistEntry Error Detected!");
      console.log("This means one or more whitelist entries are invalid.");
      console.log("\nPossible causes:");
      console.log("1. Empty identifier string");
      console.log("2. Invalid identifier type (must be 0-4)");
      console.log("3. Whitelist entry format mismatch");
      
      console.log("\nChecking whitelist validation logic...");
      
      // Let's test the whitelist entries individually
      const testEntries = [
        { identifier: "crunchypaan@gmail.com", identifierType: 0, isActive: true },
        { identifier: "literallyzk", identifierType: 1, isActive: true },
        { identifier: "0xf7d0a0de8a3abb3522be2e8ecf03ab99a2982d9c", identifierType: 4, isActive: true }
      ];
      
      console.log("\n🧪 Testing Individual Whitelist Entries:");
      testEntries.forEach((entry, index) => {
        console.log(`Entry ${index}:`, {
          identifier: entry.identifier,
          identifierLength: entry.identifier.length,
          identifierType: entry.identifierType,
          isActive: entry.isActive,
          isValidType: entry.identifierType >= 0 && entry.identifierType <= 4,
          isValidIdentifier: entry.identifier.length > 0
        });
      });
    }
  } else {
    console.log(`\n❌ Unknown error signature: ${errorData}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

