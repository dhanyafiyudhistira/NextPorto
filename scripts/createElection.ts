import { readFileSync } from "fs";
import path from "path";
import { ethers } from "hardhat";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using account:", signer.address);

  const addressPath = path.join(__dirname, "../frontend/contracts/contractAddress.json");
  const { address } = JSON.parse(readFileSync(addressPath, "utf8"));

  const contract = await ethers.getContractAt("SimpleEVoting", address);

  const tx = await contract.createElection("Contoh Pemilihan", [
    "Alice",
    "Bob",
    "Charlie"
  ]);

  console.log("Transaction hash:", tx.hash);
  await tx.wait();
  console.log("Election created");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
