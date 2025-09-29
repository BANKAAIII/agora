## Private Elections: Design and Working Logic

This document explains the complete design and working of Private Elections in this repository, including smart contract logic, data structures, frontend flows, and troubleshooting notes.

### Goals
- Only whitelisted users can view and vote in private elections
- Public elections remain visible and votable by everyone
- Multi-identifier whitelisting (email, Twitter, Farcaster, GitHub, wallet address)
- Optional sponsorship (gasless voting) is allowed only for private elections

### Key Components
- Contracts: `Election.sol`, `ElectionFactory.sol`
- Frontend: `client/app/create/page.tsx`, `client/app/components/Modal/Vote.tsx`
- ABIs: `ExtendedElectionABI`, `ExtendedElectionFactoryABI`
- Auth: Web3Auth (Google and other socials), Wagmi wallet
- Account Abstraction: Pimlico Paymaster (optional gasless)

---

## Smart Contract Design

### ElectionInfo
The `Election` contract stores high-level metadata including privacy:

```solidity
struct ElectionInfo {
    string name;
    string description;
    uint256 startTime;
    uint256 endTime;
    bool isPrivate; // true for private elections
}
```

### Multi-Identifier Whitelisting

```solidity
// IdentifierType: 0=email, 1=twitter, 2=farcaster, 3=github, 4=wallet
struct WhitelistEntry {
    string identifier;     // email/user handle or wallet address string
    uint8 identifierType;  // see mapping above
    bool isActive;         // enable/disable without deleting
}
```

Storage:
- `WhitelistEntry[] whitelist` (enumerable list)
- `mapping(bytes32 => bool) whitelistLookup` for O(1) checks
  - Key = keccak256(abi.encode(identifier, identifierType))

Validation helper:

```solidity
function isWhitelisted(address user, string memory userIdentifier, uint8 identifierType) public view returns (bool)
```

Checks pass if ANY of these are true:
- `identifierType==4` and `identifier == toLowerHex(user)` (wallet allowed), or
- `(userIdentifier, identifierType)` exists and is active in whitelist, or
- `(user, 4)` was explicitly added as wallet identifier

### Access Control and Errors
- Private election voting requires `isWhitelisted(msg.sender, userIdentifier, identifierType)`
- Custom errors:
  - `NotWhitelisted()` when access fails
  - `InvalidIdentifierType()` for malformed types
  - `InvalidWhitelistEntry()` when factory validates entries

### Factory Responsibilities
- `createElection` for public elections
- `createPrivateElection` for private elections
  - Validates whitelist entries (non-empty identifiers, valid types)
  - Initializes `Election` with `isPrivate=true`
  - Calls `addToWhitelist` on the new `Election`
  - Optional sponsorship funds via `msg.value` (must meet minimum if provided)

Notes:
- `Election.addToWhitelist` is callable by owner OR factory via `onlyOwnerOrFactory` modifier
- Factory tracks public vs private sets and can return accessible lists

---

## Frontend Flow

### Creation (`client/app/create/page.tsx`)
1. Creator fills basic info, candidate list, time window
2. Chooses privacy (public/private) and optional sponsorship amount (only enabled for private)
3. For private elections, enters initial whitelist entries (e.g., emails)
4. Frontend automatically enhances whitelist by adding the creator’s wallet identities as wallet-type entries (type 4):
   - Web3Auth EOA address (when available)
   - Wagmi-connected wallet (if different)
   - Smart account address (if different)
5. Calls `createPrivateElection` with:
   - `ElectionInfo` (with `isPrivate=true`)
   - `Candidate[]`
   - Ballot and result type
   - Enhanced `WhitelistEntry[]`
   - Optional `value` when sponsoring

Rationale: voting checks `msg.sender` as well as social identifier. Adding wallet addresses ensures the owner and intended voters can pass access control even when using different signing paths.

### Viewing and Listing
- Public list is available to all
- Private elections are filtered on the frontend according to the user’s access capability (derived via identifier + connected wallet)

### Voting (`client/app/components/Modal/Vote.tsx`)
1. On mount, determine user identifier via Web3Auth:
   - Prefer email for Google (IdentifierType = 0)
   - Fallback to wallet where necessary (IdentifierType = 4)
2. When user clicks Vote:
   - Encodes call to `Election.userVote(uint256[] votes, string userIdentifier, uint8 identifierType)`
   - Attempts gasless path via smart account and paymaster
   - If smart account path fails for environment reasons, falls back to direct wallet call via ethers signer
3. Contract enforces access via `isWhitelisted` and reverts with `NotWhitelisted()` when user is not allowed

Important frontend detail: when passing `identifierType`, the code uses the nullish coalescing operator `??` instead of logical OR `||` to preserve `0` for email (since `0 || 4` would incorrectly become `4`).

---

## Sponsorship Rules
- Public elections: cannot be sponsored
- Private elections: may be sponsored (optional)
- If `msg.value > 0`, factory checks a minimum amount (configurable) and forwards logic accordingly

---

## Events and Observability
Factory emits dedicated events for public vs private creations. Extensive frontend logs trace:
- Creation form values and validation
- Selected function and encoded calldata sizes
- Whitelist composition before submit
- Voting identifiers and type selection
- Smart-account vs direct-call execution paths and errors

---

## Common Errors and Resolutions

- `NotWhitelisted()` / `0x584a7938` / `execution reverted: XJy8`
  - Cause: user’s email/handle/wallet not present or inactive in whitelist
  - Fix: Add correct identifier (email preferred) and/or the calling wallet address as type `4`

- Gasless path: `TypedMessageController Signature: failed to sign message Torus Keyring - Unable to find matching address`
  - Cause: Environment/provider mismatch in smart account signing
  - Status: Not related to private election logic; the direct wallet call path works and is provided as a fallback

- ABI mismatch errors (`no matching function` / multiple matching `userVote`)
  - Cause: Outdated frontend ABI
  - Fix: Use `ExtendedElectionABI` / `ExtendedElectionFactoryABI` and ensure old `userVote` signature is filtered out

---

## Integration Notes

- Web3Auth identifier extraction handles provider quirks (e.g., `typeOfLogin` may be undefined). For Google, we detect via `groupedAuthConnectionId` or `verifier` and use `userInfo.email`.
- When building arguments, always ensure `identifierType` is preserved as `0` for email by using `??` (not `||`).
- The fallback direct call via ethers is intentionally included to guarantee a working path even if smart account signing is unavailable.

---

## Quick Reference (Pseudocode)

```typescript
// Creation (private)
const electionInfo = { name, description, startTime, endTime, isPrivate: true };
const enhancedWhitelist = [ ...userEntries, ...autoAddedWallets ];
factory.createPrivateElection(electionInfo, candidates, ballotType, resultType, enhancedWhitelist, { value });

// Voting
const identifier = resolveFromWeb3AuthOrWallet(); // { value, type }
election.userVote(votesArray, identifier.value, identifier.type);
```

---

## Summary
Private Elections are enforced at the contract layer via multi-identifier whitelisting and a strict `isPrivate` flag, with a robust frontend that: extracts reliable social identifiers, auto-whitelists relevant wallets, and offers both gasless (AA) and direct-call paths. Sponsorship is available only for private elections.


