# Decentralized Voting Application
This is a decentralized voting application built on the Ethereum blockchain using Solidity smart contracts. It allows users to create and participate in polls with multiple options, vote for their preferred options, and display the results in real-time.

# Futures
The smart contract is implemented in Solidity and supports the creation of polls with unique identifiers, titles, descriptions, and lists of options. Only the poll creator can add options to the poll.
Users can cast their votes for a specific option in a poll, and once they have voted, they cannot change their vote. The contract stores and maintains the vote counts for each option and provides a function to retrieve the current vote count for a given option.

# Installation
To run this application, you will need Node.js, npm, and Truffle installed on your machine.

- Clone the repository
- Install the dependencies: npm install
- Compile the smart contracts: truffle compile
- Migrate the contracts to the Ethereum network: truffle migrate
- Start the server: npm start

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
