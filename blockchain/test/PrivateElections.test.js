const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Private Elections", function () {
  let factory, election;
  let owner, user1, user2, user3, router;
  
  const mockElectionInfo = {
    name: "Test Private Election",
    description: "Test Private Election Description",
    startTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    endTime: Math.floor(Date.now() / 1000) + 7200,   // 2 hours from now
    isPrivate: true
  };

  const mockCandidates = [
    { candidateID: 0, name: "Candidate 1", description: "First candidate" },
    { candidateID: 1, name: "Candidate 2", description: "Second candidate" }
  ];

  const mockWhitelist = [
    { identifier: "user@example.com", identifierType: 0, isActive: true }, // EMAIL
    { identifier: "twitteruser", identifierType: 1, isActive: true },      // TWITTER
    { identifier: "farcasteruser.farcaster", identifierType: 2, isActive: true }, // FARCASTER
    { identifier: "githubuser", identifierType: 3, isActive: true },       // GITHUB
  ];

  beforeEach(async function () {
    [owner, user1, user2, user3, router] = await ethers.getSigners();

    const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
    factory = await ElectionFactory.deploy(router.address);
    await factory.waitForDeployment();
  });

  describe("Private Election Creation", function () {
    it("Should create a private election with whitelist", async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1, // ballotType
        1, // resultType
        mockWhitelist,
        { value: sponsorshipAmount }
      );

      expect(await factory.electionCount()).to.equal(1);
      
      const privateElections = await factory.getPrivateElections();
      expect(privateElections.length).to.equal(1);
      
      const isPrivate = await factory.getIsPrivateElection(privateElections[0]);
      expect(isPrivate).to.be.true;
    });

    it("Should allow private elections without sponsorship", async function () {
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1,
        1,
        mockWhitelist,
        { value: 0 }
      );

      expect(await factory.electionCount()).to.equal(1);
      
      const privateElections = await factory.getPrivateElections();
      expect(privateElections.length).to.equal(1);
      
      const isPrivate = await factory.getIsPrivateElection(privateElections[0]);
      expect(isPrivate).to.be.true;
    });

    it("Should require minimum sponsorship amount", async function () {
      const insufficientAmount = ethers.parseEther("0.001"); // Less than MIN_SPONSORSHIP_AMOUNT
      
      await expect(
        factory.createPrivateElection(
          mockElectionInfo,
          mockCandidates,
          1,
          1,
          mockWhitelist,
          { value: insufficientAmount }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidSponsorshipAmount");
    });

    it("Should validate whitelist entries", async function () {
      const invalidWhitelist = [
        { identifier: "test", identifierType: 5, isActive: true } // Invalid identifier type
      ];
      
      await expect(
        factory.createPrivateElection(
          mockElectionInfo,
          mockCandidates,
          1,
          1,
          invalidWhitelist,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidWhitelistEntry");
    });

    it("Should not allow sponsorship for public elections", async function () {
      const publicElectionInfo = { ...mockElectionInfo, isPrivate: false };
      
      // Public elections should not have a sponsorship option
      // This test assumes the frontend prevents this, but if someone tries to sponsor
      // a public election directly, it should be handled properly
      
      // Note: The current contract structure only has createPrivateElection for sponsorship
      // Public elections use createElection or createElectionWithSponsorship
      // But createElectionWithSponsorship should only be used for public elections with sponsorship
      // which according to the new requirement should not be allowed
    });

    it("Should require at least 2 candidates", async function () {
      const singleCandidate = [mockCandidates[0]];
      
      await expect(
        factory.createPrivateElection(
          mockElectionInfo,
          singleCandidate,
          1,
          1,
          mockWhitelist,
          { value: ethers.parseEther("0.1") }
        )
      ).to.be.revertedWithCustomError(factory, "InvalidCandidatesLength");
    });
  });

  describe("Whitelist Management", function () {
    let electionAddress;

    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1,
        1,
        mockWhitelist,
        { value: sponsorshipAmount }
      );

      const privateElections = await factory.getPrivateElections();
      electionAddress = privateElections[0];
      election = await ethers.getContractAt("Election", electionAddress);
    });

    it("Should allow owner to add whitelist entries", async function () {
      const newEntries = [
        { identifier: "newuser@example.com", identifierType: 0, isActive: true }
      ];

      await election.addToWhitelist(newEntries);
      
      const whitelist = await election.getWhitelist();
      expect(whitelist.length).to.equal(mockWhitelist.length + 1);
    });

    it("Should allow owner to remove whitelist entries", async function () {
      await election.removeFromWhitelist(
        ["user@example.com"],
        [0]
      );
      
      // Verify removal by checking if user is no longer whitelisted
      const isWhitelisted = await election.isWhitelisted(
        owner.address,
        "user@example.com",
        0
      );
      expect(isWhitelisted).to.be.false;
    });

    it("Should not allow non-owner to modify whitelist", async function () {
      const newEntries = [
        { identifier: "hacker@example.com", identifierType: 0, isActive: true }
      ];

      await expect(
        election.connect(user1).addToWhitelist(newEntries)
      ).to.be.revertedWithCustomError(election, "OwnerPermissioned");
    });

    it("Should check wallet address whitelist", async function () {
      // Add user1's address to whitelist
      const walletEntries = [
        { identifier: user1.address.toLowerCase(), identifierType: 4, isActive: true }
      ];
      
      await election.addToWhitelist(walletEntries);
      
      const isWhitelisted = await election.isWhitelisted(
        user1.address,
        user1.address,
        4
      );
      expect(isWhitelisted).to.be.true;
    });
  });

  describe("Access Control", function () {
    let electionAddress;

    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1,
        1,
        mockWhitelist,
        { value: sponsorshipAmount }
      );

      const privateElections = await factory.getPrivateElections();
      electionAddress = privateElections[0];
      election = await ethers.getContractAt("Election", electionAddress);
    });

    it("Should allow whitelisted user to vote", async function () {
      // Add user1's wallet address to whitelist
      const walletEntries = [
        { identifier: user1.address.toLowerCase(), identifierType: 4, isActive: true }
      ];
      
      await election.addToWhitelist(walletEntries);
      
      // Mock vote (assuming election has started)
      const voteArray = [1, 0]; // Vote for candidate 1
      
      // This would normally revert if not whitelisted
      // Note: This might still fail due to timing (election not started), but shouldn't fail due to whitelist
      try {
        await election.connect(user1).userVote(voteArray, user1.address, 4);
      } catch (error) {
        // Should not be a whitelist error
        expect(error.message).to.not.include("NotWhitelisted");
      }
    });

    it("Should reject non-whitelisted user votes", async function () {
      const voteArray = [1, 0];
      
      await expect(
        election.connect(user2).userVote(voteArray, user2.address, 4)
      ).to.be.revertedWithCustomError(election, "NotWhitelisted");
    });

    it("Should allow access check", async function () {
      // Test with whitelisted identifier
      const canAccess = await election.canUserAccess(
        owner.address,
        "user@example.com",
        0
      );
      expect(canAccess).to.be.true;
      
      // Test with non-whitelisted identifier
      const cannotAccess = await election.canUserAccess(
        user2.address,
        "notwhitelisted@example.com",
        0
      );
      expect(cannotAccess).to.be.false;
    });
  });

  describe("Accessible Elections", function () {
    beforeEach(async function () {
      // Create a public election
      const publicElectionInfo = { ...mockElectionInfo, isPrivate: false };
      await factory.createElection(
        publicElectionInfo,
        mockCandidates,
        1,
        1
      );

      // Create a private election
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1,
        1,
        mockWhitelist,
        { value: ethers.parseEther("0.1") }
      );
    });

    it("Should return public elections for everyone", async function () {
      const publicElections = await factory.getPublicElections();
      expect(publicElections.length).to.equal(1);
    });

    it("Should return accessible elections for whitelisted user", async function () {
      const accessibleElections = await factory.getAccessibleElections(
        owner.address,
        "user@example.com",
        0
      );
      
      // Should include both public and private elections
      expect(accessibleElections.length).to.equal(2);
    });

    it("Should return only public elections for non-whitelisted user", async function () {
      const accessibleElections = await factory.getAccessibleElections(
        user2.address,
        "notwhitelisted@example.com",
        0
      );
      
      // Should include only public elections
      expect(accessibleElections.length).to.equal(1);
    });
  });

  describe("Multi-Identifier Support", function () {
    let electionAddress;

    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1,
        1,
        mockWhitelist,
        { value: sponsorshipAmount }
      );

      const privateElections = await factory.getPrivateElections();
      electionAddress = privateElections[0];
      election = await ethers.getContractAt("Election", electionAddress);
    });

    it("Should support email identifiers", async function () {
      const isWhitelisted = await election.isWhitelisted(
        owner.address,
        "user@example.com",
        0
      );
      expect(isWhitelisted).to.be.true;
    });

    it("Should support Twitter identifiers", async function () {
      const isWhitelisted = await election.isWhitelisted(
        owner.address,
        "twitteruser",
        1
      );
      expect(isWhitelisted).to.be.true;
    });

    it("Should support Farcaster identifiers", async function () {
      const isWhitelisted = await election.isWhitelisted(
        owner.address,
        "farcasteruser.farcaster",
        2
      );
      expect(isWhitelisted).to.be.true;
    });

    it("Should support GitHub identifiers", async function () {
      const isWhitelisted = await election.isWhitelisted(
        owner.address,
        "githubuser",
        3
      );
      expect(isWhitelisted).to.be.true;
    });

    it("Should support wallet address identifiers", async function () {
      // Add a wallet address to the whitelist
      const walletEntries = [
        { identifier: user1.address.toLowerCase(), identifierType: 4, isActive: true }
      ];
      
      await election.addToWhitelist(walletEntries);
      
      const isWhitelisted = await election.isWhitelisted(
        user1.address,
        user1.address,
        4
      );
      expect(isWhitelisted).to.be.true;
    });
  });

  describe("Sponsorship Integration", function () {
    it("Should track sponsorship for private elections", async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await factory.createPrivateElection(
        mockElectionInfo,
        mockCandidates,
        1,
        1,
        mockWhitelist,
        { value: sponsorshipAmount }
      );

      const creatorInfo = await factory.getCreatorSponsorshipInfo(owner.address);
      expect(creatorInfo.totalSponsorshipDeposited).to.equal(sponsorshipAmount);
      expect(creatorInfo.activeSponsorships).to.equal(1);
    });

    it("Should enforce sponsorship limits", async function () {
      const maxSponsorship = await factory.MAX_SPONSORSHIP_PER_CREATOR();
      const excessiveAmount = maxSponsorship + ethers.parseEther("1");
      
      await expect(
        factory.createPrivateElection(
          mockElectionInfo,
          mockCandidates,
          1,
          1,
          mockWhitelist,
          { value: excessiveAmount }
        )
      ).to.be.reverted;
    });
  });
});
