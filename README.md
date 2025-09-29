# NextPorto

## Environment Setup

### Hardhat

1. Copy `.env.example` to `.env`.
2. Supply your actual credentials in the new `.env` file.

The template provides the following variables:

```ini
SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/YOUR_KEY"
PRIVATE_KEY="0xYOUR_PRIVATE_KEY"
```

### Frontend

1. Copy `frontend/.env.local.example` to `frontend/.env.local`.
2. Replace the placeholder values in `frontend/.env.local` with the correct settings for your deployment.

The template includes:

```ini
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
```
