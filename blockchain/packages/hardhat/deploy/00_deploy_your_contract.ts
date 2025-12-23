import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

const deployContracts = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await (hre as any).getNamedAccounts();
  const { deploy } = (hre as any).deployments;

  console.log("🚀 Deploying full Settle Suite with account:", deployer);

  // 1. Deploy MockUSDC
  const mockUSDC = await deploy("MockUSDC", { from: deployer, args: [], log: true });

  // 2. Deploy InvoiceFactory
  const invoiceFactory = await deploy("InvoiceFactory", { from: deployer, args: [deployer], log: true });

  // 3. Deploy SettlePaymaster
  const ENTRY_POINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
  const paymaster = await deploy("SettlePaymaster", {
    from: deployer,
    args: [ENTRY_POINT_ADDRESS],
    log: true,
  });

  console.log("\n🔗 Linking and Funding...");

  // 4. FUND THE PAYMASTER (Simplified approach)
  // We manually define the ABI for just the depositTo function to ensure no mismatch
  const entryPointAbi = ["function depositTo(address account) public payable"];
  const signer = await hre.ethers.getSigner(deployer);
  const entryPoint = new hre.ethers.Contract(ENTRY_POINT_ADDRESS, entryPointAbi, signer);

  console.log("⛽ Depositing 0.02 ETH into EntryPoint...");
  
  try {
    const fundTx = await entryPoint.depositTo(paymaster.address, {
      value: hre.ethers.parseEther("0.02"),
      // Adding a manual gas limit helps bypass the 'unpredictable gas limit' error
      gasLimit: 100000 
    });
    await fundTx.wait();
    console.log("✅ Gas tank filled!");
  } catch (error) {
    console.log("⚠️ Funding failed, but contracts are deployed. You can fund manually later.");
    console.error(error);
  }

  console.log("\n✅ ALL CONTRACTS DEPLOYED!");
  console.log(`Paymaster Address: ${paymaster.address}`);
};

export default deployContracts;
deployContracts.tags = ["SettleFull"];