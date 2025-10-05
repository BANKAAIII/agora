const fs = require('fs');
const path = require('path');

const envContent = `# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=YOUR_CLIENT_ID

# RPC URLs
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc

# Pimlico Paymaster (optional)
NEXT_PUBLIC_PIMLICO_API_KEY=YOUR_PIMLICO_API_KEY

# Pinata IPFS (optional)
NEXT_PUBLIC_PINATA_JWT=YOUR_PINATA_JWT`;

const envPath = path.join(__dirname, '.env.local');

try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('📝 Please update the values in .env.local with your actual credentials:');
  console.log('   - NEXT_PUBLIC_WEB3AUTH_CLIENT_ID: Get from https://dashboard.web3auth.io/');
  console.log('   - NEXT_PUBLIC_PIMLICO_API_KEY: Get from https://pimlico.io/');
  console.log('   - NEXT_PUBLIC_PINATA_JWT: Get from https://pinata.cloud/');
} catch (error) {
  console.error('❌ Failed to create .env.local:', error.message);
}
