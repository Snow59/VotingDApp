
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Voting System for a Small Organization
 * @dev This contract manages a voting process including voter registration,
 *      proposal submissions, and voting on the registered proposals.
 */
contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    mapping(address => Voter) public voters;
    Proposal[] public proposals;
    WorkflowStatus public currentStatus;

    event VoterRegistered(address voterAddress);
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    constructor() Ownable(msg.sender) {
        currentStatus = WorkflowStatus.RegisteringVoters;
    }

    modifier atStage(WorkflowStatus _stage) {
        require(currentStatus == _stage, "Function cannot be called at this stage.");
        _;
    }

    function getCurrentState() public view returns (WorkflowStatus) {
        return currentStatus;
    }

    function registerVoter(address _voter) public onlyOwner atStage(WorkflowStatus.RegisteringVoters) {
        require(!voters[_voter].isRegistered, "Voter is already registered.");
        voters[_voter] = Voter({isRegistered: true, hasVoted: false, votedProposalId: 0});
        emit VoterRegistered(_voter);
    }

    function getCurrentWorkflowStatus() public view returns (WorkflowStatus) {
        return currentStatus;
    }

    function startProposalsRegistration() public onlyOwner atStage(WorkflowStatus.RegisteringVoters) {
        currentStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    function endProposalsRegistration() public onlyOwner atStage(WorkflowStatus.ProposalsRegistrationStarted) {
        currentStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    function submitProposal(string memory _description) public atStage(WorkflowStatus.ProposalsRegistrationStarted) {
        require(voters[msg.sender].isRegistered, "Only registered voters can submit proposals.");
        proposals.push(Proposal({description: _description, voteCount: 0}));
        emit ProposalRegistered(proposals.length - 1);
    }

    function startVotingSession() public onlyOwner atStage(WorkflowStatus.ProposalsRegistrationEnded) {
        currentStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    function vote(uint _proposalId) public atStage(WorkflowStatus.VotingSessionStarted) {
        Voter storage sender = voters[msg.sender];
        require(sender.isRegistered, "Voter is not registered.");
        require(!sender.hasVoted, "Voter has already voted.");
        require(_proposalId < proposals.length, "Invalid proposal ID.");

        sender.hasVoted = true;
        sender.votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        emit Voted(msg.sender, _proposalId);
    }

    function endVotingSession() public onlyOwner atStage(WorkflowStatus.VotingSessionStarted) {
        currentStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    function tallyVotes() public onlyOwner atStage(WorkflowStatus.VotingSessionEnded) {
        uint maxVoteCount = 0;
        uint _winningProposalId = 0;
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVoteCount) {
                maxVoteCount = proposals[i].voteCount;
                _winningProposalId = i;
            }
        }
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    function getWinner() public view atStage(WorkflowStatus.VotesTallied) returns (string memory) {
        require(proposals.length > 0, "No proposals registered.");
        return proposals[proposals.length - 1].description; // Assuming the last proposal has the highest votes
    }
}
