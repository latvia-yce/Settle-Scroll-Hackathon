import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '../services/web3Service';

// Web3 hook for basic functionality
export const useWeb3 = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Initialize Web3 service
  useEffect(() => {
    const initWeb3 = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize the base provider/contracts
        const result = await web3Service.init();
        if (!result.success) {
          throw new Error(result.error);
        }

        // Optional: Only check if we are ALREADY connected 
        // without forcing a popup
        if (window.ethereum?.selectedAddress) {
          const connectResult = await web3Service.connectWallet();
          if (connectResult.success) {
            setAccount(connectResult.address);
            setNetwork(connectResult.network);
            setIsConnected(true);
            setIsCorrectNetwork(connectResult.isCorrectNetwork);
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Failed to initialize Web3:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3();
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const result = await web3Service.connectWallet();
      if (result.success) {
        setAccount(result.address);
        setNetwork(result.network); // <--- ADD THIS
        setIsConnected(true);
        setIsCorrectNetwork(result.isCorrectNetwork); // <--- ADD THIS
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    web3Service.disconnectWallet();
    setAccount(null);
    setNetwork(null);
    setIsConnected(false);
    setBalance(null);
    setError(null);
  }, []);

  // Switch to Scroll Sepolia
  const switchToScrollSepolia = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await web3Service.networkManager.switchToScrollSepolia();
      
      // We must return the result object so ConnectWallet.jsx can read .success
      if (result.success) {
        const networkCheck = await web3Service.networkManager.checkNetwork();
        setIsCorrectNetwork(networkCheck.isCorrectNetwork);
        return result; // <--- ADD THIS
      } else {
        throw new Error(result.error);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to switch network:', err);
      return { success: false, error: err.message }; // <--- ADD THIS
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (!account) return;

    try {
      const balanceResult = await web3Service.networkManager.getBalance(account);
      if (balanceResult.success) {
        setBalance(balanceResult.balance);
      }
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [account]);

  



  return {
    // State
    isConnected,
    account,
    network,
    isLoading,
    error,
    balance,
    isCorrectNetwork,

    // Actions
    connectWallet,
    disconnectWallet,
    switchToScrollSepolia,
    refreshBalance,

    // Web3 service instance
    web3Service,
  };
};

// Hook for invoice operations
export const useInvoice = () => {
  const { web3Service, isConnected } = useWeb3();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create invoice
  const createInvoice = useCallback(async (amount, recipient, description, dueDate) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.createInvoice(amount, recipient, description, dueDate);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Wait for transaction confirmation
      const receipt = await web3Service.waitForTransaction(result.hash);
      
      if (receipt.success) {
        return {
          success: true,
          transactionHash: result.hash,
          invoiceId: result.result, // This would be the returned invoice ID
        };
      } else {
        throw new Error(receipt.error);
      }

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isConnected, web3Service]);

  // Get invoice details
  const getInvoice = useCallback(async (invoiceId) => {
    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.getInvoice(invoiceId);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        invoice: result.result,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [web3Service]);

  // Get freelancer's invoices
  const getFreelancerInvoices = useCallback(async (freelancerAddress) => {
    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.getFreelancerInvoices(freelancerAddress);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        invoiceIds: result.result,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [web3Service]);

  // Get client's invoices
  const getClientInvoices = useCallback(async (clientAddress) => {
    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.getClientInvoices(clientAddress);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        invoiceIds: result.result,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [web3Service]);

  // Pay invoice
  const payInvoice = useCallback(async (invoiceId) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.payInvoice(invoiceId);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Wait for transaction confirmation
      const receipt = await web3Service.waitForTransaction(result.hash);
      
      if (receipt.success) {
        return {
          success: true,
          transactionHash: result.hash,
        };
      } else {
        throw new Error(receipt.error);
      }

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isConnected, web3Service]);

  // Cancel invoice
  const cancelInvoice = useCallback(async (invoiceId) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.cancelInvoice(invoiceId);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Wait for transaction confirmation
      const receipt = await web3Service.waitForTransaction(result.hash);
      
      if (receipt.success) {
        return {
          success: true,
          transactionHash: result.hash,
        };
      } else {
        throw new Error(receipt.error);
      }

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isConnected, web3Service]);

  return {
    // State
    invoices,
    loading,
    error,

    // Actions
    createInvoice,
    getInvoice,
    getFreelancerInvoices,
    getClientInvoices,
    payInvoice,
    cancelInvoice,

    // Service
    web3Service,
  };
};

// Hook for USDC token operations
export const useUSDC = () => {
  const { web3Service, isConnected } = useWeb3();
  const [balance, setBalance] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get USDC balance
  const getUSDCBalance = useCallback(async (address) => {
    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.getUSDCBalance(address);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      // Convert from wei (6 decimals for USDC)
      const formattedBalance = (Number(result.result) / 1e6).toString();
      
      setBalance(formattedBalance);
      
      return {
        success: true,
        balance: formattedBalance,
        balanceWei: result.result,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [web3Service]);

  // Get USDC token info
  const getTokenInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await web3Service.getUSDCInfo();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setTokenInfo(result);
      
      return {
        success: true,
        ...result,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [web3Service]);

  return {
    // State
    balance,
    tokenInfo,
    loading,
    error,

    // Actions
    getUSDCBalance,
    getTokenInfo,
  };
};
