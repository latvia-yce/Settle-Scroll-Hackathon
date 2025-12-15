// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract InvoiceFactory is Ownable, ReentrancyGuard {
    struct Invoice {
        uint256 id;
        address freelancer;
        address client;
        uint256 amount;
        address token; // USDC address
        string description;
        uint256 dueDate;
        uint256 createdAt;
        InvoiceStatus status;
        bool exists;
    }
    
    enum InvoiceStatus { PENDING, PAID, CANCELLED, OVERDUE }
    
    // State variables
    uint256 public invoiceCounter;
    mapping(uint256 => Invoice) public invoices;
    mapping(address => uint256[]) public freelancerInvoices;
    mapping(address => uint256[]) public clientInvoices;
    
    // Events
    event InvoiceCreated(
        uint256 indexed id,
        address indexed freelancer,
        address indexed client,
        uint256 amount,
        address token,
        string description
    );
    
    event InvoicePaid(uint256 indexed id, address indexed payer, uint256 amount);
    event InvoiceCancelled(uint256 indexed id);
    event PaymentWithdrawn(uint256 indexed id, address indexed freelancer, uint256 amount);
    
    // Fee configuration (0.5% for platform)
    uint256 public constant PLATFORM_FEE_BPS = 50; // 0.5%
    address public feeCollector;
    address public paymaster; // For gasless transactions
    
    constructor(address _feeCollector) Ownable(msg.sender) {
        feeCollector = _feeCollector;
        invoiceCounter = 1;
    }
    
    // Create new invoice
    function createInvoice(
        address _client,
        uint256 _amount,
        address _token,
        string memory _description,
        uint256 _dueDate
    ) external returns (uint256) {
        require(_client != address(0), "Invalid client address");
        require(_amount > 0, "Amount must be > 0");
        require(_token != address(0), "Invalid token address");
        require(_dueDate > block.timestamp, "Due date must be in future");
        
        uint256 invoiceId = invoiceCounter;
        
        invoices[invoiceId] = Invoice({
            id: invoiceId,
            freelancer: msg.sender,
            client: _client,
            amount: _amount,
            token: _token,
            description: _description,
            dueDate: _dueDate,
            createdAt: block.timestamp,
            status: InvoiceStatus.PENDING,
            exists: true
        });
        
        freelancerInvoices[msg.sender].push(invoiceId);
        clientInvoices[_client].push(invoiceId);
        
        invoiceCounter++;
        
        emit InvoiceCreated(invoiceId, msg.sender, _client, _amount, _token, _description);
        
        return invoiceId;
    }
    
    // Pay invoice (called by client)
    function payInvoice(uint256 _invoiceId) external nonReentrant {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.exists, "Invoice does not exist");
        require(msg.sender == invoice.client, "Only client can pay");
        require(invoice.status == InvoiceStatus.PENDING, "Invoice not pending");
        require(block.timestamp <= invoice.dueDate, "Invoice overdue");
        
        IERC20 token = IERC20(invoice.token);
        
        // Calculate platform fee
        uint256 feeAmount = (invoice.amount * PLATFORM_FEE_BPS) / 10000;
        uint256 freelancerAmount = invoice.amount - feeAmount;
        
        // Transfer tokens from client to contract
        require(
            token.transferFrom(msg.sender, address(this), invoice.amount),
            "Token transfer failed"
        );
        
        // Update invoice status
        invoice.status = InvoiceStatus.PAID;
        
        // Distribute funds
        if (feeAmount > 0) {
            token.transfer(feeCollector, feeAmount);
        }
        token.transfer(invoice.freelancer, freelancerAmount);
        
        emit InvoicePaid(_invoiceId, msg.sender, invoice.amount);
    }
    
    // Cancel invoice (only freelancer or after due date)
    function cancelInvoice(uint256 _invoiceId) external {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.exists, "Invoice does not exist");
        
        bool isFreelancer = msg.sender == invoice.freelancer;
        bool isOverdue = block.timestamp > invoice.dueDate;
        
        require(isFreelancer || isOverdue, "Not authorized to cancel");
        require(invoice.status == InvoiceStatus.PENDING, "Invoice not pending");
        
        invoice.status = InvoiceStatus.CANCELLED;
        
        emit InvoiceCancelled(_invoiceId);
    }
    
    // Get invoice details
    function getInvoice(uint256 _invoiceId) external view returns (
        address freelancer,
        address client,
        uint256 amount,
        address token,
        string memory description,
        uint256 dueDate,
        uint256 createdAt,
        InvoiceStatus status
    ) {
        Invoice storage invoice = invoices[_invoiceId];
        require(invoice.exists, "Invoice does not exist");
        
        return (
            invoice.freelancer,
            invoice.client,
            invoice.amount,
            invoice.token,
            invoice.description,
            invoice.dueDate,
            invoice.createdAt,
            invoice.status
        );
    }
    
    // Get all invoices for a freelancer
    function getFreelancerInvoices(address _freelancer) external view returns (uint256[] memory) {
        return freelancerInvoices[_freelancer];
    }
    
    // Get all invoices for a client
    function getClientInvoices(address _client) external view returns (uint256[] memory) {
        return clientInvoices[_client];
    }
    
    // Admin functions
    function setFeeCollector(address _newCollector) external onlyOwner {
        require(_newCollector != address(0), "Invalid address");
        feeCollector = _newCollector;
    }
    
    function setPaymaster(address _paymaster) external onlyOwner {
        paymaster = _paymaster;
    }
}