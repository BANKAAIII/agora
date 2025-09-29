import { ElectionFactory } from "../../abi/artifacts/ElectionFactory";

// Extended ABI with new private election functions
export const ExtendedElectionFactoryABI = [
  ...ElectionFactory,
  // Add createPrivateElection function
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256"
          },
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "description",
            type: "string"
          },
          {
            internalType: "bool",
            name: "isPrivate",
            type: "bool"
          }
        ],
        internalType: "struct Election.ElectionInfo",
        name: "_electionInfo",
        type: "tuple"
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "candidateID",
            type: "uint256"
          },
          {
            internalType: "string",
            name: "name",
            type: "string"
          },
          {
            internalType: "string",
            name: "description",
            type: "string"
          }
        ],
        internalType: "struct Election.Candidate[]",
        name: "_candidates",
        type: "tuple[]"
      },
      {
        internalType: "uint256",
        name: "_ballotType",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_resultType",
        type: "uint256"
      },
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
        name: "_whitelist",
        type: "tuple[]"
      }
    ],
    name: "createPrivateElection",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  // Add getAccessibleElections function
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
    name: "getAccessibleElections",
    outputs: [
      {
        internalType: "address[]",
        name: "accessibleElections",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  // Add getPrivateElections function
  {
    inputs: [],
    name: "getPrivateElections",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  // Add getPublicElections function  
  {
    inputs: [],
    name: "getPublicElections",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  // Add getIsPrivateElection function
  {
    inputs: [
      {
        internalType: "address",
        name: "electionAddress",
        type: "address"
      }
    ],
    name: "getIsPrivateElection",
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
  // Add new errors
  {
    inputs: [],
    name: "InvalidWhitelistEntry",
    type: "error"
  },
  {
    inputs: [],
    name: "PrivateElectionRequiresSponsorship",
    type: "error"
  },
  // Add new events
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "election",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      }
    ],
    name: "PrivateElectionCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "election",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      }
    ],
    name: "PublicElectionCreated",
    type: "event"
  }
] as const;

