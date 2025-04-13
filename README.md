# **TurismoDAO — Milestone-Governed Tourism Crowdfunding for Local Communities**

### ✨ Reimagining tourism funding in Panamá, powered by EVM and BlockDAG.

---

## **1. Executive Summary**

**TurismoDAO** is a decentralized crowdfunding platform enabling Panamanian
communities to fund and manage tourism improvement projects through a hybrid DAO
structure. Built to deploy on the **BlockDAG Primordial Testnet**, the MVP
emphasizes **milestone-based funding**, **community voting**, **reputation-based
governance**, and **a pragmatic on-/off-ramp solution** (still) without oracles.

Our project combines smart contract rigor with a clear, real-world use case. It
fulfills the criteria for innovation, testability, and real impact on local
economies.

---

## **2. Problem Statement**

Local communities in Panama have rich tourism potential but lack equitable
access to funding and decision-making power. Traditional funding channels are:

- Centralized and bureaucratic,
- Hard to access for grassroots proposals,
- Often misaligned with the needs of the community.

There is no transparent or community-controlled way to fund and monitor tourism
projects at the local level.

---

## **3. The TurismoDAO Solution**

TurismoDAO provides a trust-minimized way for communities to:

- **Propose tourism initiatives** (e.g., eco-trails, signage, cultural events),
- **Crowdfund with BDAG tokens**, backed by verifiable fiat contributions,
- **Unlock funding in phases**, upon community-verified milestone completion,
- Govern using a **reputation + stake-weighted voting model**,
- Penalize bad actors with **slashing** to maintain accountability.

This empowers citizens as stakeholders in their region’s tourism development.

---

## **4. Core Features**

### 🧾 Project Proposals

- Any user can submit a basic proposal with:
  - Project title + description
  - Fundraising target
  - Number of planned milestones

### 🎯 Milestone-Based Crowdfunding

- Funds are disbursed **only after milestones are verified** and approved by DAO
  vote.
- Proposers receive **only a portion of funds per milestone**, not upfront lump
  sums.

### 🗳 DAO Voting System

- Community votes on whether a milestone has been fulfilled using:
  - **Reputation Score**: Based on proposer track record and voter
    participation.
  - **Staked Test Tokens**: Voters must stake tokens to vote, encouraging skin
    in the game.
- Voting results are recorded on the BlockDAG for full transparency.

### 🧨 Slashing Conditions

- If a proposer receives funds but **fails to deliver a verified milestone**,
  they are:
  - **Slashed**: Lose their staked collateral.
  - **Reputation-penalized**: Future proposals carry less weight/trust.
- Optionally, voters who voted “yes” on failed milestones also lose partial
  stake (to deter careless validation).

### 🧬 Reputation System

- Each proposer and voter builds a **public on-chain reputation score** based
  on:
  - Successful proposal completion,
  - Reliable voting behavior,
  - Engagement with the DAO.

### 🌉 On-Chain On-/Off-Ramp

A minimalist, oracle-free fiat ↔ token system tailored for hackathon delivery:

#### On-Ramp: DAO-Whitelisted Contribution + Escrow

- A trusted custodian (e.g., NGO or tourism network partner) receives fiat from
  donors.
- Once verified off-chain, a DAO-authorized multisig triggers the minting of
  test tokens on BlockDAG, logging the amount, donor identity (if needed), and
  transaction hash.

#### Off-Ramp: Milestone-Triggered Release

- Upon DAO-approved milestone completion, an on-chain event signals token
  payout.
- The same multisig wallet authorizes the fiat release by the custodian to the
  project team.
- All steps are transparent, verifiable, and documented on-chain for
  auditability.

### 🌍 Frontend Interface

- Web app interface includes:
  - Project browser
  - Voting dashboard
  - Milestone submission + IPFS-based evidence viewer
  - Reputation + stake display
  - Fiat ↔ Token event explorer (MVP)

---

## **5. Why This Model Fits Tourism**

| Challenge in Tourism                 | DAO Mechanism                           |
| ------------------------------------ | --------------------------------------- |
| Milestone nature of tourism projects | Milestone-based fund release            |
| Need for local trust + transparency  | On-chain votes + IPFS evidence          |
| Preventing misuse of funds           | Slashing for unfulfilled milestones     |
| Empowering communities               | DAO governance, not external funders    |
| Showing transparency to donors       | Fiat ↔ Token flows are fully auditable  |
| Supporting low-tech communities      | Custodian flow simplifies fiat handling |

---

## **6. Tech Stack & Integration**

| Component        | Tool                                |
| ---------------- | ----------------------------------- |
| Smart Contracts  | Solidity on BlockDAG (via Foundry)  |
| Governance Logic | Hybrid (staking + reputation)       |
| Voting Interface | Next.js frontend                    |
| On-/Off-Ramp     | Multisig + custodial partner        |
| IPFS             | File storage for milestone evidence |

---

## **7. Deliverables**

- ✅ Smart contracts deployed to BlockDAG testnet
- ✅ DAO voting contract w/ milestone gating
- ✅ Frontend for submitting/viewing proposals, milestones, and voting
- ✅ On-/Off-Ramp minting + release workflow with multisig
- ✅ Unit tests + simulation scripts
- ✅ Reputation prototype + on-chain logic
- ✅ 10-slide deck + 3-min pitch video

---

## **8. BlockDAG Grant Track Evaluation Fit**

| Criteria                | How We Meet It                                     |
| ----------------------- | -------------------------------------------------- |
| **Innovation**          | Custom DAO model adapted to real-world tourism     |
| **Technical Execution** | Smart contracts, milestone logic, multisig minting |
| **Feasibility**         | Fully working MVP w/o oracles or KYC               |
| **Presentation**        | Simple interface + clear explainer deck + dev logs |
| **Testability**         | Unit + integration tests + voting simulations      |
| **Scalability**         | Modular contracts; future integrations possible    |

---

## **9. Team**

| Name           | Role                   | Focus                                                               |
| -------------- | ---------------------- | ------------------------------------------------------------------- |
| Juan Kong      | Finance & Tokenomics   | Custodian workflow, staking/slashing models, reputation calibration |
| Joys Z         | DAO Governance Advisor | Voting mechanics, milestone templates, DAO dynamics                 |
| Luis Tapia     | Full-stack Developer   | Smart contract logic, frontend integration, multisig flows          |
| Jhuomar Barría | Smart Contract QA      | Testnet auditing, milestone tests, security conditions              |
| Rubén Sáez     | Security Researcher    | Contract threat modeling, replay protections, multisig safety       |

---

## **10. Call to Action**

TurismoDAO is a **locally-relevant**, **globally-scalable** DAO model for
crowdfunding community-led tourism. Our MVP demonstrates how real-world problems
in Panama can be tackled using EVM-compatible tooling, transparent governance,
and pragmatic off-chain integration.

We’re starting in Panama, but the mission is global: empowering communities to
build the tourism they deserve—**on-chain and on their terms.**
