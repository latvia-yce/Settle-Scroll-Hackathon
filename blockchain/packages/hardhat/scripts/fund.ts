import { ethers, network } from "hardhat";
import * as dotenv from "dotenv";
import * as readline from "readline/promises";

dotenv.config();

async function main() {
  const PAYMASTER_ADDRESS = "0x667299d7aB32C9f64d6d5612a463cB46d00D1522";
  const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

  // 1. Get the encrypted JSON from .env
  const encryptedJson = process.env.DEPLOYER_PRIVATE_KEY_ENCRYPTED;
  if (!encryptedJson) throw new Error("No encrypted key found in .env");

  // 2. Ask for the password in the terminal (same one you use for yarn deploy)
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const password = await rl.question("🔑 Enter password to decrypt private key: ");
  rl.close();

  // 3. Decrypt and create a wallet
  console.log("Decrypting wallet...");
  const wallet = await ethers.Wallet.fromEncryptedJson(encryptedJson, password);
  const signer = wallet.connect(ethers.provider);

  console.log("Funding Paymaster from:", signer.address);

  // 4. Send the deposit
  const entryPointAbi = ["function depositTo(address account) public payable"];
  const entryPoint = new ethers.Contract(ENTRY_POINT_ADDRESS, entryPointAbi, signer);

  console.log("Sending 0.02 ETH to EntryPoint vault...");
  const tx = await entryPoint.depositTo(PAYMASTER_ADDRESS, {
    value: ethers.parseEther("0.005"),
  });

  await tx.wait();
  console.log("✅ Success! Paymaster gas tank is filled.");
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exitCode = 1;
});