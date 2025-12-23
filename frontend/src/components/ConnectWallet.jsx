import React, { useState } from 'react';
import { useWeb3 } from '../hooks/useWeb3';
import { useFullAccountAbstraction } from '../hooks/useAccountAbstraction';

const ConnectWallet = ({ isModal = false }) => {
  const {
    isConnected,
    account,
    network,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isCorrectNetwork,
    switchToScrollSepolia,
  } = useWeb3();

  const {
    user,
    isAuthenticated,
    loginWithGoogle,
    logout,
    canPerformGaslessTx,
    getCurrentEOA,
    isLoading: aaLoading,
    error: aaError,
  } = useFullAccountAbstraction();

  const [showNetworkAlert, setShowNetworkAlert] = useState(false);
  const [showInstallMetaMask, setShowInstallMetaMask] = useState(false);

  // Format address for display
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Handle network switch
  const handleNetworkSwitch = async () => {
    const result = await switchToScrollSepolia();
    if (!result.success) {
      setShowNetworkAlert(true);
      setTimeout(() => setShowNetworkAlert(false), 5000);
    }
  };

  if (isLoading || aaLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0fb847]"></div>
        <span className="ml-2 text-white">Connecting...</span>
      </div>
    );
  }

  return (
    <div className={`${isModal ? 'space-y-6' : 'space-y-4'}`}>
      {/* Header */}
      {isModal && (
        <div className="text-center mb-8">
          <div className="size-12 text-[#0fb847] flex items-center justify-center bg-[#0fb847]/10 rounded-lg mx-auto mb-4">
            <span className="material-symbols-outlined text-[28px]">receipt_long</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Invoice in USDC with zero gas fees. <br/>Securely login to manage your payments.
          </p>
        </div>
      )}

      {/* Network Alert */}
      {showNetworkAlert && (
        <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-200">
                Network Switch Required
              </h3>
              <div className="mt-2 text-sm text-yellow-300">
                <p>Please manually add Scroll Sepolia network to your wallet.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {(error || aaError) && (
        <div className="bg-red-900/50 border border-red-600 rounded-lg p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-200">Error</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error || aaError}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {(isConnected || isAuthenticated) && (
        <div className="bg-[#0fb847]/10 border border-[#0fb847]/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-[#0fb847]"></div>
            <span className="text-[#0fb847] font-medium">Connected</span>
          </div>
          
          {isConnected && (
            <div className="text-sm text-gray-300">
              <p>Wallet: {formatAddress(account)}</p>
              <p>Network: {network ? `${network.name} (${network.chainId})` : 'Unknown'}</p>
              {!isCorrectNetwork && (
                <button
                  onClick={handleNetworkSwitch}
                  className="mt-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium py-1 px-3 rounded transition duration-200"
                >
                  Switch to Scroll
                </button>
              )}
            </div>
          )}
          
          {isAuthenticated && (
            <div className="text-sm text-gray-300">
              <p>Google: {user?.name || 'User'}</p>
              <p>Generated: {formatAddress(getCurrentEOA() || '')}</p>
            </div>
          )}
          
          <button
            onClick={() => {
              try {
                if (isConnected) {
                  disconnectWallet();
                }
                if (isAuthenticated) {
                  logout();
                }
              } catch (error) {
                console.error('Error during disconnect:', error);
              }
            }}
            className="mt-3 text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Action Buttons */}
      {!isConnected && !isAuthenticated && (
        <div className="space-y-4">
          {/* Connect Wallet Button */}
          <button
            onClick={connectWallet}
            className="w-full bg-[#0fb847] hover:bg-[#0da33e] text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(15,184,71,0.3)] hover:shadow-[0_0_30px_rgba(15,184,71,0.5)] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">account_balance_wallet</span>
            Connect Wallet
          </button>
          
          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500 uppercase tracking-widest font-medium">Or</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          
          {/* Continue with Google (AA) */}
          <button
            onClick={loginWithGoogle}
            className="w-full bg-[#1c271f] hover:bg-[#253329] border border-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>
        </div>
      )}

      {/* Account Abstraction Status */}
      {(isConnected || isAuthenticated) && (
        <div className="bg-surface border border-white/10 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-4">Account Status</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Gasless Transactions</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                canPerformGaslessTx() 
                  ? 'bg-[#0fb847]/20 text-[#0fb847] border border-[#0fb847]/30' 
                  : 'bg-gray-600 text-gray-300 border border-gray-500'
              }`}>
                {canPerformGaslessTx() ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">AA Service</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                isConnected || isAuthenticated
                  ? 'bg-[#0fb847]/20 text-[#0fb847] border border-[#0fb847]/30' 
                  : 'bg-gray-600 text-gray-300 border border-gray-500'
              }`}>
                {isConnected || isAuthenticated ? 'Ready' : 'Not Ready'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Trust Signal for Modal */}
      {isModal && (
        <div className="mt-6 pt-6 border-t border-gray-600 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-primary/80 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <span className="text-xs font-semibold tracking-wide uppercase">Secured by Scroll ZKP</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
