# Pimlico Paymaster and Chain Switching Fixes

## Issues Fixed

### 1. Pimlico Paymaster Configuration Issues

**Problems:**
- Hardcoded API key in multiple files
- Incorrect URL format for Pimlico API
- Missing environment variable configuration
- No proper error handling

**Solutions:**
- ✅ Updated `web3auth.ts` to use environment variables
- ✅ Updated `smartAccountV2.ts` to use environment variables  
- ✅ Added proper Authorization headers for Pimlico API
- ✅ Created `.env.example` with proper configuration
- ✅ Enhanced `paymaster.ts` with actual Pimlico integration

### 2. Chain Switching Issues

**Problems:**
- Chain switching not prompting wallet properly
- No error handling for failed chain switches
- Missing toast notifications for user feedback

**Solutions:**
- ✅ Created `chainSwitch.ts` utility with proper wallet integration
- ✅ Added error handling and user feedback in all components
- ✅ Fixed async/await issues in chain switching functions
- ✅ Added proper toast notifications for chain switch errors

## Web3Auth Dashboard Configuration

**IMPORTANT:** Pimlico bundler and paymaster URLs should be configured in your Web3Auth Dashboard, NOT in the codebase.

### Web3Auth Dashboard Setup:
1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/)
2. Select your project
3. Navigate to "Account Abstraction" settings
4. Configure the following for Sepolia network:

```
Network Name: Sepolia
Chain ID: 0xaa36a7
Bundler URL: https://api.pimlico.io/v2/11155111/rpc?apikey=your_pimlico_api_key
Paymaster URL: https://api.pimlico.io/v2/11155111/rpc?apikey=your_pimlico_api_key
```

### Environment Setup (Optional)

Create a `.env.local` file in the `client` directory:

```env
# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here

# RPC URLs (Optional overrides)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
```

## Files Modified

### Core Configuration Files:
- `client/app/helpers/web3auth.ts` - **REMOVED** redundant Pimlico config (uses Dashboard)
- `client/app/helpers/smartAccountV2.ts` - **REMOVED** redundant Pimlico config (uses Dashboard)
- `client/app/helpers/web3authTransaction.ts` - **NEW** Web3Auth Account Abstraction helper
- `client/app/helpers/chainSwitch.ts` - New utility for chain switching
- `client/app/helpers/paymaster.ts` - Enhanced with Pimlico integration (legacy support)

### Component Files:
- `client/app/create/page.tsx` - Fixed chain switching with error handling
- `client/app/components/Modal/AddCandidate.tsx` - Fixed chain switching
- `client/app/components/Helper/CrossChain.tsx` - Fixed chain switching
- `client/app/context/Web3AuthContext.tsx` - Enhanced error handling

### Configuration Files:
- `client/.env.example` - New environment template

## Testing the Fixes

### Test Web3Auth Account Abstraction:
1. **Configure Pimlico in Web3Auth Dashboard** (most important step)
2. Login with Web3Auth
3. Try creating an election
4. Check console - should show "Using Web3Auth Account Abstraction for election creation"
5. Verify transactions use Account Abstraction (check transaction from address)

### Test Pimlico Paymaster:
1. Ensure Web3Auth Dashboard has correct Pimlico configuration
2. Create an election while logged in with Web3Auth
3. Transaction should use the smart account address, not EOA
4. Check Etherscan for UserOperation transactions

### Test Chain Switching:
1. Connect your wallet (Web3Auth or external)
2. Try switching between Sepolia and Avalanche Fuji
3. Verify wallet prompts appear correctly
4. Check for proper error messages if switching fails

## Troubleshooting

### Pimlico Issues:
- Verify your API key is correct
- Check network connectivity
- Ensure you're on the correct network (Sepolia)
- Check browser console for API errors

### Chain Switching Issues:
- Ensure wallet is connected
- Check if the target chain is added to your wallet
- Verify RPC URLs are accessible
- Check for proper error handling in console

## Next Steps

1. **Configure Pimlico in Web3Auth Dashboard** (CRITICAL - this is where the real config goes)
2. **Test Web3Auth login and Account Abstraction**
3. **Verify election creation uses Web3Auth AA**
4. **Test chain switching functionality**
5. **Monitor console logs** for transaction flow

## How It Works Now

### Transaction Flow:
1. **Web3Auth Logged In + Smart Account Available**: Uses `sendTransactionWithPaymaster()` → Smart Account → Pimlico
2. **Fallback**: Uses regular `writeContractAsync()` → Standard wallet transaction

### Key Changes:
- **Removed redundant Pimlico config** from codebase (conflicts with Web3Auth Dashboard)
- **Fixed Web3Auth Smart Account integration** using existing `smartAccountV2.ts`
- **Enhanced election creation** to use Web3Auth's Smart Account when available
- **Added comprehensive debugging** and logging
- **Improved error handling** and user feedback

### Debug Information:
- **Enable Web3Auth logging** in context for better debugging
- **Console logs** show Web3Auth Account Abstraction status
- **Check browser console** for "Web3Auth Account Abstraction Provider" messages
- **UserOperation debugging** with detailed gas estimation and error handling
- **Automatic fallback** from Smart Account to regular transaction if needed

### UserOperation Simulation Issues:
If you see `UserOperation reverted during simulation with reason: 0x`:
1. **Check contract parameters** - ensure all function arguments are correct
2. **Verify gas limits** - UserOperation gas estimation might fail
3. **Check smart account balance** - ensure sufficient ETH for gas estimation
4. **Fallback mechanism** - system will automatically try regular transaction

## Additional Notes

- The hardcoded API key `pim_MiaYuXkQNsWzVGLeRJdyUG` should be replaced with your own
- Chain switching now includes proper error handling and user feedback
- Paymaster integration now uses the correct Pimlico API endpoints
- All changes are backward compatible with existing functionality
