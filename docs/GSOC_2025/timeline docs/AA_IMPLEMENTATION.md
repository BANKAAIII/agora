# Account Abstraction Implementation

This document explains the Account Abstraction (AA) implementation using Web3Auth's Smart Account SDK.

## 🚀 Features Implemented

### 1. Smart Account Integration
- **Web3Auth Integration**: Uses existing Web3Auth social login to create smart accounts
- **Sepolia Support**: Currently configured for Sepolia testnet
- **Singleton Pattern**: Efficient smart account initialization and management

### 2. Gas Sponsorship System
- **Config-based Sponsorship**: Elections can be marked as sponsored in configuration
- **Conditional Paymaster**: Automatically uses paymaster for sponsored elections
- **Fallback Handling**: Graceful fallback to user-paid gas for non-sponsored elections

### 3. Enhanced Voting Experience
- **Smart Account Voting**: Users can vote using their smart account
- **Sponsorship Status**: UI shows whether gas is sponsored or user-paid
- **Loading States**: Proper loading indicators during voting process

## 📁 Files Added/Modified

### New Files
- `app/helpers/smartAccount.ts` - Smart account management and operations
- `app/helpers/paymaster.ts` - Gas sponsorship logic and configuration
- `AA_IMPLEMENTATION.md` - This documentation file

### Modified Files
- `app/context/Web3AuthContext.tsx` - Added smart account state management
- `app/components/Modal/Vote.tsx` - Enhanced voting with AA support

## 🔧 Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here

# Sepolia Network Configuration
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org

# Account Abstraction Configuration (for future use)
NEXT_PUBLIC_BUNDLER_URL=https://bundler.sepolia.ethpandaops.io
NEXT_PUBLIC_PAYMASTER_URL=https://paymaster.sepolia.ethpandaops.io
```

### Sponsorship Configuration
**For Demo Purposes**: Sponsorship is config-based (not environment variables). To sponsor specific elections, add their addresses to the `sponsoredElections` array in `app/helpers/paymaster.ts`:

```typescript
const PAYMASTER_CONFIG = {
  // ... other config
  sponsoredElections: [
    "0x1234567890123456789012345678901234567890", // Add election addresses here
    "0x0987654321098765432109876543210987654321",
  ],
};
```

**Alternative**: Use the browser console or test helper:
```javascript
// In browser console
addTestElectionForDemo("0xYOUR_ELECTION_ADDRESS_HERE");
```

## 🎯 How It Works

### 1. User Authentication
1. User logs in via Web3Auth (Google/X/GitHub)
2. Smart account is automatically initialized
3. User gets a smart contract wallet address

### 2. Voting Process
1. User selects candidates and clicks "Vote"
2. System checks if election is sponsored
3. If sponsored: Uses paymaster for gas-free voting
4. If not sponsored: Checks user balance and proceeds with user-paid gas
5. Transaction is sent via smart account or regular wallet

### 3. UI Feedback
- Shows sponsorship status (sponsored/user-paid)
- Displays smart account usage indicator
- Provides loading states during voting

## 🧪 Testing

### For Demo to Mentor

1. **Setup Sponsorship**:
   
   **Option A - Browser Console (Recommended for Demo):**
   ```javascript
   // In browser console (easiest for demo)
   addTestElectionForDemo("0xYOUR_ELECTION_ADDRESS_HERE");
   ```
   
   **Option B - Code Configuration:**
   ```typescript
   // In app/helpers/paymaster.ts, add to sponsoredElections array
   sponsoredElections: [
     "0xYOUR_ELECTION_ADDRESS_HERE"
   ]
   ```
   
   **Option C - Test Helper UI:**
   Use the floating test helper component (bottom-right corner when logged in)

2. **Test Flow**:
   - Login with Web3Auth (Google/X/GitHub)
   - Navigate to a sponsored election
   - Vote and see "Gas fees sponsored by admin" message
   - Try a non-sponsored election to see "User pays gas fees"

3. **Verify Smart Account**:
   - Check that smart account address is displayed
   - Confirm transactions are sent via smart account

## 🔮 Future Enhancements

### Phase 2: Full ERC-4337 Implementation
- Integrate with actual bundler service
- Implement proper paymaster contracts
- Add support for multiple chains

### Phase 3: Advanced Features
- Dynamic sponsorship based on election parameters
- User balance management for smart accounts
- Batch voting operations

## 🚨 Current Limitations

1. **Demo Implementation**: Uses simplified smart account wrapper
2. **Sepolia Only**: Currently configured for Sepolia testnet
3. **Config-based Sponsorship**: Sponsorship is hardcoded in configuration
4. **No Real Paymaster**: Uses placeholder paymaster logic

## 🛠️ Troubleshooting

### Common Issues

1. **Smart Account Not Initializing**:
   - Ensure Web3Auth is properly configured
   - Check that user is authenticated via Web3Auth

2. **Voting Fails**:
   - Verify election address is correct
   - Check user has sufficient balance for non-sponsored elections

3. **Sponsorship Not Working**:
   - Confirm election address is in `sponsoredElections` array
   - Check paymaster configuration

### Debug Mode
Enable debug logging by setting `enableLogging: true` in Web3Auth config (not recommended for production).

## 📞 Support

For issues or questions about the AA implementation, refer to:
- Web3Auth documentation: https://web3auth.io/docs
- ERC-4337 specification: https://eips.ethereum.org/EIPS/eip-4337 