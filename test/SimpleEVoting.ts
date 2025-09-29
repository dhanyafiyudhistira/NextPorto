import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleEVoting", function () {
  async function deployFixture() {
    const [owner, voter, voter2] = await ethers.getSigners();
    const contract = await ethers.deployContract("SimpleEVoting");
    await contract.waitForDeployment();

    return { contract, owner, voter, voter2 };
  }

  it("creates an election", async () => {
    const { contract } = await deployFixture();

    const tx = await contract.createElection("Election 1", ["Alice", "Bob"]);
    await expect(tx).to.emit(contract, "ElectionCreated").withArgs(0, "Election 1");

    const election = await contract.getElection(0);
    expect(election.title).to.equal("Election 1");
    expect(election.active).to.equal(false);
    expect(election.ended).to.equal(false);

    const count = await contract.getCandidatesCount(0);
    expect(count).to.equal(2);
  });

  it("starts, votes, prevents double vote, and ends", async () => {
    const { contract, owner, voter, voter2 } = await deployFixture();

    await contract.createElection("Election 1", ["Alice", "Bob"]);

    await expect(contract.startElection(0))
      .to.emit(contract, "ElectionStarted")
      .withArgs(0);

    await expect(contract.connect(voter).vote(0, 0))
      .to.emit(contract, "VoteCast")
      .withArgs(0, voter.address, 0);

    await expect(contract.connect(voter).vote(0, 0)).to.be.revertedWith("Already voted");

    await expect(contract.connect(voter2).vote(0, 1))
      .to.emit(contract, "VoteCast")
      .withArgs(0, voter2.address, 1);

    await expect(contract.endElection(0))
      .to.emit(contract, "ElectionEnded")
      .withArgs(0);

    await expect(contract.connect(voter2).vote(0, 1)).to.be.revertedWith("Election not active");

    const candidate0 = await contract.getCandidate(0, 0);
    expect(candidate0.votes).to.equal(1);

    const candidate1 = await contract.getCandidate(0, 1);
    expect(candidate1.votes).to.equal(1);

    const hasVoted = await contract.hasVoted(0, voter.address);
    expect(hasVoted).to.equal(true);
  });

  it("blocks invalid transitions", async () => {
    const { contract } = await deployFixture();

    await expect(contract.startElection(0)).to.be.revertedWith("Election missing");

    await contract.createElection("Election 1", ["Alice", "Bob"]);

    await expect(contract.endElection(0)).to.be.revertedWith("Not active");

    await contract.startElection(0);
    await contract.endElection(0);

    await expect(contract.startElection(0)).to.be.revertedWith("Already ended");
  });
});
