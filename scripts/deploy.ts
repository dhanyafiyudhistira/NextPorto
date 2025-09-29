import { writeFileSync, mkdirSync } from "fs";
import path from "path";
import { artifacts, ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const contract = await ethers.deployContract("SimpleEVoting");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("SimpleEVoting deployed to:", address);

  const artifact = await artifacts.readArtifact("SimpleEVoting");

  const frontendContractsDir = path.join(__dirname, "../frontend/contracts");
  mkdirSync(frontendContractsDir, { recursive: true });

  const abiPath = path.join(frontendContractsDir, "SimpleEVoting.json");
  writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
  console.log("ABI written to", abiPath);

  const addressTsPath = path.join(frontendContractsDir, "contractAddress.ts");
  const addressContent = `export const CONTRACT_ADDRESS = "${address}" as const;\n`;
  writeFileSync(addressTsPath, addressContent);
  console.log("Address written to", addressTsPath);

  const addressJsonPath = path.join(frontendContractsDir, "contractAddress.json");
  writeFileSync(addressJsonPath, JSON.stringify({ address }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
