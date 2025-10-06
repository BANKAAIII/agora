const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Decoding New Error Signature...");
  
  const errorData = "0x72b237ee";
  console.log("Error Data:", errorData);
  
  // Calculate common error signatures
  const commonErrors = {
    "0xa0acb8a4": "InvalidWhitelistEntry()",
    "0x72b237ee": "Unknown - Let's calculate",
    "0x8c379a00": "Error(string)",
    "0x4e487b71": "Panic(uint256)",
    "0x08c379a0": "Error(string)",
  };
  
  // Common custom errors we might have
  const possibleErrors = [
    "InvalidWhitelistEntry()",
    "InvalidSponsorshipAmount()",
    "CreatorSponsorshipLimitExceeded()",
    "PrivateElectionRequiresSponsorship()",
    "InvalidIdentifierType()",
    "ElectionIsPrivate()",
    "NotWhitelisted()",
  ];
  
  console.log("\n🧮 Calculating error signatures:");
  for (const errorSig of possibleErrors) {
    const hash = ethers.id(errorSig);
    const selector = hash.slice(0, 10);
    console.log(`${selector}: ${errorSig}`);
    
    if (selector === errorData) {
      console.log(`\n✅ MATCH FOUND: ${errorSig}`);
    }
  }
  
  // Let's also check if this might be a require() statement error
  // Try to see if it's a specific revert reason
  console.log("\n🔍 Checking for specific error patterns...");
  
  // Common require error patterns
  const requireErrors = [
    "Too many active elections",
    "Creator sponsorship limit exceeded",
    "Private elections require sponsorship",
    "Invalid election parameters",
    "Insufficient sponsorship amount"
  ];
  
  for (const errorMsg of requireErrors) {
    // require() errors are encoded as Error(string) with the message
    const abiCoder = new ethers.AbiCoder();
    try {
      const encoded = abiCoder.encode(["string"], [errorMsg]);
      const fullError = "0x08c379a0" + encoded.slice(2); // Error(string) selector + data
      const selector = fullError.slice(0, 10);
      console.log(`Error "${errorMsg}" would be: ${selector}`);
    } catch (e) {
      // Skip encoding errors
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

