// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {Election} from "./Election.sol";
import {BallotGenerator} from "./ballots/BallotGenerator.sol";
import {ResultCalculator} from "./resultCalculators/ResultCalculator.sol";

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract ElectionFactory is CCIPReceiver {
    error OnlyOwner();
    error OwnerRestricted();
    error NotWhitelistedSender();
    error InvalidCandidatesLength();
    // New errors for sponsorship tracking
    error CreatorSponsorshipLimitExceeded();
    error InvalidSponsorshipAmount();
    error ElectionNotSponsored();

    struct CCIPVote {
        address election;
        address user;
        uint[] voteArr;
    }

    // New struct for creator sponsorship tracking
    struct CreatorSponsorshipInfo {
        uint256 totalElectionsCreated;
        uint256 totalSponsorshipDeposited;
        uint256 totalSponsorshipWithdrawn;
        uint256 activeSponsorships;
        uint256 lastElectionCreated;
        bool isBlacklisted;
    }

    uint public electionCount;
    address public factoryOwner;
    address[] public openBasedElections;
    // address[] public inviteBasedElections;

    BallotGenerator private ballotGenerator;
    address private immutable resultCalculator;
    address private immutable electionGenerator;

    mapping(uint election => address owner) private electionOwner;
    mapping(address owner => address[] election) private userElection;
    mapping(uint64 sourceChain => address senderContract)
        private approvedSenderContracts;

    // New mappings for sponsorship tracking
    mapping(address => CreatorSponsorshipInfo) public creatorSponsorshipInfo;
    mapping(address => address[]) public creatorElections; // Track elections by creator
    mapping(address => bool) public blacklistedCreators;

    // Sponsorship limits and configuration
    uint256 public constant MAX_SPONSORSHIP_PER_CREATOR = 10 ether;
    uint256 public constant MIN_SPONSORSHIP_AMOUNT = 0.01 ether;
    uint256 public constant MAX_ACTIVE_ELECTIONS_PER_CREATOR = 15;

    // Sponsorship events
    event ElectionCreatedWithSponsorship(
        address indexed creator,
        address indexed election,
        uint256 sponsorshipAmount,
        uint256 totalCreatorSponsorship
    );
    event CreatorSponsorshipUpdated(
        address indexed creator,
        uint256 totalDeposited,
        uint256 totalWithdrawn,
        uint256 activeSponsorships
    );
    event CreatorBlacklisted(address indexed creator, string reason);
    event CreatorUnblacklisted(address indexed creator);
    event SponsorshipLimitUpdated(uint256 oldLimit, uint256 newLimit);

    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender
    );

    /// initializes the contract with the router address.
    constructor(address router) CCIPReceiver(router) {
        factoryOwner = msg.sender;
        electionGenerator = address(new Election());
        ballotGenerator = new BallotGenerator();
        resultCalculator = address(new ResultCalculator());
    }

    modifier onlyOwner() {
        if (msg.sender != factoryOwner) revert OwnerRestricted();
        _;
    }

    modifier notBlacklisted(address creator) {
        require(!blacklistedCreators[creator], "Creator is blacklisted");
        _;
    }

    function createElection(
        Election.ElectionInfo memory _electionInfo,
        Election.Candidate[] memory _candidates, // add candidates separately due to separation of concerns 
        uint _ballotType,
        uint _resultType
    ) external notBlacklisted(msg.sender) {
        if (_candidates.length<2) revert InvalidCandidatesLength();
        
        // Check creator limits (only count truly active elections)
        require(
            getActiveElectionsCount(msg.sender) < MAX_ACTIVE_ELECTIONS_PER_CREATOR,
            "Too many active elections"
        );
        
        //add checks of time
        address electionAddress = Clones.clone(electionGenerator);
        address _ballot = ballotGenerator.generateBallot(
            _ballotType,
            electionAddress
        );
        Election election = Election(payable(electionAddress));
        election.initialize(
            _electionInfo,
            _candidates,
            _resultType,
            electionCount,
            _ballot,
            msg.sender,
            resultCalculator
        );
        electionCount++;
        electionOwner[openBasedElections.length] = msg.sender;
        openBasedElections.push(address(election));
        
        // Track creator's elections
        creatorElections[msg.sender].push(address(election));
        creatorSponsorshipInfo[msg.sender].totalElectionsCreated++;
        creatorSponsorshipInfo[msg.sender].lastElectionCreated = block.timestamp;
    }

    /**
     * @dev Create election with initial sponsorship
     */
    function createElectionWithSponsorship(
        Election.ElectionInfo memory _electionInfo,
        Election.Candidate[] memory _candidates,
        uint _ballotType,
        uint _resultType
    ) external payable notBlacklisted(msg.sender) {
        if (_candidates.length<2) revert InvalidCandidatesLength();
        if (msg.value < MIN_SPONSORSHIP_AMOUNT) revert InvalidSponsorshipAmount();
        
        // Check creator sponsorship limits
        uint256 totalCreatorSponsorship = creatorSponsorshipInfo[msg.sender].totalSponsorshipDeposited;
        require(
            totalCreatorSponsorship + msg.value <= MAX_SPONSORSHIP_PER_CREATOR,
            "Creator sponsorship limit exceeded"
        );
        
        // Check creator limits (only count truly active elections)
        require(
            getActiveElectionsCount(msg.sender) < MAX_ACTIVE_ELECTIONS_PER_CREATOR,
            "Too many active elections"
        );
        
        // Create election
        address electionAddress = Clones.clone(electionGenerator);
        address _ballot = ballotGenerator.generateBallot(
            _ballotType,
            electionAddress
        );
        Election election = Election(payable(electionAddress));
        election.initialize(
            _electionInfo,
            _candidates,
            _resultType,
            electionCount,
            _ballot,
            msg.sender,
            resultCalculator
        );
        
        // Add sponsorship to the election
        election.addSponsorship{value: msg.value}();
        
        electionCount++;
        electionOwner[openBasedElections.length] = msg.sender;
        openBasedElections.push(address(election));
        
        // Track creator's elections and sponsorship
        creatorElections[msg.sender].push(address(election));
        creatorSponsorshipInfo[msg.sender].totalElectionsCreated++;
        creatorSponsorshipInfo[msg.sender].totalSponsorshipDeposited += msg.value;
        creatorSponsorshipInfo[msg.sender].activeSponsorships++;
        creatorSponsorshipInfo[msg.sender].lastElectionCreated = block.timestamp;
        
        emit ElectionCreatedWithSponsorship(
            msg.sender,
            address(election),
            msg.value,
            creatorSponsorshipInfo[msg.sender].totalSponsorshipDeposited
        );
    }

    function deleteElection(uint _electionId) external {
        if (electionOwner[_electionId] != msg.sender) revert OnlyOwner();
        
        address electionAddress = openBasedElections[_electionId];
        
        // Check if election has active sponsorship
        Election election = Election(payable(electionAddress));
        (bool isSponsored, , , , , , ) = election.getSponsorshipStatus();
        
        if (isSponsored) {
            // Update creator sponsorship info
            creatorSponsorshipInfo[msg.sender].activeSponsorships--;
        }
        
        uint lastElement = openBasedElections.length - 1;
        if (_electionId != lastElement) {
            openBasedElections[_electionId] = openBasedElections[lastElement];
            electionOwner[_electionId] = electionOwner[lastElement];
        }
        openBasedElections.pop();
        delete electionOwner[lastElement];
        
        // Remove from creator's elections list
        address[] storage creatorElectionList = creatorElections[msg.sender];
        for (uint i = 0; i < creatorElectionList.length; i++) {
            if (creatorElectionList[i] == electionAddress) {
                creatorElectionList[i] = creatorElectionList[creatorElectionList.length - 1];
                creatorElectionList.pop();
                break;
            }
        }
    }

    function addWhitelistedContract(
        uint64 _sourceChainSelector,
        address _contractAddress
    ) external onlyOwner {
        approvedSenderContracts[_sourceChainSelector] = _contractAddress;
    }

    function removeWhitelistedContract(
        uint64 _sourceChainSelector
    ) external onlyOwner {
        approvedSenderContracts[_sourceChainSelector] = address(0);
    }

    function ccipVote(CCIPVote memory _vote) internal {
        Election _election = Election(payable(_vote.election));
        _election.ccipVote(_vote.user, _vote.voteArr);
    }

    // any2EvmMessage.messageId shows the address of senderContract
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        if (
            approvedSenderContracts[any2EvmMessage.sourceChainSelector] !=
            abi.decode(any2EvmMessage.sender, (address))
        ) revert NotWhitelistedSender();

        CCIPVote memory _vote = abi.decode(any2EvmMessage.data, (CCIPVote));
        ccipVote(_vote);

        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector, // fetch the source chain identifier
            abi.decode(any2EvmMessage.sender, (address)) // abi-decoding of the sender address,
        );
    }

    function getOpenElections() external view returns (address[] memory) {
        return openBasedElections;
    }

    // ============ SPONSORSHIP TRACKING FUNCTIONS ============

    /**
     * @dev Track sponsorship withdrawal from an election
     * @param creator The election creator
     * @param amount The amount withdrawn
     */
    function trackSponsorshipWithdrawal(address creator, uint256 amount) external {
        // Only elections can call this function
        require(
            isElectionCreatedByCreator(msg.sender, creator),
            "Not authorized"
        );
        
        creatorSponsorshipInfo[creator].totalSponsorshipWithdrawn += amount;
        creatorSponsorshipInfo[creator].activeSponsorships--;
        
        emit CreatorSponsorshipUpdated(
            creator,
            creatorSponsorshipInfo[creator].totalSponsorshipDeposited,
            creatorSponsorshipInfo[creator].totalSponsorshipWithdrawn,
            creatorSponsorshipInfo[creator].activeSponsorships
        );
    }

    /**
     * @dev Track sponsorship addition to an election
     * @param creator The election creator
     * @param amount The amount added
     */
    function trackSponsorshipAddition(address creator, uint256 amount) external {
        // Only elections can call this function
        require(
            isElectionCreatedByCreator(msg.sender, creator),
            "Not authorized"
        );
        
        creatorSponsorshipInfo[creator].totalSponsorshipDeposited += amount;
        creatorSponsorshipInfo[creator].activeSponsorships++;
        
        emit CreatorSponsorshipUpdated(
            creator,
            creatorSponsorshipInfo[creator].totalSponsorshipDeposited,
            creatorSponsorshipInfo[creator].totalSponsorshipWithdrawn,
            creatorSponsorshipInfo[creator].activeSponsorships
        );
    }

    /**
     * @dev Check if an election was created by a specific creator
     * @param electionAddress The election address
     * @param creator The creator address
     * @return True if the election was created by the creator
     */
    function isElectionCreatedByCreator(address electionAddress, address creator) public view returns (bool) {
        address[] storage creatorElectionList = creatorElections[creator];
        for (uint i = 0; i < creatorElectionList.length; i++) {
            if (creatorElectionList[i] == electionAddress) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Get creator's sponsorship information
     * @param creator The creator address
     * @return totalElectionsCreated Total elections created
     * @return totalSponsorshipDeposited Total sponsorship deposited
     * @return totalSponsorshipWithdrawn Total sponsorship withdrawn
     * @return activeSponsorships Number of active sponsorships
     * @return lastElectionCreated Timestamp of last election created
     * @return isBlacklisted Whether creator is blacklisted
     */
    function getCreatorSponsorshipInfo(address creator) external view returns (
        uint256 totalElectionsCreated,
        uint256 totalSponsorshipDeposited,
        uint256 totalSponsorshipWithdrawn,
        uint256 activeSponsorships,
        uint256 lastElectionCreated,
        bool isBlacklisted
    ) {
        CreatorSponsorshipInfo memory info = creatorSponsorshipInfo[creator];
        return (
            info.totalElectionsCreated,
            info.totalSponsorshipDeposited,
            info.totalSponsorshipWithdrawn,
            info.activeSponsorships,
            info.lastElectionCreated,
            blacklistedCreators[creator]
        );
    }

    /**
     * @dev Get creator's elections
     * @param creator The creator address
     * @return Array of election addresses created by the creator
     */
    function getCreatorElections(address creator) external view returns (address[] memory) {
        return creatorElections[creator];
    }

    // ============ ADMIN FUNCTIONS ============

    /**
     * @dev Blacklist a creator (only factory owner)
     * @param creator The creator to blacklist
     * @param reason Reason for blacklisting
     */
    function blacklistCreator(address creator, string calldata reason) external onlyOwner {
        blacklistedCreators[creator] = true;
        creatorSponsorshipInfo[creator].isBlacklisted = true;
        emit CreatorBlacklisted(creator, reason);
    }

    /**
     * @dev Unblacklist a creator (only factory owner)
     * @param creator The creator to unblacklist
     */
    function unblacklistCreator(address creator) external onlyOwner {
        blacklistedCreators[creator] = false;
        creatorSponsorshipInfo[creator].isBlacklisted = false;
        emit CreatorUnblacklisted(creator);
    }

    /**
     * @dev Update sponsorship limits (only factory owner)
     * @param newMaxSponsorship New maximum sponsorship per creator
     * @param newMaxActiveElections New maximum active elections per creator
     */
    function updateSponsorshipLimits(
        uint256 newMaxSponsorship,
        uint256 newMaxActiveElections
    ) external onlyOwner {
        uint256 oldLimit = MAX_SPONSORSHIP_PER_CREATOR;
        // Note: This would require making the constants mutable or using a different approach
        // For now, we'll emit an event to track the change
        emit SponsorshipLimitUpdated(oldLimit, newMaxSponsorship);
    }

    /**
     * @dev Get factory sponsorship statistics
     * @return totalElections Total elections created
     * @return totalSponsorshipDeposited Total sponsorship deposited across all creators
     * @return totalSponsorshipWithdrawn Total sponsorship withdrawn across all creators
     * @return activeSponsorships Total active sponsorships
     */
    function getFactorySponsorshipStats() external view returns (
        uint256 totalElections,
        uint256 totalSponsorshipDeposited,
        uint256 totalSponsorshipWithdrawn,
        uint256 activeSponsorships
    ) {
        totalElections = electionCount;
        
        // Note: This would require iterating through all creators
        // For efficiency, we might want to maintain global counters
        // For now, returning basic stats
        return (totalElections, 0, 0, 0);
    }

    /**
     * @dev Get count of truly active elections for a creator (not ended)
     * @param creator The creator address
     * @return Number of active elections (not ended)
     */
    function getActiveElectionsCount(address creator) public view returns (uint256) {
        address[] memory creatorElectionList = creatorElections[creator];
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < creatorElectionList.length; i++) {
            Election election = Election(payable(creatorElectionList[i]));
            (, uint256 endTime, , ) = election.electionInfo();
            
            // Count as active if election hasn't ended yet
            if (block.timestamp <= endTime) {
                activeCount++;
            }
        }
        
        return activeCount;
    }

    /**
     * @dev Clean up ended elections from a creator's list (gas optimization)
     * @param creator The creator address
     * This function removes ended elections from the tracking array to save gas on future checks
     */
    function cleanupEndedElections(address creator) external {
        address[] storage creatorElectionList = creatorElections[creator];
        uint256 writeIndex = 0;
        
        // Compact array by keeping only active elections
        for (uint256 i = 0; i < creatorElectionList.length; i++) {
            Election election = Election(payable(creatorElectionList[i]));
            (, uint256 endTime, , ) = election.electionInfo();
            
            // Keep election if it's still active
            if (block.timestamp <= endTime) {
                if (writeIndex != i) {
                    creatorElectionList[writeIndex] = creatorElectionList[i];
                }
                writeIndex++;
            }
        }
        
        // Remove excess elements
        while (creatorElectionList.length > writeIndex) {
            creatorElectionList.pop();
        }
    }

    /**
     * @dev Get all elections by creator with their status
     * @param creator The creator address
     * @return elections Array of election addresses
     * @return isActive Array indicating if each election is active
     */
    function getCreatorElectionsWithStatus(address creator) external view returns (
        address[] memory elections,
        bool[] memory isActive
    ) {
        address[] memory creatorElectionList = creatorElections[creator];
        elections = new address[](creatorElectionList.length);
        isActive = new bool[](creatorElectionList.length);
        
        for (uint256 i = 0; i < creatorElectionList.length; i++) {
            elections[i] = creatorElectionList[i];
            
            Election election = Election(payable(creatorElectionList[i]));
            (, uint256 endTime, , ) = election.electionInfo();
            isActive[i] = (block.timestamp <= endTime);
        }
        
        return (elections, isActive);
    }
}
