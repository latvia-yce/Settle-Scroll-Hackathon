import { useState, useEffect, useCallback } from 'react';
import { accountAbstractionService, socialLoginService } from '../services/accountAbstraction';
import { useWeb3 } from './useWeb3';

// Hook for Account Abstraction functionality
export const useAccountAbstraction = () => {
  const { web3Service, account, isConnected } = useWeb3();
  const [isAAInitialized, setIsAAInitialized] = useState(false);
  const [smartAccountAddress, setSmartAccountAddress] = useState(null);
  const [isSmartAccountDeployed, setIsSmartAccountDeployed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userOpHash, setUserOpHash] = useState(null);

  // Initialize Account Abstraction service
  useEffect(() => {
    const initAA = async () => {
      try {
        if (!web3Service) return;

        // Set the web3Service reference
        accountAbstractionService.web3Service = web3Service;

        const result = await accountAbstractionService.init();
        
        if (!result.success) {
          throw new Error(result.error);
        }

        setIsAAInitialized(true);

        // If connected, get smart account address
        if (account && isConnected) {
          await getSmartAccountAddress();
        }

      } catch (err) {
        setError(err.message);
        console.error('Failed to initialize Account Abstraction:', err);
      }
    };

    if (web3Service && isConnected !== undefined) {
      initAA();
    }
  }, [web3Service, isConnected, account]);

  // Get smart account address
  const getSmartAccountAddress = useCallback(async (salt = 0) => {
    if (!account) return;

    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.getSmartAccountAddress(account, salt);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setSmartAccountAddress(result.address);
      setIsSmartAccountDeployed(result.exists);

      return {
        success: true,
        address: result.address,
        exists: result.exists,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Deploy smart account
  const deploySmartAccount = useCallback(async (salt = 0) => {
    if (!account) {
      throw new Error('No account connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.deploySmartAccount(account, salt);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setSmartAccountAddress(result.address);
      setIsSmartAccountDeployed(result.deployed);

      return {
        success: true,
        address: result.address,
        deployed: result.deployed,
        transactionHash: result.transactionHash,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [account]);

  // Create gasless invoice
  const createInvoiceGasless = useCallback(async (amount, recipient, description, dueDate) => {
    if (!account || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.createInvoiceGasless(
        amount,
        recipient,
        description,
        dueDate,
        account
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setUserOpHash(result.transactionHash);

      return {
        success: true,
        transactionHash: result.transactionHash,
        userOp: result.userOp,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [account, isConnected]);

  // Pay invoice gasless
  const payInvoiceGasless = useCallback(async (invoiceId) => {
    if (!account || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.payInvoiceGasless(
        invoiceId,
        account
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setUserOpHash(result.transactionHash);

      return {
        success: true,
        transactionHash: result.transactionHash,
        userOp: result.userOp,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [account, isConnected]);

  // Create UserOperation for invoice creation
  const createInvoiceUserOp = useCallback(async (amount, recipient, description, dueDate) => {
    if (!account || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.createInvoiceUserOp(
        amount,
        recipient,
        description,
        dueDate,
        account
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        userOp: result.userOp,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [account, isConnected]);

  // Create UserOperation for invoice payment
  const payInvoiceUserOp = useCallback(async (invoiceId) => {
    if (!account || !isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.payInvoiceUserOp(
        invoiceId,
        account
      );
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        userOp: result.userOp,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [account, isConnected]);

  // Get next nonce
  const getNextNonce = useCallback(async () => {
    try {
      const nonce = await accountAbstractionService.getNextNonce();
      return {
        success: true,
        nonce: nonce.toString(),
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Simulate UserOperation
  const simulateUserOp = useCallback(async (userOp) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await accountAbstractionService.simulateUserOp(userOp);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      return {
        success: true,
        result: result.result,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get Paymaster information
  const getPaymasterInfo = useCallback(async () => {
    try {
      const result = await accountAbstractionService.getPaymasterInfo();
      return result;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return {
    // State
    isAAInitialized,
    smartAccountAddress,
    isSmartAccountDeployed,
    isLoading,
    error,
    userOpHash,

    // Actions
    getSmartAccountAddress,
    deploySmartAccount,
    createInvoiceGasless,
    payInvoiceGasless,
    createInvoiceUserOp,
    payInvoiceUserOp,
    getNextNonce,
    simulateUserOp,
    getPaymasterInfo,

    // Services
    accountAbstractionService,
    socialLoginService,
  };
};

// Hook for Social Login functionality
export const useSocialLogin = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [eoaAddress, setEoaAddress] = useState(null);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await socialLoginService.loginWithGoogle();
      
      if (!result.success) {
        throw new Error(result.error);
      }

      setUser(result.user);
      setEoaAddress(result.eoaAddress);
      setIsAuthenticated(true);

      return {
        success: true,
        user: result.user,
        eoaAddress: result.eoaAddress,
      };

    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    socialLoginService.logout();
    setUser(null);
    setEoaAddress(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  // Get current user
  const getCurrentUser = useCallback(() => {
    const currentUser = socialLoginService.getUser();
    setUser(currentUser);
    setIsAuthenticated(!!currentUser);
    return currentUser;
  }, []);

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    eoaAddress,

    // Actions
    loginWithGoogle,
    logout,
    getCurrentUser,
  };
};

// Combined hook for full Account Abstraction workflow
export const useFullAccountAbstraction = () => {
  const {
    isAAInitialized,
    smartAccountAddress,
    isSmartAccountDeployed,
    isLoading,
    error,
    getSmartAccountAddress,
    deploySmartAccount,
    createInvoiceGasless,
    payInvoiceGasless,
    getPaymasterInfo,
  } = useAccountAbstraction();

  const {
    user,
    isAuthenticated,
    eoaAddress,
    loginWithGoogle,
    logout,
  } = useSocialLogin();

  const { account, isConnected } = useWeb3();

  // Complete initialization flow
  const initializeForUser = useCallback(async () => {
    if (!isConnected && !isAuthenticated) {
      throw new Error('No authentication method available');
    }

    try {
      // For wallet-connected users
      if (isConnected && account) {
        await getSmartAccountAddress();
        return { type: 'wallet', address: account };
      }

      // For social login users
      if (isAuthenticated && eoaAddress) {
        // Here we would create a session for the social login user
        // and potentially connect their EOA to the smart account
        return { type: 'social', address: eoaAddress };
      }

    } catch (err) {
      throw err;
    }
  }, [isConnected, isAuthenticated, account, eoaAddress, getSmartAccountAddress]);

  // Check if user can perform gasless transactions
  const canPerformGaslessTx = useCallback(() => {
    return isAAInitialized && (isConnected || isAuthenticated);
  }, [isAAInitialized, isConnected, isAuthenticated]);

  // Get current user's EOA address (wallet or social)
  const getCurrentEOA = useCallback(() => {
    if (isConnected && account) {
      return account;
    }
    if (isAuthenticated && eoaAddress) {
      return eoaAddress;
    }
    return null;
  }, [isConnected, account, isAuthenticated, eoaAddress]);

  return {
    // State
    isAAInitialized,
    smartAccountAddress,
    isSmartAccountDeployed,
    isLoading,
    error,
    user,
    isAuthenticated,
    eoaAddress,
    canPerformGaslessTx,

    // Actions
    loginWithGoogle,
    logout,
    getSmartAccountAddress,
    deploySmartAccount,
    createInvoiceGasless,
    payInvoiceGasless,
    getPaymasterInfo,
    initializeForUser,
    getCurrentEOA,

    // Services
    accountAbstractionService,
    socialLoginService,
  };
};
