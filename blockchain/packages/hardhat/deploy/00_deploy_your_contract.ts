import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log("Deploying contracts with account:", deployer);

  // 1. Deploy MockUSDC
  const mockUSDC = await deploy("MockUSDC", {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  console.log("MockUSDC deployed to:", mockUSDC.address);

  // 2. Deploy InvoiceFactory
  const invoiceFactory = await deploy("InvoiceFactory", {
    from: deployer,
    args: [deployer], // feeCollector = deployer
    log: true,
    autoMine: true,
  });

  console.log("InvoiceFactory deployed to:", invoiceFactory.address);

  // 3. Export contract addresses
  const contracts = {
    MockUSDC: mockUSDC.address,
    InvoiceFactory: invoiceFactory.address,
    // We'll use third-party paymaster (Pimlico/Stackup)
    Paymaster: "0x0000000000000000000000000000000000000000", // Placeholder
  };

  console.log("\n✅ Contracts deployed successfully!");
  console.log("Contract addresses:", JSON.stringify(contracts, null, 2));
  
  // Save to a file for frontend
  const fs = require("fs");
  fs.writeFileSync(
    "deployed-contracts.json",
    JSON.stringify(contracts, null, 2)
  );
};

export default deployContracts;

deployContracts.tags = ["InvoiceFactory", "MockUSDC"];