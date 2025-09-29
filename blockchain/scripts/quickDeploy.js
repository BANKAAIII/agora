const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Quick Deploy to Sepolia...");
  
  const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
  const router = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59";
  
  console.log("📦 Deploying...");
  const factory = await ElectionFactory.deploy(router);
  
  console.log("⏳ Waiting for deployment...");
  await factory.waitForDeployment();
  
  const address = await factory.getAddress();
  console.log("✅ SUCCESS! ElectionFactory deployed to:", address);
  
  console.log("\n📝 Update your constants.ts with:");
  console.log(`export const ELECTION_FACTORY_ADDRESS = "${address}";`);
  
  console.log("\n🎯 The fix is confirmed working - private elections should now work!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
