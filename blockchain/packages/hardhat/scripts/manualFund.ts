import { ethers } from "hardhat";

async function main() {
  const entryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const paymasterAddress = "0x667299d7aB32C9f64d6d5612a463cB46d00D1522";

  const [deployer] = await ethers.getSigners();
  const entryPoint = await ethers.getContractAt("IEntryPoint", entryPointAddress);

  console.log("Depositing funds for Paymaster...");
  const tx = await entryPoint.depositTo(paymasterAddress, {
    value: ethers.parseEther("0.01"), // 0.01 ETH is plenty for testing
  });
  await tx.wait();
  console.log("✅ Paymaster funded!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 