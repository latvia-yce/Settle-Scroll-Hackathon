import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("InvoiceFactory", function () {
  let invoiceFactory: any;
  let mockUSDC: any;
  let deployer: any;
  let freelancer: any;
  let client: any;

  beforeEach(async function () {
    [deployer, freelancer, client] = await ethers.getSigners();

    // Deploy MockUSDC
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    mockUSDC = await MockUSDC.deploy();
    
    // Deploy InvoiceFactory
    const InvoiceFactory = await ethers.getContractFactory("InvoiceFactory");
    invoiceFactory = await InvoiceFactory.deploy(deployer.address);

    // Mint some USDC to client for testing
    const amount = ethers.parseUnits("1000", 6); // 1000 USDC (6 decimals)
    await mockUSDC.connect(deployer).mint(client.address, amount);
  });

  describe("Invoice Creation", function () {
    it("Should create a new invoice", async function () {
      const amount = ethers.parseUnits("100", 6); // 100 USDC
      const dueDate = (await time.latest()) + 86400; // 1 day from now
      
      await invoiceFactory.connect(freelancer).createInvoice(
        client.address,
        amount,
        await mockUSDC.getAddress(),
        "Website development",
        dueDate
      );
      
      // Check invoice was created
      const invoice = await invoiceFactory.getInvoice(1);
      expect(invoice.freelancer).to.equal(freelancer.address);
      expect(invoice.client).to.equal(client.address);
      expect(invoice.amount).to.equal(amount);
      expect(invoice.status).to.equal(0); // PENDING = 0
    });

    it("Should allow client to pay invoice", async function () {
      const amount = ethers.parseUnits("100", 6);
      const dueDate = (await time.latest()) + 86400;
      
      // Create invoice
      await invoiceFactory.connect(freelancer).createInvoice(
        client.address,
        amount,
        await mockUSDC.getAddress(),
        "Website development",
        dueDate
      );
      
      // Approve InvoiceFactory to spend client's USDC
      await mockUSDC.connect(client).approve(await invoiceFactory.getAddress(), amount);
      
      // Pay invoice
      await invoiceFactory.connect(client).payInvoice(1);
      
      // Check invoice status is PAID
      const invoice = await invoiceFactory.getInvoice(1);
      expect(invoice.status).to.equal(1); // PAID = 1
      
      // Check freelancer received funds (minus 0.5% fee)
      const freelancerBalance = await mockUSDC.balanceOf(freelancer.address);
      const expectedAmount = amount - (amount * 50n) / 10000n; // 0.5% fee
      expect(freelancerBalance).to.equal(expectedAmount);
    });

    it("Should cancel invoice", async function () {
      const amount = ethers.parseUnits("100", 6);
      const dueDate = (await time.latest()) + 86400;
      
      // Create invoice
      await invoiceFactory.connect(freelancer).createInvoice(
        client.address,
        amount,
        await mockUSDC.getAddress(),
        "Website development",
        dueDate
      );
      
      // Cancel as freelancer
      await invoiceFactory.connect(freelancer).cancelInvoice(1);
      
      const invoice = await invoiceFactory.getInvoice(1);
      expect(invoice.status).to.equal(2); // CANCELLED = 2
    });

    it("Should get freelancer invoices", async function () {
      const amount = ethers.parseUnits("100", 6);
      const dueDate = (await time.latest()) + 86400;
      
      // Create 3 invoices
      for (let i = 0; i < 3; i++) {
        await invoiceFactory.connect(freelancer).createInvoice(
          client.address,
          amount,
          await mockUSDC.getAddress(),
          `Invoice ${i}`,
          dueDate
        );
      }
      
      // Get freelancer's invoices
      const invoices = await invoiceFactory.getFreelancerInvoices(freelancer.address);
      expect(invoices.length).to.equal(3);
      expect(invoices[0]).to.equal(1);
      expect(invoices[1]).to.equal(2);
      expect(invoices[2]).to.equal(3);
    });
  });
});