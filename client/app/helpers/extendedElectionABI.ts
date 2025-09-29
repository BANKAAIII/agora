import { Election } from "../../abi/artifacts/Election";

// Extended Election ABI with new private election functions
export const ExtendedElectionABI = [
  // Include all Election functions except the old userVote
  ...Election.filter((item: any) => !(item.name === "userVote" && item.inputs?.length === 1)),
  // Updated userVote function with user identification
  {
    inputs: [
      {
        internalType: "uint256[]",
        name: "voteArr",
        type: "uint256[]"
      },
      {
        internalType: "string",
        name: "userIdentifier",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "identifierType",
        type: "uint8"
      }
    ],
    name: "userVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // Whitelist management functions
  {
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "identifier",
            type: "string"
          },
          {
            internalType: "uint8",
            name: "identifierType",
            type: "uint8"
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool"
          }
        ],
        internalType: "struct Election.WhitelistEntry[]",
        name: "entries",
        type: "tuple[]"
      }
    ],
    name: "addToWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "identifiers",
        type: "string[]"
      },
      {
        internalType: "uint8[]",
        name: "identifierTypes",
        type: "uint8[]"
      }
    ],
    name: "removeFromWhitelist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "string",
        name: "userIdentifier",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "identifierType",
        type: "uint8"
      }
    ],
    name: "isWhitelisted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "string",
        name: "userIdentifier",
        type: "string"
      },
      {
        internalType: "uint8",
        name: "identifierType",
        type: "uint8"
      }
    ],
    name: "canUserAccess",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getWhitelist",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "identifier",
            type: "string"
          },
          {
            internalType: "uint8",
            name: "identifierType",
            type: "uint8"
          },
          {
            internalType: "bool",
            name: "isActive",
            type: "bool"
          }
        ],
        internalType: "struct Election.WhitelistEntry[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  // New errors
  {
    inputs: [],
    name: "NotWhitelisted",
    type: "error"
  },
  {
    inputs: [],
    name: "ElectionIsPrivate",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidIdentifierType",
    type: "error"
  },
  // New events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "identifier",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "identifierType",
        type: "uint8"
      }
    ],
    name: "WhitelistEntryAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "string",
        name: "identifier",
        type: "string"
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "identifierType",
        type: "uint8"
      }
    ],
    name: "WhitelistEntryRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "PrivateElectionCreated",
    type: "event"
  }
] as const;

