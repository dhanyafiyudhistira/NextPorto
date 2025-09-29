import { sepolia } from "wagmi/chains";
import { Chain } from "wagmi";
import { defineChain } from "viem";

const envChainId = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "31337");
const envRpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8545";

const localChain = defineChain({
  id: envChainId,
  name: envChainId === 31337 ? "Hardhat" : `Chain ${envChainId}`,
  network: envChainId === 31337 ? "hardhat" : `chain-${envChainId}`,
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: [envRpcUrl] },
    public: { http: [envRpcUrl] }
  }
});

export const targetChain: Chain = envChainId === sepolia.id ? sepolia : localChain;
export const rpcUrl = envRpcUrl;
export const chainId = envChainId;
