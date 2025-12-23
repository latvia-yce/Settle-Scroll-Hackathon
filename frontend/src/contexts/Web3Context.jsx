import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { web3Service } from '../services/web3Service';
import { accountAbstractionService } from '../services/accountAbstraction';

// Create Web3 Context
const Web3Context = createContext();

// Web3 Provider Component
export const Web3Provider = ({ children }) => {
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
  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await web3Service.connectWallet();
      if (result.success) {
        setAccount(result.address);
        setNetwork(result.network);
        setIsConnected(true);
        setIsCorrectNetwork(result.isCorrectNetwork);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      
      if (result.success) {
        const networkCheck = await web3Service.networkManager.checkNetwork();
        setIsCorrectNetwork(networkCheck.isCorrectNetwork);
        return result;
      } else {
        throw new Error(result.error);
      }
      
    } catch (err) {
      setError(err.message);
      console.error('Failed to switch network:', err);
      return { success: false, error: err.message };
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

  // Initialize services on mount
  React.useEffect(() => {
    const initServices = async () => {
      try {
        // Initialize Account Abstraction service
        const aaResult = await accountAbstractionService.init();
        if (!aaResult.success) {
          console.warn('Failed to initialize Account Abstraction service:', aaResult.error);
        }
      } catch (error) {
        console.error('Failed to initialize services:', error);
      }
    };

    initServices();
  }, []);

  // Context value
  const contextValue = {
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

    // Services
    web3Service,
    accountAbstractionService,
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use Web3 context
export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
};
