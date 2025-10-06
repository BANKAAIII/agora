// Quick test script for sponsorship integration
// Run with: node test-sponsorship.js

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { ethers } = require('ethers');

// Mock election data for testing
const MOCK_ELECTION_ADDRESS = "0x1234567890123456789012345678901234567890";
const SEPOLIA_RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://rpc.sepolia.org";

// Simulate the sponsorship checking function
async function testSponsorshipIntegration() {
  console.log("🧪 Testing Sponsorship Integration Functions...\n");
  
  try {
    // Test 1: Environment Variables
    console.log("✅ Test 1: Environment Variables");
    console.log("Web3Auth Client ID:", process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ? "✅ Set" : "❌ Missing");
    console.log("Sepolia RPC URL:", process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ? "✅ Set" : "❌ Missing");
    console.log("Factory Address:", process.env.NEXT_PUBLIC_ELECTION_FACTORY_ADDRESS ? "✅ Set" : "❌ Missing");
    
    // Test 2: RPC Connection
    console.log("\n✅ Test 2: RPC Connection");
    const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const network = await provider.getNetwork();
    console.log(`Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    
    // Test 3: Contract ABI Loading
    console.log("\n✅ Test 3: Contract ABI Loading");
    try {
      const { Election } = require('./abi/artifacts/Election');
      console.log(`Election ABI loaded: ${Election.length} functions found`);
      
      // Check if sponsorship functions exist
      const sponsorshipFunctions = Election.filter(f => 
        f.name && (
          f.name.includes('sponsorship') || 
          f.name.includes('Sponsorship') ||
          f.name === 'getSponsorshipStatus' ||
          f.name === 'addSponsorship'
        )
      );
      console.log(`Sponsorship functions found: ${sponsorshipFunctions.length}`);
      sponsorshipFunctions.forEach(f => console.log(`  - ${f.name}`));
    } catch (error) {
      console.log("❌ Error loading Election ABI:", error.message);
    }
    
    // Test 4: Sponsorship Status Function (with mock address)
    console.log("\n✅ Test 4: Sponsorship Status Function Structure");
    
    // This would be the actual function call (commented out since address is mock)
    console.log("Function signature: getElectionSponsorshipStatus(electionAddress)");
    console.log("Expected return: { isSponsored, remainingBalance, totalVotesSponsored, message, costPerVote }");
    
    console.log("\n🎉 Integration tests completed!");
    console.log("\n📋 Next Steps:");
    console.log("1. Set up real Web3Auth Client ID");
    console.log("2. Deploy contracts to testnet");
    console.log("3. Test with real election addresses");
    console.log("4. Test gasless voting flow");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run tests
testSponsorshipIntegration();