import abi from "../contracts/SimpleEVoting.json";
import { CONTRACT_ADDRESS } from "../contracts/contractAddress";

const envAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const contractAddress = (envAddress ?? CONTRACT_ADDRESS) as `0x${string}`;
export const contractAbi = abi as typeof abi;

export const contractConfig = {
  address: contractAddress,
  abi: contractAbi
} as const;
