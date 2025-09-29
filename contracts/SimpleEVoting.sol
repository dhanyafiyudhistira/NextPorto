// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title SimpleEVoting - Minimal e-voting contract for on-chain elections
/// @notice Provides owner-controlled election lifecycle with single vote per address
contract SimpleEVoting is Ownable, ReentrancyGuard {
    struct Candidate {
        string name;
        uint256 votes;
    }

    struct Election {
        string title;
        Candidate[] candidates;
        mapping(address => bool) voted;
        bool active;
        bool ended;
    }

    /// @notice Mapping of election id to election data
    mapping(uint256 => Election) private elections;

    /// @notice Total number of elections created
    uint256 public electionCount;

    event ElectionCreated(uint256 indexed electionId, string title);
    event ElectionStarted(uint256 indexed electionId);
    event ElectionEnded(uint256 indexed electionId);
    event VoteCast(uint256 indexed electionId, address indexed voter, uint256 indexed candidateIndex);

    /// @notice Creates a new election with the provided title and candidates
    /// @dev Only callable by the contract owner
    /// @param title Name of the election
    /// @param candidateNames List of candidate names
    /// @return electionId The id of the newly created election
    function createElection(string memory title, string[] memory candidateNames)
        external
        onlyOwner
        returns (uint256 electionId)
    {
        require(bytes(title).length > 0, "Title required");
        require(candidateNames.length >= 2, "Min 2 candidates");

        electionId = electionCount;
        electionCount += 1;

        Election storage election = elections[electionId];
        election.title = title;
        election.active = false;
        election.ended = false;

        uint256 candidatesLength = candidateNames.length;
        for (uint256 i = 0; i < candidatesLength; ++i) {
            election.candidates.push(Candidate({name: candidateNames[i], votes: 0}));
        }

        emit ElectionCreated(electionId, title);
    }

    /// @notice Starts the election making it available for voting
    /// @param electionId Identifier of the election
    function startElection(uint256 electionId) external onlyOwner {
        Election storage election = elections[electionId];
        require(bytes(election.title).length > 0, "Election missing");
        require(!election.active, "Already active");
        require(!election.ended, "Already ended");
        require(election.candidates.length >= 2, "Not enough candidates");

        election.active = true;
        emit ElectionStarted(electionId);
    }

    /// @notice Ends the election preventing further votes
    /// @param electionId Identifier of the election
    function endElection(uint256 electionId) external onlyOwner {
        Election storage election = elections[electionId];
        require(election.active, "Not active");
        require(!election.ended, "Already ended");

        election.active = false;
        election.ended = true;

        emit ElectionEnded(electionId);
    }

    /// @notice Casts a vote for a given candidate within an active election
    /// @param electionId Identifier of the election
    /// @param candidateIndex Index of the candidate in the election
    function vote(uint256 electionId, uint256 candidateIndex) external nonReentrant {
        Election storage election = elections[electionId];
        require(election.active, "Election not active");
        require(!election.ended, "Election ended");
        require(!election.voted[msg.sender], "Already voted");

        uint256 candidatesLength = election.candidates.length;
        require(candidateIndex < candidatesLength, "Invalid candidate");

        election.voted[msg.sender] = true;
        election.candidates[candidateIndex].votes += 1;

        emit VoteCast(electionId, msg.sender, candidateIndex);
    }

    /// @notice Returns election metadata
    function getElection(uint256 electionId)
        external
        view
        returns (string memory title, bool active, bool ended)
    {
        Election storage election = elections[electionId];
        require(bytes(election.title).length > 0, "Election missing");
        return (election.title, election.active, election.ended);
    }

    /// @notice Returns number of candidates for an election
    function getCandidatesCount(uint256 electionId) external view returns (uint256) {
        Election storage election = elections[electionId];
        require(bytes(election.title).length > 0, "Election missing");
        return election.candidates.length;
    }

    /// @notice Returns candidate information
    function getCandidate(uint256 electionId, uint256 index)
        external
        view
        returns (string memory name, uint256 votes)
    {
        Election storage election = elections[electionId];
        require(bytes(election.title).length > 0, "Election missing");
        require(index < election.candidates.length, "Invalid candidate");

        Candidate storage candidate = election.candidates[index];
        return (candidate.name, candidate.votes);
    }

    /// @notice Checks whether an address has voted in a particular election
    /// @param electionId Identifier of the election
    /// @param account Address to check
    function hasVoted(uint256 electionId, address account) external view returns (bool) {
        Election storage election = elections[electionId];
        require(bytes(election.title).length > 0, "Election missing");
        return election.voted[account];
    }
}
