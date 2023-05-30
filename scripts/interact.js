const { ethers } = require("ethers");

async function main() {
    const votingContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    // const contractABI = require('../artifacts/contracts/Voting.sol');
    const artifacts = await hre.artifacts.readArtifact("DecentralizedVotingApp");
    const contractABI = artifacts.abi;
    const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545'); // Replace with your local Ethereum node URL
    const signer = provider.getSigner();

    const votingContract = new ethers.Contract(votingContractAddress, contractABI, signer);

    const tx1 = await votingContract.createPoll("Test Poll", "This is a test poll");
    await tx1.wait();
    console.log('Poll created:', tx1.hash);

    const tx2 = await votingContract.addOption(1, 'Option 1');
    await tx2.wait();
    console.log('Option added:', tx2.hash);

    const tx3 = await votingContract.vote(1, 1);
    await tx3.wait();
    console.log('Voted:', tx3.hash);
    
  }
  
main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
});