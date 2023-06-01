// Import the necessary modules from Hardhat
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Voting contract", function () {
  let votingContract;
  let creator;
  let user;
  
  beforeEach(async function () {
    [creator, user] = await ethers.getSigners();
    // Deploy a new Voting contract before each test
    const Voting = await ethers.getContractFactory("DecentralizedVotingApp");
    votingContract = await Voting.deploy();
    await votingContract.deployed();

    const signer = await ethers.provider.getSigner();
  });

  it("should create a new poll", async function () {
    // Call the createPoll function and check that a new poll is created
    await expect(votingContract.connect(creator).createPoll("Test Poll", "This is a test poll")).to.emit(votingContract, "PollCreated");
    const poll = await votingContract.polls(1);
    expect(poll.title).to.equal("Test Poll");
    expect(poll.description).to.equal("This is a test poll");
    expect(poll.creator).to.equal(await ethers.provider.getSigner().getAddress());
  });

  it("should add an option to a poll", async function () {
    // Create a new poll and call the addOption function to add an option
    await votingContract.connect(creator).createPoll("Test Poll", "This is a test poll");
    await expect(votingContract.connect(creator).addOption(1, "Option 1")).to.emit(votingContract, "OptionAdded");
    const poll = await votingContract.polls(1);
    const optionText = await votingContract.getOptionText(1, 1);
    const voteCount = await votingContract.getVoteCount(1, 1);

    expect(optionText).to.equal("Option 1");
    expect(voteCount).to.equal(0);
    expect(poll.optionCount).to.equal(1);
  });

  it("should add several options to a poll", async function () {
    // Create a new poll and call the addOption function to add an option several times
    await votingContract.connect(creator).createPoll("Test Poll", "This is a test poll");
    await votingContract.connect(creator).addOption(1, "Option 1");
    await votingContract.connect(creator).addOption(1, "Option 2");
    const poll = await votingContract.polls(1);
    const optionText = await votingContract.getOptionText(1, 2);
    const voteCount = await votingContract.getVoteCount(1, 2);

    expect(optionText).to.equal("Option 2");
    expect(voteCount).to.equal(0);
    expect(poll.optionCount).to.equal(2);
  });

  it("should revert when creating a poll with empty title and description", async function() {
    // Try to create a poll with empty title and description that an error is thrown
    await expect(votingContract.createPoll("", "")).to.be.revertedWith("Title and description are required");
  });

  it("should allow a user to vote on a poll", async function () {
    // Create a new poll, add an option, and vote on it
    await votingContract.connect(creator).createPoll("Test Poll", "This is a test poll");
    await votingContract.connect(creator).addOption(1, "Option 1");
    await expect(votingContract.vote(1, 1)).to.emit(votingContract, "Voted");
    const voteCount = await votingContract.getVoteCount(1, 1);
    expect(voteCount).to.equal(1);
  });

  it("should not allow a user to vote twice on the same poll", async function () {
    // Create a new poll, add an option, and vote on it
    await votingContract.connect(creator).createPoll("Test Poll", "This is a test poll");
    await votingContract.connect(creator).addOption(1, "Option 1");
    await votingContract.connect(user).vote(1, 1);

    // Try to vote again and check that an error is thrown
    await expect(votingContract.connect(user).vote(1, 1)).to.be.revertedWith("You have already voted in this poll");
  });

  it("should only allow pollCount is bigger than pollId", async function () {
    // Create a new poll
    await votingContract.connect(creator).createPoll("Test Poll", "This is a test poll");
    await expect(votingContract.connect(user).vote(2, 1)).to.be.revertedWith("Only pollCount is bigger than pollId");
  });

  it("should only allow the creator to add options to a poll", async function () {
    // Create a new poll and try to add an option as a different user
    await votingContract.connect(creator).createPoll("Test Poll", "This is a test poll");
    const signer = ethers.provider.getSigner(1);
    await expect(votingContract.connect(signer).addOption(1, "Option 1")).to.be.revertedWith("Only the poll creator can add options");
  });


});