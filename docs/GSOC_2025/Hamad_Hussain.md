# Google Summer of Code 2025 Final Project Report

## Student Information

- **Name:** Hamad Hussain
- **GitHub:** [HamadTheDev](https://github.com/HamadTheDev)
- **Social Profiles:** [LinkedIn](https://www.linkedin.com/in/hamadhussain/)
- **Organization:** [Australian Open Source Software Innovation and Education (AOSSIE)](https://www.aossie.org/)
- **Project:** Agora-Blockchain — Web2/Social Login, Account Abstraction & Private Elections

## Abstract

During GSoC 2025, I implemented three major capabilities in the Agora-Blockchain stack:
1) Web2/Social authentication using Web3Auth (Google and other providers),
2) Account Abstraction (ERC‑4337) with optional gasless voting via Pimlico bundler/paymaster,
3) Private elections with multi‑identifier whitelisting and fine‑grained access control.

These features make decentralized voting significantly more accessible while preserving strong privacy and authorization guarantees. Users can log in with familiar social identities, vote without managing gas, and election creators can restrict participation to specific individuals or wallets.

## Technologies Used

- **Frontend**: Next.js (App Router), Tailwind CSS, React, Wagmi, Viem
- **Blockchain**: Solidity, Hardhat, OpenZeppelin, Ethers/Viem
- **AA & Gasless**: ERC‑4337 Smart Accounts, Pimlico Bundler & Paymaster
- **Authentication**: Web3Auth (Torus), Google & social identity providers
- **Tooling**: TypeScript, Jest/Hardhat tests, Docker

## GitHub Repository

[Agora-Blockchain (Monorepo)](https://github.com/aossie/Agora-Blockchain)

## Demos

### Key Flows
1. Social Login + Smart Account initialization
2. Private Election creation with whitelist
3. Gasless (sponsored) vote cast via Smart Account
4. Direct-call fallback vote (when AA is unavailable)

### Test Deployments

- Contracts: Sepolia Testnet (addresses tracked in `client/app/constants.ts` and `blockchain/ignition/deployments`)
- Frontend: Local and containerized runs; public preview as available during evaluations

## Project Description

The work targeted three pillars. Below is the high-level description and concrete artifacts.

### 1) Web2/Social Login with Web3Auth

Implemented a robust Web3Auth integration to derive a reliable user identifier for authorization and UX:
- Extracts social identity (e.g., Google email) from Web3Auth `userInfo`, with resilient detection (handles cases where `typeOfLogin` is undefined by using `groupedAuthConnectionId` / `verifier`).
- Provides wallet fallbacks when social data is unavailable.
- Exposes a simple helper `getCurrentUserIdentifier` used throughout the app.

Primary files:
- `client/app/helpers/userIdentification.ts`
- `client/app/context/Web3AuthContext.tsx`

Outcome: Consistent, debuggable identity information available to the UI and the voting flow.

### 2) Account Abstraction + Gasless Voting

Integrated ERC‑4337 smart accounts with Pimlico bundler/paymaster to enable sponsored voting:
- Uses smart account for `userVote` when sponsorship is enabled.
- Provides detailed logging of the entire user operation lifecycle for diagnosis.
- Falls back to a direct ethers signer call if AA signing is unavailable (ensuring UX continuity).

Primary files:
- `client/app/helpers/smartAccountV2.ts` (UserOp prepare/send, paymaster flow)
- `client/app/components/Modal/Vote.tsx` (encoding via Viem, AA vs direct-call logic)

Outcome: Users can vote without manually funding gas, with a reliable fallback path.

### 3) Private Elections with Multi‑Identifier Whitelisting

Designed and implemented private elections at the contract and frontend layers.

Smart Contracts:
- `Election.sol`
  - `ElectionInfo { name, description, startTime, endTime, isPrivate }`
  - `WhitelistEntry { identifier, identifierType, isActive }` where identifierType: 0=email, 1=twitter, 2=farcaster, 3=github, 4=wallet
  - O(1) whitelist lookup via `keccak256(abi.encode(identifier, identifierType))`
  - Access checks in `userVote` using `isWhitelisted(msg.sender, userIdentifier, identifierType)`
  - `addToWhitelist` permissioned by `onlyOwnerOrFactory`

- `ElectionFactory.sol`
  - `createPrivateElection` enforces `isPrivate=true`, validates whitelist, optionally accepts sponsorship value
  - Maintains public/private registries and exposes getters

Frontend:
- Creation (`client/app/create/page.tsx`)
  - Validates inputs and enhances whitelist by auto-adding creator’s relevant wallets (Web3Auth, wagmi, smart account) as type‑4 entries to satisfy `msg.sender` checks at vote time
  - Uses extended ABIs to match updated contract signatures
  - Provides detailed logs for debugging

- Voting (`client/app/components/Modal/Vote.tsx`)
  - Extracts identifier via Web3Auth, sends `userVote(votes, userIdentifier, identifierType)`
  - Correctly handles `identifierType` using `??` (preserves 0 for email)
  - Selects AA or direct call path; surfaces error context in UI logs

Outcome: Only whitelisted users (by email/social or wallet) can access and vote in private elections; public elections remain open.

## Relevant Pull Requests / Major Changes

1. Smart Contract Enhancements
   - Added private election support (`isPrivate`), whitelist structs, and access checks in `Election.sol`
   - Implemented `createPrivateElection`, sponsorship validation, and getters in `ElectionFactory.sol`

2. Frontend Whitelist & ABI Integration
   - Extended ABIs to include `createPrivateElection` and updated `userVote`
   - Auto-whitelist wallet identities during creation; comprehensive logging across flows

3. Account Abstraction & Fallback Path
   - Implemented sponsored voting via Pimlico; added resilient fallback to direct ethers call

4. Developer Experience & Debuggability
   - Rich console diagnostics; decoding scripts; improved error messages; type fixes

## Challenges and Solutions

1. ABI and Encoding Incompatibilities
   - Issue: Mixed ethers v5/v6 patterns caused encoding/constructor errors and duplicate ABI signatures.
   - Solution: Unified on Viem for encoding; created Extended ABIs; filtered legacy `userVote` signature.

2. Web3Auth Identifier Edge Cases
   - Issue: `typeOfLogin` sometimes undefined.
   - Solution: Added alternative detection via `groupedAuthConnectionId` and `verifier`; logged `userInfo` for clarity.

3. Whitelist vs msg.sender Mismatch
   - Issue: Contract checks both identifier and `msg.sender` for private votes; some wallets weren’t in the list.
   - Solution: Auto-append Web3Auth/wagmi/smart-account addresses (type‑4) to whitelist during creation.

4. AA Signing / Provider Issues
   - Issue: "Unable to find matching address" from Torus in some environments.
   - Solution: Provide robust direct-call fallback so users can still vote; kept logs to isolate infra issues from app logic.

## Future Plans

1. Improve AA provider compatibility and recovery flows
2. Management UI for whitelist (bulk uploads, status toggles, audit trail)
3. Role-based admin actions (delegation, moderators)
4. More ballot/result types and analytics
5. CI scripts to auto-sync ABIs/addresses and smoke-test flows

## Acknowledgements

I’m grateful to my mentors and the AOSSIE community for guidance, code reviews, and rapid feedback loops throughout the summer.


