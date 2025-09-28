const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying updated ElectionFactory...");

  // Get the contract factory
  const ElectionFactory = await ethers.getContractFactory("ElectionFactory");

  // Deploy with the CCIP router address for Sepolia
  const ccipRouter = "0xd0daae2231e9cb96b94c8512223533293c3693bf"; // Sepolia CCIP Router
  
  console.log("Deploying with CCIP Router:", ccipRouter);
  
  const electionFactory = await ElectionFactory.deploy(ccipRouter);
  await electionFactory.waitForDeployment();

  console.log("✅ ElectionFactory deployed to:", await electionFactory.getAddress());
  console.log("📋 Contract details:");
  console.log("   - MAX_ACTIVE_ELECTIONS_PER_CREATOR:", await electionFactory.MAX_ACTIVE_ELECTIONS_PER_CREATOR());
  console.log("   - Factory Owner:", await electionFactory.factoryOwner());
  
  // Test the new function
  const [deployer] = await ethers.getSigners();
  console.log("   - Active elections for deployer:", await electionFactory.getActiveElectionsCount(deployer.address));

  console.log("\n🔄 To use this new contract:");
  console.log("1. Update ELECTION_FACTORY_ADDRESS in client/app/constants.ts");
  console.log("2. Update the contract address to:", await electionFactory.getAddress());
  console.log("3. The new contract now:");
  console.log("   - Supports up to 15 active elections per creator");
  console.log("   - Only counts truly active (not ended) elections");
  console.log("   - Includes helper functions for election management");

  // Verify on Etherscan (optional)
  if (process.env.ETHERSCAN_KEY) {
    console.log("\n⏳ Waiting for block confirmations...");
    await electionFactory.deployTransaction.wait(6);
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: await electionFactory.getAddress(),
        constructorArguments: [ccipRouter],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
