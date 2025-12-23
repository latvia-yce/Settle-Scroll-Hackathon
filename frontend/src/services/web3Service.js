import { ethers } from 'ethers';
import InvoiceFactoryABI from './contracts/InvoiceFactory.json';

// Environment variables with fallbacks
const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || '';
const USDC_ADDRESS = import.meta.env.VITE_USDC_ADDRESS || '';
const PAYMASTER_ADDRESS = import.meta.env.VITE_PAYMASTER_ADDRESS || '';
const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS || '';
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://sepolia-rpc.scroll.io';

// Development mode detection
const isDevelopment = !FACTORY_ADDRESS || !USDC_ADDRESS || !ENTRYPOINT_ADDRESS;

// Network configuration
export const SCROLL_SEPOLIA = {
  chainId: '534351',
  chainName: 'Scroll Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia-rpc.scroll.io'],
  blockExplorerUrls: ['https://sepolia.scrollscan.com'],
};

// Network management
export class NetworkManager {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.isConnected = false;
    this.currentNetwork = null;
  }

  // Initialize read-only provider
  async initProvider() {
    try {
      this.provider = new ethers.JsonRpcProvider(RPC_URL);
      const network = await this.provider.getNetwork();
      this.currentNetwork = network;
      return { success: true, network };
    } catch (error) {
      console.error('Failed to initialize provider:', error);
      return { success: false, error: error.message };
    }
  }

  // Initialize signer (requires wallet connection)
  async initSigner() {
    try {
      if (!window.ethereum) {
        throw new Error('No wallet found. Please install MetaMask.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      this.isConnected = true;
      
      const network = await this.provider.getNetwork();
      const address = await this.signer.getAddress();
      
      this.currentNetwork = network;
      
      return { 
        success: true, 
        address, 
        network,
        signer: this.signer 
      };
    } catch (error) {
      console.error('Failed to initialize signer:', error);
      return { success: false, error: error.message };
    }
  }

  // Switch to Scroll Sepolia network
  async switchToScrollSepolia() {
    try {
      if (!window.ethereum) {
        throw new Error('No wallet found. Please install MetaMask.');
      }

      // Try to switch to Scroll Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + parseInt(SCROLL_SEPOLIA.chainId).toString(16) }],
      });

      return { success: true };
    } catch (error) {
      // If network doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SCROLL_SEPOLIA],
          });
          return { success: true };
        } catch (addError) {
          return { success: false, error: addError.message };
        }
      }
      return { success: false, error: error.message };
    }
  }

  // Check if connected to correct network
  async checkNetwork() {
    try {
      if (!this.provider) {
        await this.initProvider();
      }
      
      const network = await this.provider.getNetwork();
      const isCorrectNetwork = network.chainId.toString() === SCROLL_SEPOLIA.chainId;
      
      return {
        isCorrectNetwork,
        currentChainId: network.chainId.toString(),
        requiredChainId: SCROLL_SEPOLIA.chainId,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get account balance
  async getBalance(address) {
    try {
      if (!this.provider) {
        await this.initProvider();
      }
      
      const balance = await this.provider.getBalance(address);
      return {
        success: true,
        balance: ethers.formatEther(balance),
        balanceWei: balance.toString(),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export class ContractManager {
  constructor(networkManager) {
    this.networkManager = networkManager;
    this.contracts = {
      InvoiceFactory: null,
      MockUSDC: null,
    };
  }

  async initContracts() {
    try {
      // 1. Validate Network
      const netCheck = await this.networkManager.checkNetwork();
      if (!netCheck.isCorrectNetwork) {
         console.warn("Not on Scroll Sepolia, contract init might fail.");
      }

      let providerOrSigner = this.networkManager.signer || this.networkManager.provider;

      // 2. SANITIZE ABI (The Critical Fix)
      // We filter out any functions that use 'UserOperation' because ethers v6 
      // fails to parse them if the struct definition is missing in the JSON.
      const sanitizedFactoryAbi = InvoiceFactoryABI.abi.filter(item => {
        const signature = JSON.stringify(item);
        return !signature.includes("UserOperation");
      });

      // 3. Initialize InvoiceFactory
      this.contracts.InvoiceFactory = new ethers.Contract(
        FACTORY_ADDRESS,
        sanitizedFactoryAbi, // Use sanitized version
        providerOrSigner
      );

      // 4. Initialize USDC (Standard ABI is safe)
      const usdcAbi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function approve(address spender, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)",
      ];

      this.contracts.MockUSDC = new ethers.Contract(
        USDC_ADDRESS,
        usdcAbi,
        providerOrSigner
      );

      console.log("Contracts Initialized Successfully (AA functions bypassed)");
      return { success: true, contracts: this.contracts };
    } catch (error) {
      console.error('Failed to initialize contracts:', error);
      return { success: false, error: error.message };
    }
  }

  // Get contract instance
  getContract(contractName) {
    return this.contracts[contractName];
  }

  // Read-only contract calls
  async callContractRead(contractName, method, ...args) {
    try {
      const contract = this.getContract(contractName);
      if (!contract) {
        throw new Error(`${contractName} contract not initialized`);
      }

      const result = await contract[method](...args);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to call ${method} on ${contractName}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Write contract calls (requires signer)
  async callContractWrite(contractName, method, ...args) {
    try {
      const contract = this.getContract(contractName);
      if (!contract) {
        throw new Error(`${contractName} contract not initialized`);
      }

      if (!this.networkManager.signer) {
        throw new Error('No signer available. Please connect wallet.');
      }

      // Connect contract with signer
      const contractWithSigner = contract.connect(this.networkManager.signer);
      const result = await contractWithSigner[method](...args);
      
      return { 
        success: true, 
        result,
        hash: result.hash,
      };
    } catch (error) {
      console.error(`Failed to call ${method} on ${contractName}:`, error);
      return { success: false, error: error.message };
    }
  }
}

// Main Web3 service class
export class Web3Service {
  constructor() {
    this.networkManager = new NetworkManager();
    this.contractManager = new ContractManager(this.networkManager);
    this.listeners = new Map();
  }

  // Initialize the service
  async init() {
    try {
      const providerResult = await this.networkManager.initProvider();
      if (!providerResult.success) {
        throw new Error(providerResult.error);
      }

      const contractsResult = await this.contractManager.initContracts();
      if (!contractsResult.success) {
        throw new Error(contractsResult.error);
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Web3 service:', error);
      return { success: false, error: error.message };
    }
  }

  // Connect wallet with real functionality
  async connectWallet() {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        return {
          success: false,
          error: 'MetaMask not installed. Please install MetaMask to continue.',
          requiresInstall: true
        };
      }

      // Initialize provider first
      this.networkManager.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request wallet connection
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts found. Please connect your wallet.'
        };
      }

      // Initialize signer with the connected account
      this.networkManager.signer = await this.networkManager.provider.getSigner();
      this.networkManager.isConnected = true;

      const address = await this.networkManager.signer.getAddress();
      
      // Get current network
      const network = await this.networkManager.provider.getNetwork();
      this.networkManager.currentNetwork = network;

      // Check if on correct network
      const networkCheck = await this.networkManager.checkNetwork();
      
      // Initialize contracts with signer
      await this.contractManager.initContracts();

      // Setup wallet event listeners
      this.setupWalletListeners();

      // Emit connection event
      this.emit('accountsChanged', address);

      return {
        success: true,
        address,
        network: {
          chainId: network.chainId.toString(),
          name: network.name,
        },
        isCorrectNetwork: networkCheck.isCorrectNetwork,
        requiresNetworkSwitch: !networkCheck.isCorrectNetwork,
      };

    } catch (error) {
      console.error('Failed to connect wallet:', error);
      
      // Handle specific error types
      if (error.code === 4001) {
        return {
          success: false,
          error: 'Connection request rejected. Please try again.'
        };
      }
      
      return {
        success: false,
        error: error.message || 'Failed to connect wallet. Please try again.'
      };
    }
  }

  // Setup wallet event listeners
  setupWalletListeners() {
    if (!window.ethereum) return;

    // Remove existing listeners first to avoid duplicates
    window.ethereum.removeAllListeners('accountsChanged');
    window.ethereum.removeAllListeners('chainChanged');

    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnectWallet();
      } else {
        this.emit('accountsChanged', accounts[0]);
      }
    });

    // Listen for network changes
    window.ethereum.on('chainChanged', (chainId) => {
      // Refresh the page on network change
      this.emit('networkChanged', chainId);
    });
  }

  // Disconnect wallet
  disconnectWallet() {
    this.networkManager.signer = null;
    this.networkManager.isConnected = false;
    this.emit('walletDisconnected', null);
  }

  // Event system for React hooks
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Invoice Factory specific methods
  async createInvoice(amount, recipient, description, dueDate) {
    try {
      // Convert amount to wei (assuming USDC with 6 decimals)
      const amountWei = ethers.parseUnits(amount.toString(), 6);
      
      const result = await this.contractManager.callContractWrite(
        'InvoiceFactory',
        'createInvoice',
        recipient,
        amountWei,
        USDC_ADDRESS,
        description,
        dueDate
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getInvoice(invoiceId) {
    try {
      const result = await this.contractManager.callContractRead(
        'InvoiceFactory',
        'getInvoice',
        invoiceId
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getFreelancerInvoices(freelancerAddress) {
    try {
      const result = await this.contractManager.callContractRead(
        'InvoiceFactory',
        'getFreelancerInvoices',
        freelancerAddress
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getClientInvoices(clientAddress) {
    try {
      const result = await this.contractManager.callContractRead(
        'InvoiceFactory',
        'getClientInvoices',
        clientAddress
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async payInvoice(invoiceId) {
    try {
      const result = await this.contractManager.callContractWrite(
        'InvoiceFactory',
        'payInvoice',
        invoiceId
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async cancelInvoice(invoiceId) {
    try {
      const result = await this.contractManager.callContractWrite(
        'InvoiceFactory',
        'cancelInvoice',
        invoiceId
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // USDC contract methods
  async getUSDCBalance(address) {
    try {
      const result = await this.contractManager.callContractRead(
        'MockUSDC',
        'balanceOf',
        address
      );

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getUSDCInfo() {
    try {
      const [symbol, decimals] = await Promise.all([
        this.contractManager.callContractRead('MockUSDC', 'symbol'),
        this.contractManager.callContractRead('MockUSDC', 'decimals'),
      ]);

      return {
        success: true,
        symbol: symbol.result,
        decimals: decimals.result,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }

  }
  
  getIsWalletAuthorized() {
    return this.networkManager.isConnected && this.networkManager.signer !== null;
  }
  // Wait for transaction confirmation
  async waitForTransaction(hash, confirmations = 1) {
    try {
      if (!this.networkManager.provider) {
        throw new Error('No provider available');
      }

      const receipt = await this.networkManager.provider.waitForTransaction(
        hash,
        confirmations
      );

      return {
        success: true,
        receipt,
        status: receipt.status === 1 ? 'success' : 'failed',
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instance
export const web3Service = new Web3Service();

// Setup wallet event listeners
if (typeof window !== 'undefined' && window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      web3Service.disconnectWallet();
    } else {
      web3Service.emit('accountsChanged', accounts[0]);
    }
  });

  window.ethereum.on('chainChanged', (chainId) => {
    // Refresh the page on network change
    window.location.reload();
  });
}


