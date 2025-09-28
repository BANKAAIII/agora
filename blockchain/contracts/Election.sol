// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IBallot} from "./ballots/interface/IBallot.sol";
import {IResultCalculator} from "./resultCalculators/interface/IResultCalculator.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract Election is Initializable {
    error OwnerPermissioned();
    error AlreadyVoted();
    error GetVotes();
    error ElectionIncomplete();
    error ElectionInactive();
    error InvalidCandidateID();
    // New errors for sponsorship functionality
    error InsufficientSponsorshipAmount();
    error SponsorshipNotEnabled();
    error SponsorshipDepleted();
    error OnlySponsorCanWithdraw();
    error InsufficientBalance();
    error EmergencyWithdrawalFailed();

    mapping(address user => bool isVoted) public userVoted;

    struct ElectionInfo {
        uint startTime;
        uint endTime;
        string name;
        string description;
        // Election type: 0 for invite based 1 for open
    }

    struct Candidate {
        uint candidateID; // remove candidateId its not needed
        string name;
        string description;
    }

    // New struct for sponsorship information
    struct SponsorshipInfo {
        bool isSponsored;
        uint256 totalDeposited;
        uint256 remainingBalance;
        address sponsor;
        uint256 totalVotesSponsored;
        uint256 averageGasPerVote;
        uint256 lastUpdated;
        bool emergencyWithdrawalEnabled;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OwnerPermissioned();
        _;
    }

    modifier onlyOwnerOrFactory() {
        if (msg.sender != owner && msg.sender != factoryContract) revert OwnerPermissioned();
        _;
    }

    modifier onlySponsor() {
        if (msg.sender != sponsorshipInfo.sponsor) revert OnlySponsorCanWithdraw();
        _;
    }

    modifier electionActive() {
        if (
            block.timestamp < electionInfo.startTime ||
            block.timestamp > electionInfo.endTime
        ) revert ElectionInactive();
        _;
    }

    modifier electionStarted() {
        if (block.timestamp > electionInfo.startTime) revert ElectionInactive();
        _;
    }

    ElectionInfo public electionInfo;

    address public factoryContract;
    address public owner;

    uint[] public winners;
    uint public electionId;
    uint public resultType;
    uint public totalVotes;
    bool public resultsDeclared;

    bool private ballotInitialized;

    IBallot private ballot;
    IResultCalculator private resultCalculator;

    Candidate[] public candidates;

    // Sponsorship state variables
    SponsorshipInfo public sponsorshipInfo;
    uint256 public constant MIN_SPONSORSHIP_AMOUNT = 0.01 ether;
    uint256 public constant GAS_BUFFER = 50000;
    uint256 public constant EMERGENCY_WITHDRAWAL_THRESHOLD = 0.1 ether; // 10% of total deposited

    // Sponsorship events
    event SponsorshipAdded(address indexed sponsor, uint256 amount, uint256 totalBalance);
    event SponsorshipWithdrawn(address indexed sponsor, uint256 amount, uint256 remainingBalance);
    event VoteSponsored(address indexed voter, uint256 gasUsed, uint256 remainingBalance);
    event EmergencyWithdrawal(address indexed sponsor, uint256 amount, string reason);
    event SponsorshipEnabled(address indexed sponsor, uint256 initialAmount);
    event SponsorshipDisabled(address indexed sponsor);

    function initialize(
        ElectionInfo memory _electionInfo,
        Candidate[] memory _candidates,
        uint _resultType,
        uint _electionId,
        address _ballot,
        address _owner,
        address _resultCalculator
    ) external initializer {
        electionInfo = _electionInfo;
        for(uint i = 0 ;i< _candidates.length;i++){ // add _candidates to candidates array 
            candidates.push(
                Candidate(
                    i,
                    _candidates[i].name,
                    _candidates[i].description
                )
            );
        }
        resultType = _resultType;
        electionId = _electionId;
        owner = _owner;
        factoryContract = msg.sender;
        ballot = IBallot(_ballot);
        resultCalculator = IResultCalculator(_resultCalculator);
        
        // Initialize sponsorship info
        sponsorshipInfo = SponsorshipInfo({
            isSponsored: false,
            totalDeposited: 0,
            remainingBalance: 0,
            sponsor: address(0),
            totalVotesSponsored: 0,
            averageGasPerVote: 0,
            lastUpdated: block.timestamp,
            emergencyWithdrawalEnabled: false
        });
    }

    // Voting function: allow voting even if sponsorship is depleted (user pays gas)
    function userVote(uint[] memory voteArr) external electionActive {
        if (userVoted[msg.sender]) revert AlreadyVoted();

        if (ballotInitialized == false) {
            ballot.init(candidates.length);
            ballotInitialized = true;
        }
        ballot.vote(voteArr);
        userVoted[msg.sender] = true;
        totalVotes++;

        // Sponsorship logic
        if (sponsorshipInfo.isSponsored && sponsorshipInfo.remainingBalance >= MIN_SPONSORSHIP_AMOUNT) {
            uint256 deduction = 0.001 ether; // Fixed estimate for now
            if (sponsorshipInfo.remainingBalance >= deduction) {
                sponsorshipInfo.remainingBalance -= deduction;
            } else {
                sponsorshipInfo.remainingBalance = 0;
            }
            sponsorshipInfo.totalVotesSponsored++;
            sponsorshipInfo.lastUpdated = block.timestamp;
            emit VoteSponsored(msg.sender, deduction, sponsorshipInfo.remainingBalance);
        } else {
            // Not sponsored, user pays gas
            emit VoteSponsored(msg.sender, 0, sponsorshipInfo.remainingBalance); // 0 means not sponsored
        }
    }

    function ccipVote(
        address user,
        uint[] memory _voteArr
    ) external electionActive {
        if (userVoted[user]) revert AlreadyVoted();
        if (ballotInitialized == false) {
            ballot.init(candidates.length);
            ballotInitialized = true;
        }
        if (msg.sender != factoryContract) revert OwnerPermissioned();
        userVoted[user] = true;
        ballot.vote(_voteArr);
        totalVotes++;
        
        // Track sponsorship usage for cross-chain votes if enabled
        if (sponsorshipInfo.isSponsored) {
            sponsorshipInfo.totalVotesSponsored++;
            sponsorshipInfo.lastUpdated = block.timestamp;
            emit VoteSponsored(user, 0, sponsorshipInfo.remainingBalance);
        }
    }

    function addCandidate(
        string calldata _name,
        string calldata _description
    ) external onlyOwner electionStarted {
        Candidate memory newCandidate = Candidate(
            candidates.length,
            _name,
            _description
        );
        candidates.push(newCandidate);
    }

    function removeCandidate(uint _id) external onlyOwner electionStarted {
    if (_id >= candidates.length) revert InvalidCandidateID();
    candidates[_id] = candidates[candidates.length - 1]; // Replace with last element
    candidates.pop(); 
}

    function getCandidateList() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getResult() external {
        if (block.timestamp < electionInfo.endTime) revert ElectionIncomplete();
        bytes memory payload = abi.encodeWithSignature("getVotes()");

        (bool success, bytes memory allVotes) = address(ballot).staticcall(
            payload
        );
        if (!success) revert GetVotes();

        uint[] memory _winners = resultCalculator.getResults(
            allVotes,
            resultType
        );
        winners = _winners;
        resultsDeclared = true;
    }

    function getWinners() external view returns (uint[] memory) {
        return winners;
    }

    // ============ SPONSORSHIP FUNCTIONS ============

    /**
     * @dev Add sponsorship to the election. Can be called multiple times to add more funds.
     */
    function addSponsorship() external payable onlyOwnerOrFactory {
        require(block.timestamp < electionInfo.endTime, "Cannot sponsor after election ended");
        require(msg.value >= MIN_SPONSORSHIP_AMOUNT, "Insufficient sponsorship amount");
        
        if (!sponsorshipInfo.isSponsored) {
            // First time adding sponsorship
            sponsorshipInfo.isSponsored = true;
            sponsorshipInfo.sponsor = owner;
            sponsorshipInfo.totalDeposited = msg.value;
            sponsorshipInfo.remainingBalance = msg.value;
            sponsorshipInfo.totalVotesSponsored = 0;
            sponsorshipInfo.averageGasPerVote = 0;
            sponsorshipInfo.lastUpdated = block.timestamp;
            sponsorshipInfo.emergencyWithdrawalEnabled = false;
            
            emit SponsorshipEnabled(owner, msg.value);
        } else {
            // Adding more sponsorship
            sponsorshipInfo.totalDeposited += msg.value;
            sponsorshipInfo.remainingBalance += msg.value;
            sponsorshipInfo.lastUpdated = block.timestamp;
        }
        
        emit SponsorshipAdded(owner, msg.value, sponsorshipInfo.remainingBalance);
    }

    /**
     * @dev Withdraw sponsorship funds. Only the sponsor can withdraw.
     * @param _amount The amount to withdraw
     */
    function withdrawSponsorship(uint256 _amount) external onlySponsor {
        require(_amount <= sponsorshipInfo.remainingBalance, "Insufficient balance");
        require(_amount > 0, "Amount must be greater than 0");
        
        sponsorshipInfo.remainingBalance -= _amount;
        sponsorshipInfo.lastUpdated = block.timestamp;
        
        // If remaining balance is below minimum, disable sponsorship
        if (sponsorshipInfo.remainingBalance < MIN_SPONSORSHIP_AMOUNT) {
            sponsorshipInfo.isSponsored = false;
            emit SponsorshipDisabled(msg.sender);
        }
        
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        if (!success) revert EmergencyWithdrawalFailed();
        
        emit SponsorshipWithdrawn(msg.sender, _amount, sponsorshipInfo.remainingBalance);
    }

    /**
     * @dev Emergency withdrawal function for sponsors to withdraw funds if they detect abuse.
     * Can only be called if emergency withdrawal is enabled or if remaining balance is above threshold.
     * @param _reason Reason for emergency withdrawal
     */
    function emergencyWithdraw(string calldata _reason) external onlySponsor {
        require(
            sponsorshipInfo.emergencyWithdrawalEnabled || 
            sponsorshipInfo.remainingBalance >= EMERGENCY_WITHDRAWAL_THRESHOLD,
            "Emergency withdrawal not allowed"
        );
        
        uint256 amountToWithdraw = sponsorshipInfo.remainingBalance;
        sponsorshipInfo.remainingBalance = 0;
        sponsorshipInfo.isSponsored = false;
        sponsorshipInfo.lastUpdated = block.timestamp;
        
        (bool success, ) = payable(msg.sender).call{value: amountToWithdraw}("");
        if (!success) revert EmergencyWithdrawalFailed();
        
        emit EmergencyWithdrawal(msg.sender, amountToWithdraw, _reason);
        emit SponsorshipDisabled(msg.sender);
    }

    /**
     * @dev Enable emergency withdrawal mode. Only the sponsor can enable this.
     */
    function enableEmergencyWithdrawal() external onlySponsor {
        sponsorshipInfo.emergencyWithdrawalEnabled = true;
    }

    /**
     * @dev Disable emergency withdrawal mode. Only the sponsor can disable this.
     */
    function disableEmergencyWithdrawal() external onlySponsor {
        sponsorshipInfo.emergencyWithdrawalEnabled = false;
    }

    /**
     * @dev Update gas usage for a sponsored vote. Called by paymaster or authorized contracts.
     * @param _gasUsed The gas used for the vote
     */
    function updateGasUsage(uint256 _gasUsed) external {
        // Only factory contract or paymaster can update gas usage
        require(
            msg.sender == factoryContract || 
            msg.sender == sponsorshipInfo.sponsor,
            "Not authorized"
        );
        
        if (sponsorshipInfo.isSponsored && sponsorshipInfo.totalVotesSponsored > 0) {
            // Update average gas per vote
            uint256 totalGasUsed = sponsorshipInfo.averageGasPerVote * (sponsorshipInfo.totalVotesSponsored - 1) + _gasUsed;
            sponsorshipInfo.averageGasPerVote = totalGasUsed / sponsorshipInfo.totalVotesSponsored;
        }
    }

    /**
     * @dev Get complete sponsorship status
     * @return isSponsored Whether sponsorship is enabled
     * @return remainingBalance Remaining sponsorship balance
     * @return totalVotesSponsored Total votes sponsored
     * @return averageGasPerVote Average gas used per vote
     * @return totalDeposited Total amount deposited
     * @return sponsor Sponsor address
     * @return emergencyWithdrawalEnabled Whether emergency withdrawal is enabled
     */
    function getSponsorshipStatus() external view returns (
        bool isSponsored,
        uint256 remainingBalance,
        uint256 totalVotesSponsored,
        uint256 averageGasPerVote,
        uint256 totalDeposited,
        address sponsor,
        bool emergencyWithdrawalEnabled
    ) {
        return (
            sponsorshipInfo.isSponsored,
            sponsorshipInfo.remainingBalance,
            sponsorshipInfo.totalVotesSponsored,
            sponsorshipInfo.averageGasPerVote,
            sponsorshipInfo.totalDeposited,
            sponsorshipInfo.sponsor,
            sponsorshipInfo.emergencyWithdrawalEnabled
        );
    }

    /**
     * @dev Check if sponsorship has sufficient funds for a vote
     * @return hasFunds Whether there are sufficient funds
     * @return estimatedCost Estimated cost for a vote
     */
    function checkSponsorshipFunds() external view returns (bool hasFunds, uint256 estimatedCost) {
        if (!sponsorshipInfo.isSponsored) {
            return (false, 0);
        }
        
        // Use average gas per vote or default estimate
        uint256 gasEstimate = sponsorshipInfo.averageGasPerVote > 0 
            ? sponsorshipInfo.averageGasPerVote 
            : 150000; // Default gas estimate
        
        // Add buffer for safety
        gasEstimate = gasEstimate + GAS_BUFFER;
        
        // Estimate cost (this is a rough estimate, actual cost depends on current gas price)
        estimatedCost = gasEstimate * 20 gwei; // Assume 20 gwei gas price
        
        hasFunds = sponsorshipInfo.remainingBalance >= estimatedCost;
        
        return (hasFunds, estimatedCost);
    }

    /**
     * @dev Get sponsorship analytics
     * @return efficiency Percentage of funds used efficiently
     * @return costPerVote Average cost per vote
     * @return utilizationRate Percentage of total deposited funds used
     */
    function getSponsorshipAnalytics() external view returns (
        uint256 efficiency,
        uint256 costPerVote,
        uint256 utilizationRate
    ) {
        if (!sponsorshipInfo.isSponsored || sponsorshipInfo.totalVotesSponsored == 0) {
            return (0, 0, 0);
        }
        
        uint256 totalUsed = sponsorshipInfo.totalDeposited - sponsorshipInfo.remainingBalance;
        costPerVote = totalUsed / sponsorshipInfo.totalVotesSponsored;
        
        // Efficiency: percentage of funds used for actual voting vs overhead
        efficiency = (totalUsed * 100) / sponsorshipInfo.totalDeposited;
        
        // Utilization rate: percentage of total deposited funds used
        utilizationRate = (totalUsed * 100) / sponsorshipInfo.totalDeposited;
        
        return (efficiency, costPerVote, utilizationRate);
    }

    /**
     * @dev Receive function to accept ETH for sponsorship
     */
    receive() external payable {
        // Only accept ETH if it's from the sponsor
        if (msg.sender == sponsorshipInfo.sponsor) {
            this.addSponsorship{value: msg.value}();
        } else {
            revert("Only sponsor can send ETH");
        }
    }
}
