# Simple E-Voting dApp

Minimal, production-grade on-chain e-voting system using Solidity, Hardhat, and Next.js.

## Features

- Owner-managed elections with lifecycle controls (create, start, end)
- On-chain voting with double-vote protection
- Real-time tallies with blockchain events
- Wagmi + MetaMask integration with network guard (Hardhat / Sepolia)
- Type-safe Hardhat project with tests and deployment scripts

## Smart Contract

Located at `contracts/SimpleEVoting.sol`, built with Solidity ^0.8.20, Ownable, and ReentrancyGuard. Key capabilities:

- Create elections with at least two candidates
- Start and end elections (owner only)
- Single vote per address enforcement
- Events for creation, lifecycle changes, and vote casting
- View helpers for election metadata, candidate details, and vote status

Unit tests in `test/SimpleEVoting.ts` cover lifecycle, voting, and edge cases.

## Hardhat Workspace

### Installation

```bash
npm install
```

### Useful scripts

| Command | Description |
| --- | --- |
| `npm run chain` | Start Hardhat local node |
| `npm test` | Run contract unit tests |
| `npm run deploy:local` | Deploy SimpleEVoting to localhost and sync frontend artifacts |

Environment variables (optional): place in `.env` to configure Sepolia deployments.

```env
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
PRIVATE_KEY="0x..." # deployer key
```

### Deployment scripts

- `scripts/deploy.ts`: deploys the contract and exports ABI + address to `frontend/contracts/`.
- `scripts/createElection.ts`: helper to create a sample election (requires deployed address JSON).

## Frontend (Next.js 14)

Located under `frontend/` using the App Router, TypeScript, wagmi, and viem.

### Install dependencies

```bash
cd frontend
npm install
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript type check |

Environment variables (optional) via `.env.local`:

```env
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # overrides generated address
```

## Running locally

1. **Terminal A** – Start Hardhat chain
   ```bash
   npm run chain
   ```

2. **Terminal B** – Deploy contract & sync frontend artifacts
   ```bash
   npm run deploy:local
   ```

3. **Terminal C** – Launch frontend
   ```bash
   cd frontend
   npm run dev
   ```

4. Connect MetaMask to the Hardhat network (import a private key or configure the network manually).
5. Navigate to `http://localhost:3000`.
6. Use `/admin` with the owner account to create and start an election.
7. Voters connect wallets and vote on `/election/[id]`; tallies update live via events.

## Deploying to Sepolia

1. Configure `SEPOLIA_RPC_URL` and `PRIVATE_KEY` in `.env`.
2. Deploy: `npx hardhat run scripts/deploy.ts --network sepolia`.
3. Copy the deployed address into `frontend/.env.local` as `NEXT_PUBLIC_CONTRACT_ADDRESS` (or reuse generated artifact if accessible).
4. Update RPC/chain id env vars for the frontend (`NEXT_PUBLIC_CHAIN_ID=11155111`).
5. Build and deploy the Next.js app to your hosting provider.

## Security & Notes

- Votes tracked per election to prevent double voting.
- Owner-only guards on lifecycle operations.
- No off-chain storage; all reads come from the blockchain.
- Minimal UI using CSS Modules (no Tailwind).
- Handle wallet rejection, wrong network, and transaction states in the UI.
