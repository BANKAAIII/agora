# Web3Auth Integration Setup Guide

## Overview
This project has been updated to use Web3Auth Modal SDK instead of RainbowKit for authentication. Web3Auth provides social login options and traditional wallet connections with Account Abstraction support.

## What's Changed

### Removed
- ✅ RainbowKit ConnectButton
- ✅ RainbowKit providers and styles
- ✅ Manual wallet connection handling

### Added
- ✅ Web3Auth Modal SDK integration
- ✅ Social login support (Google, GitHub, Twitter, LinkedIn)
- ✅ Traditional wallet connections (MetaMask, WalletConnect)
- ✅ Account Abstraction support
- ✅ Context-based state management
- ✅ Toast notifications for user feedback

## Environment Variables

Create a `.env.local` file in the `client/` directory with the following variables:

```env
# Web3Auth Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id_here

# RPC URLs
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
NEXT_PUBLIC_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc

# Optional: Social Login Client IDs
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_TWITTER_CLIENT_ID=your_twitter_client_id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
```

## Getting Your Web3Auth Client ID

1. Go to [Web3Auth Dashboard](https://dashboard.web3auth.io)
2. Create a new project
3. Select "Web3Auth" as the product
4. Choose "Modal SDK" as the integration
5. Copy the Client ID and add it to your environment variables

## Features

### Authentication Methods
- **Social Logins**: Google, GitHub, Twitter, LinkedIn
- **Traditional Wallets**: MetaMask, WalletConnect, Coinbase Wallet
- **Email/Password**: Traditional authentication
- **Account Abstraction**: Smart contract wallets

### User Experience
- **Single Login Button**: Unified authentication interface
- **Persistent Sessions**: Users stay logged in across browser sessions
- **Real-time Status**: Live connection status updates
- **Toast Notifications**: User feedback for login/logout actions

### Developer Experience
- **Context API**: Easy access to auth state throughout the app
- **TypeScript Support**: Full type safety
- **Error Handling**: Comprehensive error management
- **Wagmi Integration**: Seamless blockchain interactions

## Usage

### Basic Authentication
```typescript
import { useWeb3Auth } from "@/app/context/Web3AuthContext";

const MyComponent = () => {
  const { isAuthenticated, userInfo, address, login, logout } = useWeb3Auth();

  if (!isAuthenticated) {
    return <button onClick={login}>Connect Wallet</button>;
  }

  return (
    <div>
      <p>Welcome, {userInfo?.name}!</p>
      <p>Address: {address}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Contract Interactions
```typescript
import { useAccount, useWriteContract } from "wagmi";

const VotingComponent = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const vote = async () => {
    await writeContractAsync({
      address: electionAddress,
      abi: ElectionABI,
      functionName: "vote",
      args: [candidateId],
    });
  };

  return <button onClick={vote}>Vote</button>;
};
```

## File Structure

```
client/app/
├── context/
│   └── Web3AuthContext.tsx     # Auth state management
├── helpers/
│   ├── web3auth.ts            # Web3Auth configuration
│   └── client.ts              # Wagmi configuration
├── components/
│   └── Helper/
│       └── Web3Login.tsx      # Login/logout UI
└── layout.tsx                 # App layout with providers
```

## Migration Notes

### From RainbowKit
- Replace `ConnectButton` with `Web3Login`
- Use `useWeb3Auth()` instead of `useAccount()` for auth state
- Contract interactions remain the same with Wagmi hooks

### Benefits
- **Better UX**: Social logins reduce friction
- **Account Abstraction**: Smart contract wallets for gasless transactions
- **Unified Auth**: Single authentication system
- **Future-proof**: Easy to add more authentication methods

## Troubleshooting

### Common Issues
1. **Client ID not set**: Ensure `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` is in your environment variables
2. **Network issues**: Check RPC URLs are accessible
3. **Social login not working**: Verify social login client IDs are configured

### Debug Mode
Enable debug logging by setting `enableLogging: true` in the Web3Auth configuration.

## Next Steps

1. **Account Abstraction**: Implement gasless transactions
2. **Social Logins**: Configure additional providers
3. **Custom UI**: Style the login modal to match your brand
4. **Analytics**: Track user authentication patterns 