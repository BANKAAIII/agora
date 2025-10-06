const { ethers } = require('ethers');
const fs = require('fs');

async function main() {
  // Setup provider and signer
  const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/YOUR_INFURA_KEY');
  const privateKey = process.env.PRIVATE_KEY || '0x' + '0'.repeat(64); // Dummy key for testing
  const signer = new ethers.Wallet(privateKey, provider);
  
  // Contract setup
  const factoryAddress = '0x35CBc8a19D9073e619fd63B513bC2e3410A72168';
  const factoryArtifact = JSON.parse(fs.readFileSync('./artifacts/contracts/ElectionFactory.sol/ElectionFactory.json', 'utf8'));
  const factory = new ethers.Contract(factoryAddress, factoryArtifact.abi, provider);
  
  // Test data from the failed transaction
  const electionInfo = {
    startTime: "1759101682",
    endTime: "1759188022", 
    name: "dsfa",
    description: "asdf",
    isPrivate: true
  };
  
  const candidates = [
    { id: "0", name: "qweasd", description: "asd" },
    { id: "1", name: "xcv", description: "sdf" }
  ];
  
  const ballotType = 1;
  const resultType = 1;
  const whitelist = [
    { identifier: "crunchypaan@gmail.com", identifierType: 0, isActive: true }
  ];
  
  console.log('🔍 Testing contract call...');
  
  try {
    // Try to call the function (read-only to see if it would work)
    const result = await factory.createPrivateElection.staticCall(
      electionInfo,
      candidates,
      ballotType,
      resultType,
      whitelist,
      { value: ethers.parseEther("0.01") }
    );
    console.log('✅ Static call succeeded:', result);
  } catch (error) {
    console.error('❌ Static call failed:', error.message);
    
    // Try to get more specific error info
    if (error.data) {
      console.log('Error data:', error.data);
    }
    if (error.reason) {
      console.log('Error reason:', error.reason);
    }
  }
}

main().catch(console.error);
