import React, { createContext, useContext } from 'react';
import { web3Service } from '../services/web3Service';
import { accountAbstractionService } from '../services/accountAbstraction';

// Create Web3 Context
const Web3Context = createContext();

// Web3 Provider Component
export const Web3Provider = ({ children }) => {
  // Initialize services on mount
  React.useEffect(() => {
    const initServices = async () => {
      try {
        // Initialize Web3 service
        const web3Result = await web3Service.init();
        if (!web3Result.success) {
          console.warn('Failed to initialize Web3 service:', web3Result.error);
        }

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
