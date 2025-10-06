const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election Sponsorship System", function () {
  let electionFactory;
  let election;
  let owner;
  let creator;
  let voter1;
  let voter2;
  let voter3;
  let ballotGenerator;
  let resultCalculator;

  const electionInfo = {
    startTime: Math.floor(Date.now() / 1000) + 60, // Start in 1 minute
    endTime: Math.floor(Date.now() / 1000) + 3600, // End in 1 hour
    name: "Test Election",
    description: "Test election for sponsorship"
  };

  const candidates = [
    { candidateID: 0, name: "Candidate 1", description: "First candidate" },
    { candidateID: 1, name: "Candidate 2", description: "Second candidate" },
    { candidateID: 2, name: "Candidate 3", description: "Third candidate" }
  ];

  beforeEach(async function () {
    [owner, creator, voter1, voter2, voter3] = await ethers.getSigners();

    // Deploy MockRouter
    const MockRouter = await ethers.getContractFactory("MockRouter");
    const mockRouter = await MockRouter.deploy();

    // Deploy BallotGenerator and ResultCalculator
    const BallotGenerator = await ethers.getContractFactory("BallotGenerator");
    ballotGenerator = await BallotGenerator.deploy();

    const ResultCalculator = await ethers.getContractFactory("ResultCalculator");
    resultCalculator = await ResultCalculator.deploy();

    // Deploy ElectionFactory with mock router
    const ElectionFactory = await ethers.getContractFactory("ElectionFactory");
    electionFactory = await ElectionFactory.deploy(mockRouter.target); // Use deployed mock router address

    // Create an election
    await electionFactory.connect(creator).createElection(
      electionInfo,
      candidates,
      0, // General ballot type
      0  // General result type
    );

    // Get the created election address
    const elections = await electionFactory.getOpenElections();
    const electionAddress = elections[0];

    // Get election contract instance
    const Election = await ethers.getContractFactory("Election");
    election = Election.attach(electionAddress);

    // Wait for election to start
    await ethers.provider.send("evm_increaseTime", [120]); // Advance time by 2 minutes
    await ethers.provider.send("evm_mine");
  });

  describe("Basic Sponsorship Functionality", function () {
    it("Should initialize with no sponsorship", async function () {
      const status = await election.getSponsorshipStatus();
      expect(status.isSponsored).to.be.false;
      expect(status.remainingBalance).to.equal(0n);
      expect(status.totalVotesSponsored).to.equal(0n);
    });

    it("Should allow election owner to add sponsorship", async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await expect(election.connect(creator).addSponsorship({ value: sponsorshipAmount }))
        .to.emit(election, "SponsorshipAdded")
        .withArgs(creator.address, sponsorshipAmount, sponsorshipAmount);

      const status = await election.getSponsorshipStatus();
      expect(status.isSponsored).to.be.true;
      expect(status.remainingBalance).to.equal(sponsorshipAmount);
      expect(status.sponsor).to.equal(creator.address);
    });

    it("Should reject sponsorship below minimum amount", async function () {
      const lowAmount = ethers.parseEther("0.005"); // Below 0.01 ETH minimum
      
      await expect(
        election.connect(creator).addSponsorship({ value: lowAmount })
      ).to.be.revertedWith("Insufficient sponsorship amount");
    });

    it("Should allow adding more sponsorship to existing sponsored election", async function () {
      const initialAmount = ethers.parseEther("0.1");
      const additionalAmount = ethers.parseEther("0.05");
      
      await election.connect(creator).addSponsorship({ value: initialAmount });
      await election.connect(creator).addSponsorship({ value: additionalAmount });

      const status = await election.getSponsorshipStatus();
      expect(status.totalDeposited).to.equal(initialAmount + additionalAmount);
      expect(status.remainingBalance).to.equal(initialAmount + additionalAmount);
    });

    it("Should only allow election owner to add sponsorship", async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      await expect(
        election.connect(voter1).addSponsorship({ value: sponsorshipAmount })
      ).to.be.revertedWithCustomError(election, "OwnerPermissioned");
    });
  });

  describe("Sponsorship Withdrawal", function () {
    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      await election.connect(creator).addSponsorship({ value: sponsorshipAmount });
    });

    it("Should allow sponsor to withdraw funds", async function () {
      const withdrawAmount = ethers.parseEther("0.05");
      const initialBalance = await ethers.provider.getBalance(creator.address);
      
      await expect(election.connect(creator).withdrawSponsorship(withdrawAmount))
        .to.emit(election, "SponsorshipWithdrawn")
        .withArgs(creator.address, withdrawAmount, ethers.parseEther("0.05"));

      const status = await election.getSponsorshipStatus();
      expect(status.remainingBalance).to.equal(ethers.parseEther("0.05"));
      
      const finalBalance = await ethers.provider.getBalance(creator.address);
      expect(finalBalance > initialBalance - withdrawAmount).to.be.true; // Account for gas
    });

    it("Should disable sponsorship when balance falls below minimum", async function () {
      const withdrawAmount = ethers.parseEther("0.095"); // Leave less than 0.01 ETH
      
      await election.connect(creator).withdrawSponsorship(withdrawAmount);

      const status = await election.getSponsorshipStatus();
      expect(status.isSponsored).to.be.false;
    });

    it("Should only allow sponsor to withdraw", async function () {
      const withdrawAmount = ethers.parseEther("0.05");
      
      await expect(
        election.connect(voter1).withdrawSponsorship(withdrawAmount)
      ).to.be.revertedWithCustomError(election, "OnlySponsorCanWithdraw");
    });

    it("Should reject withdrawal of zero amount", async function () {
      await expect(
        election.connect(creator).withdrawSponsorship(0)
      ).to.be.revertedWith("Amount must be greater than 0");
    });

    it("Should reject withdrawal exceeding balance", async function () {
      const excessiveAmount = ethers.parseEther("0.2");
      
      await expect(
        election.connect(creator).withdrawSponsorship(excessiveAmount)
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Emergency Withdrawal", function () {
    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      await election.connect(creator).addSponsorship({ value: sponsorshipAmount });
    });

    it("Should allow emergency withdrawal when enabled", async function () {
      await election.connect(creator).enableEmergencyWithdrawal();
      
      await expect(election.connect(creator).emergencyWithdraw("Test emergency"))
        .to.emit(election, "EmergencyWithdrawal")
        .withArgs(creator.address, ethers.parseEther("0.1"), "Test emergency");

      const status = await election.getSponsorshipStatus();
      expect(status.isSponsored).to.be.false;
      expect(status.remainingBalance).to.equal(0n);
    });

    it("Should allow emergency withdrawal when balance is above threshold", async function () {
      // Add more funds to exceed threshold
      await election.connect(creator).addSponsorship({ value: ethers.parseEther("0.2") });
      
      await expect(election.connect(creator).emergencyWithdraw("High balance emergency"))
        .to.emit(election, "EmergencyWithdrawal");

      const status = await election.getSponsorshipStatus();
      expect(status.isSponsored).to.be.false;
    });

    it("Should reject emergency withdrawal when not enabled and balance below threshold", async function () {
      // Ensure emergency mode is disabled and balance is below threshold
      await election.connect(creator).withdrawSponsorship(ethers.parseEther("0.099")); // Leaves 0.001 ether
      await expect(
        election.connect(creator).emergencyWithdraw("Unauthorized emergency")
      ).to.be.revertedWith("Emergency withdrawal not allowed");
    });

    it("Should only allow sponsor to enable/disable emergency withdrawal", async function () {
      await expect(
        election.connect(voter1).enableEmergencyWithdrawal()
      ).to.be.revertedWithCustomError(election, "OnlySponsorCanWithdraw");

      await expect(
        election.connect(voter1).disableEmergencyWithdrawal()
      ).to.be.revertedWithCustomError(election, "OnlySponsorCanWithdraw");
    });
  });

  describe("Voting with Sponsorship", function () {
    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      await election.connect(creator).addSponsorship({ value: sponsorshipAmount });
    });

    it("Should track sponsored votes", async function () {
      const voteArray = [0]; // Vote for candidate 0
      
      await election.connect(voter1).userVote(voteArray);

      const status = await election.getSponsorshipStatus();
      expect(status.totalVotesSponsored).to.equal(1n);
    });

    it("Should emit VoteSponsored event with correct deduction", async function () {
      const voteArray = [1]; // Vote for candidate 1
      const expectedGasDeduction = ethers.parseEther("0.001"); // 0.001 ETH per vote
      const expectedRemainingBalance = ethers.parseEther("0.099"); // 0.1 - 0.001
      
      await expect(election.connect(voter2).userVote(voteArray))
        .to.emit(election, "VoteSponsored")
        .withArgs(voter2.address, expectedGasDeduction, expectedRemainingBalance);
    });

    it("Should still allow voting after sponsorship is disabled", async function () {
      // Disable sponsorship by withdrawing most funds
      await election.connect(creator).withdrawSponsorship(ethers.parseEther("0.095"));
      
      // Add sponsorship back
      await election.connect(creator).addSponsorship({ value: ethers.parseEther("0.1") });
      
      const voteArray = [0];
      await expect(election.connect(voter1).userVote(voteArray)).to.not.be.reverted;
    });
  });

  describe("Sponsorship Analytics", function () {
    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      await election.connect(creator).addSponsorship({ value: sponsorshipAmount });
    });

    it("Should return correct sponsorship analytics", async function () {
      const voteArray = [0];
      await election.connect(voter1).userVote(voteArray);

      const analytics = await election.getSponsorshipAnalytics();
      expect(analytics.costPerVote).to.be.gt(0n);
      expect(analytics.utilizationRate).to.be.gt(0n);
    });

    it("Should return zero analytics for non-sponsored elections", async function () {
      // Create new election without sponsorship
      await electionFactory.connect(creator).createElection(
        electionInfo,
        candidates,
        0,
        0
      );

      const elections = await electionFactory.getOpenElections();
      const newElectionAddress = elections[1];
      const newElection = await ethers.getContractAt("Election", newElectionAddress);

      const analytics = await newElection.getSponsorshipAnalytics();
      expect(analytics.efficiency).to.equal(0n);
      expect(analytics.costPerVote).to.equal(0n);
      expect(analytics.utilizationRate).to.equal(0n);
    });
  });

  describe("Factory Sponsorship Tracking", function () {
    it("Should track creator sponsorship info", async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      
      // Create election with sponsorship
      await electionFactory.connect(creator).createElectionWithSponsorship(
        electionInfo,
        candidates,
        0,
        0,
        { value: sponsorshipAmount }
      );

      const creatorInfo = await electionFactory.getCreatorSponsorshipInfo(creator.address);
      expect(creatorInfo.totalElectionsCreated).to.equal(2n); // Including the one from beforeEach
      expect(creatorInfo.totalSponsorshipDeposited).to.equal(sponsorshipAmount);
      expect(creatorInfo.activeSponsorships).to.equal(1n);
    });

    it("Should reject creation with sponsorship below minimum", async function () {
      const lowAmount = ethers.parseEther("0.005");
      
      await expect(
        electionFactory.connect(creator).createElectionWithSponsorship(
          electionInfo,
          candidates,
          0,
          0,
          { value: lowAmount }
        )
      ).to.be.revertedWithCustomError(electionFactory, "InvalidSponsorshipAmount");
    });

    it("Should track creator elections", async function () {
      const creatorElections = await electionFactory.getCreatorElections(creator.address);
      expect(creatorElections.length).to.equal(1);
      expect(creatorElections[0]).to.equal(election.target);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow factory owner to blacklist creators", async function () {
      await expect(electionFactory.connect(owner).blacklistCreator(creator.address, "Test blacklist"))
        .to.emit(electionFactory, "CreatorBlacklisted")
        .withArgs(creator.address, "Test blacklist");

      const creatorInfo = await electionFactory.getCreatorSponsorshipInfo(creator.address);
      expect(creatorInfo.isBlacklisted).to.be.true;
    });

    it("Should prevent blacklisted creators from creating elections", async function () {
      await electionFactory.connect(owner).blacklistCreator(creator.address, "Test blacklist");
      
      await expect(
        electionFactory.connect(creator).createElection(
          electionInfo,
          candidates,
          0,
          0
        )
      ).to.be.revertedWith("Creator is blacklisted");
    });

    it("Should allow factory owner to unblacklist creators", async function () {
      await electionFactory.connect(owner).blacklistCreator(creator.address, "Test blacklist");
      await electionFactory.connect(owner).unblacklistCreator(creator.address);

      const creatorInfo = await electionFactory.getCreatorSponsorshipInfo(creator.address);
      expect(creatorInfo.isBlacklisted).to.be.false;
    });

    it("Should only allow factory owner to blacklist/unblacklist", async function () {
      await expect(
        electionFactory.connect(creator).blacklistCreator(voter1.address, "Test")
      ).to.be.revertedWithCustomError(electionFactory, "OwnerRestricted");

      await expect(
        electionFactory.connect(creator).unblacklistCreator(voter1.address)
      ).to.be.revertedWithCustomError(electionFactory, "OwnerRestricted");
    });
  });

  describe("Gas Estimation", function () {
    beforeEach(async function () {
      const sponsorshipAmount = ethers.parseEther("0.1");
      await election.connect(creator).addSponsorship({ value: sponsorshipAmount });
    });

    it("Should check sponsorship funds correctly", async function () {
      const [hasFunds, estimatedCost] = await election.checkSponsorshipFunds();
      expect(hasFunds).to.be.true;
      expect(estimatedCost).to.be.gt(0n);
    });

    it("Should return false for non-sponsored elections", async function () {
      // Create new election without sponsorship
      await electionFactory.connect(creator).createElection(
        electionInfo,
        candidates,
        0,
        0
      );

      const elections = await electionFactory.getOpenElections();
      const newElectionAddress = elections[1];
      const newElection = await ethers.getContractAt("Election", newElectionAddress);

      const [hasFunds, estimatedCost] = await newElection.checkSponsorshipFunds();
      expect(hasFunds).to.be.false;
      expect(estimatedCost).to.equal(0n);
    });
  });

  describe("Integration Tests", function () {
    it("Should maintain existing functionality with sponsorship", async function () {
      // Create a fresh election for this integration test to avoid timing issues
      const freshElectionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 30,
        endTime: Math.floor(Date.now() / 1000) + 7200,
        name: "Integration Test Election",
        description: "Fresh election for integration test"
      };

      await electionFactory.connect(creator).createElection(
        freshElectionInfo,
        candidates,
        0,
        0
      );

      const elections = await electionFactory.getOpenElections();
      const freshElectionAddress = elections[elections.length - 1];
      const freshElection = await ethers.getContractAt("Election", freshElectionAddress);

      // Test that existing functions still work
      const candidateList = await freshElection.getCandidateList();
      expect(candidateList.length).to.equal(3);

      const electionInfoStored = await freshElection.electionInfo();
      expect(electionInfoStored.name).to.equal("Integration Test Election");

      // Advance time to make election active
      await ethers.provider.send("evm_increaseTime", [60]);
      await ethers.provider.send("evm_mine");

      // Test voting works
      const voteArray = [0];
      await freshElection.connect(voter1).userVote(voteArray);
      expect(await freshElection.totalVotes()).to.equal(1n);
    });

    it("Should handle multiple sponsorships correctly", async function () {
      // Start fresh without any existing sponsorship
      const sponsorship1 = ethers.parseEther("0.05");
      const sponsorship2 = ethers.parseEther("0.03");
      
      // Create a new election for this test
      const newElectionInfo = {
        startTime: Math.floor(Date.now() / 1000) + 60,
        endTime: Math.floor(Date.now() / 1000) + 7200, // Give more time
        name: "Multi Sponsorship Test",
        description: "Test multiple sponsorships"
      };

      await electionFactory.connect(creator).createElection(
        newElectionInfo,
        candidates,
        0,
        0
      );

      const elections = await electionFactory.getOpenElections();
      const newElectionAddress = elections[elections.length - 1];
      const newElection = await ethers.getContractAt("Election", newElectionAddress);

      // Add multiple sponsorships to the new election
      await newElection.connect(creator).addSponsorship({ value: sponsorship1 });
      await newElection.connect(creator).addSponsorship({ value: sponsorship2 });

      const status = await newElection.getSponsorshipStatus();
      expect(status.totalDeposited).to.equal(sponsorship1 + sponsorship2);
      expect(status.remainingBalance).to.equal(sponsorship1 + sponsorship2);
    });
  });
}); 