export const ElectionFactory = [
  {
    inputs: [
      {
        internalType: "address",
        name: "router",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "CreatorSponsorshipLimitExceeded",
    type: "error"
  },
  {
    inputs: [],
    name: "ElectionNotSponsored",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidCandidatesLength",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "router",
        type: "address"
      }
    ],
    name: "InvalidRouter",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidSponsorshipAmount",
    type: "error"
  },
  {
    inputs: [],
    name: "NotWhitelistedSender",
    type: "error"
  },
  {
    inputs: [],
    name: "OnlyOwner",
    type: "error"
  },
  {
    inputs: [],
    name: "OwnerRestricted",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string"
      }
    ],
    name: "CreatorBlacklisted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalDeposited",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalWithdrawn",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "activeSponsorships",
        type: "uint256"
      }
    ],
    name: "CreatorSponsorshipUpdated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      }
    ],
    name: "CreatorUnblacklisted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "election",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "sponsorshipAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalCreatorSponsorship",
        type: "uint256"
      }
    ],
    name: "ElectionCreatedWithSponsorship",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "messageId",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "uint64",
        name: "sourceChainSelector",
        type: "uint64"
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "MessageReceived",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldLimit",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newLimit",
        type: "uint256"
      }
    ],
    name: "SponsorshipLimitUpdated",
    type: "event"
  },
  {
    inputs: [],
    name: "MAX_ACTIVE_ELECTIONS_PER_CREATOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MAX_SPONSORSHIP_PER_CREATOR",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "MIN_SPONSORSHIP_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
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
      }
    ],
    name: "createElection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
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
      }
    ],
    name: "createElectionWithSponsorship",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "getOpenElections",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  }
] as const;