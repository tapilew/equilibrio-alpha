# TurismoDAO

**Project Proposal: TurismoDAO - BlockDAG Primordial Testnet MVP: A Community
Tourism Pilot**

**1. Executive Summary**

TurismoDAO is a _rapid prototype_ for a decentralized platform using blockchain
to empower Panamanian communities to propose and secure funding for local
tourism improvements. Built for deployment on the BlockDAG Primordial Testnet,
this MVP showcases a streamlined crypto crowdfunding system validated through
community voting. We focus on core functionality, code quality, and BlockDAG
integration to meet the grant requirements. We will provide clear documentation
and presentation material for evaluation.

**2. Problem Statement**

Local communities in Panamá often lack the resources to drive tourism
enhancements. Traditional funding sources are difficult to access. This results
in limited community involvement in tourism development decisions, which can
lead to missed opportunities.

**3. Proposed Solution: TurismoDAO BlockDAG Testnet MVP (1-Week Scope)**

This MVP will demonstrate the core functionality of:

- **Community Project Proposals:** Simplified submission of tourism initiatives.
- **BlockDAG-Based Test Token Crowdfunding:** Secure and transparent donations
  using test tokens on the BlockDAG Primordial Testnet.
- **Community Voting:** A verifiable mechanism for gauging community support for
  proposed projects.
- **Basic Granting Module:** Funds distribution by the administrator to the
  winner based on voting results.
- **Transparency:** Immutably tracked project funding, and vote totals on the
  BlockDAG.

**4. Key Features**

- **4.1. Project Submission Form:**
  - A minimal form allowing users to submit a project name, brief description,
    and target fundraising goal (denominated in test tokens).
  - Focus: Clear, concise input fields; no image uploads; no advanced
    formatting.
- **4.2. BlockDAG Test Token Integration:**
  - Users will receive test tokens upon registration (via a simple faucet, if
    feasible).
  - Test tokens can be donated to support project proposals.
  - Token balances and transactions will be recorded on the BlockDAG Primordial
    Testnet.
  - Smart contract handling funds allocation to the proposer post positive
    validation by the community and the admin
  - Focus: Secure and efficient integration with the BlockDAG testnet; verifying
    transactions on the DAG explorer.
- **4.3. "Simple" Voting:**
  - Users can "vote" for a project by allocating tokens to a project (allocated
    tokens would also count as votes)
  - Tied to token balances in the smart contract and BlockDAG ledger
- **4.4. Administration Granting:**
  - Based on the voting results from the community, the administrator account
    triggers distribution
- **4.5. User Authentication:**
  - A streamlined registration/login process is necessary to allocate tokens,
    and submit proposal
  - Focus: Fast and secure user validation; leveraging BlockDAG's identity
    features, if possible.

**5. Technology Implementation**

- **Smart Contracts:** Solidity for test token management, project submission,
  and voting; deployed on the BlockDAG Primordial Testnet. (Prioritizing
  efficient algorithms for BlockDAG performance)
- **Frontend:** Next.js.
- **Backend:** (Optional; minimize backend code to expedite development;
  prioritize direct interaction with the BlockDAG).
- **BlockDAG Integration:** Thorough documentation and well-defined integration
  point for our code to interact with BlockDAG ledger and functions

**6. BlockDAG Grant Track Requirements Addressed**

- **Relevance:** Clearly defined problem related to community tourism funding
  (addressed in Problem Statement).
- **Code Complexity:** Implement efficient smart contracts for test token
  transactions and voting (prioritizing BlockDAG-optimized code).
- **Testing:** Comprehensive unit tests for smart contracts, basic integration
  tests to verify BlockDAG interactions (maximize test coverage within the
  one-week timeframe).
- **Maintainability:** Modular, well-documented smart contracts with clear code
  comments and basic API documentation.
- **Presentation:** We will deliver a clear 10-slide presentation AND a 3-minute
  video demonstrating the problem, solution, and BlockDAG integration.

**7. Deliverables**

- **Deployable Smart Contracts:** Fully functional smart contracts deployed on
  the BlockDAG Primordial Testnet (with test token address and relevant API
  endpoints).
- **Functional Frontend:** Basic web interface for project submission, voting,
  and viewing results.
- **Code Documentation:** Clear and concise code comments for all smart
  contracts and frontend code.
- **API Documentation:** Basic documentation for interacting with the smart
  contracts and BlockDAG.
- **Testing Report:** Results of unit and integration tests.
- **Presentation Materials:** 10-slide presentation and 3-minute video (meeting
  the grant criteria).

**8. MVP Success Metrics**

- Smart contracts successfully deployed on the BlockDAG Primordial Testnet.
- Users able to register, receive test tokens, submit proposals, and vote.
- Verifiable test token transactions and vote tallies recorded on the BlockDAG.
- Positive review on code quality, documentation, and presentation.

**9. Limitations**

This MVP is a _highly focused proof-of-concept_. Key limitations:

- **No Real Cryptocurrency:** Only test tokens will be used.
- **Simplified Voting Mechanism:** This serves more to demonstrate than
  accurately decide the funding for the proposal
- **Basic User Interface:** Limited design and functionality.
- **Focus on BlockDAG Integration:** Feature prioritization to leverage
  BlockDAG's capabilities.
- **Potential Lack of Community Engagement Simulations:** As we need test users

**10. Team**

1. Architecture
1. Security
1. Solidity
1. Governance
1. Finance

**11. Call to Action**

TurismoDAO's BlockDAG-integrated MVP offers a clear and demonstrable solution
for community-driven tourism funding. We're confident that this prototype can be
deployed on the BlockDAG Primordial Testnet and meets the grant requirements. We
look forward to your feedback and the opportunity to further develop TurismoDAO
with your support. We are seeking partners and collaborators to help us build
the fully realized TurismoDAO platform, enabling communities to truly shape the
future of tourism in Panamá.

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum
application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending
  transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
