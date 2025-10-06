const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying ElectionFactory with Private Elections...");
  
  // Get the contract factory
  const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
  
  // Deploy with constructor args (router address for CCIP)
  const router = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59"; // Sepolia CCIP Router
  
  console.log("📦 Deploying with CCIP Router:", router);
  const factory = await ElectionFactory.deploy(router);
  
  console.log("⏳ Waiting for deployment...");
  await factory.waitForDeployment();
  
  const deployedAddress = await factory.getAddress();
  console.log("✅ ElectionFactory deployed to:", deployedAddress);
  
  console.log("\n🎯 Features included:");
  console.log("✅ Private Elections");
  console.log("✅ Multi-Identifier Whitelisting");  
  console.log("✅ Optional Sponsorship");
  console.log("✅ Access Control");
  console.log("✅ CCIP Cross-chain Support");
  
  // Verify deployment
  try {
    console.log("\n🔍 Verifying deployment...");
    const electionCount = await factory.electionCount();
    console.log("📊 Initial election count:", electionCount.toString());
    
    const maxSponsorship = await factory.MAX_SPONSORSHIP_PER_CREATOR();
    console.log("💰 Max sponsorship per creator:", ethers.formatEther(maxSponsorship), "ETH");
    
    const minSponsorship = await factory.MIN_SPONSORSHIP_AMOUNT();
    console.log("💰 Min sponsorship amount:", ethers.formatEther(minSponsorship), "ETH");
    
    const maxActiveElections = await factory.MAX_ACTIVE_ELECTIONS_PER_CREATOR();
    console.log("📈 Max active elections per creator:", maxActiveElections.toString());
    
    // Test new functions exist
    const publicElections = await factory.getPublicElections();
    console.log("📋 Public elections (initial):", publicElections.length);
    
    const privateElections = await factory.getPrivateElections();
    console.log("🔒 Private elections (initial):", privateElections.length);
    
    console.log("\n🎉 Deployment successful!");
    console.log("\n📋 Next Steps:");
    console.log("1. Update ELECTION_FACTORY_ADDRESS in client/app/constants.ts");
    console.log("2. Remove temporary restrictions in create page");
    console.log("3. Test private election creation");
    console.log("4. Verify on Etherscan");
    
    console.log("\n📝 Update constants.ts with:");
    console.log(`export const ELECTION_FACTORY_ADDRESS = "${deployedAddress}";`);
    
  } catch (error) {
    console.error("❌ Error verifying deployment:", error);
  }
}

main()
  .then(() => {
    console.log("\n✅ Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

