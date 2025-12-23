import { ethers } from 'ethers';

// Environment variables for Account Abstraction
const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS;
const PAYMASTER_ADDRESS = import.meta.env.VITE_PAYMASTER_ADDRESS;
const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

// Simplified UserOperation structure for EIP-4337
export class UserOperation {
  constructor({
    sender = ethers.ZeroAddress,
    nonce = 0,
    initCode = '0x',
    callData = '0x',
    callGasLimit = 0,
    verificationGasLimit = 0,
    preVerificationGas = 0,
    maxFeePerGas = 0,
    maxPriorityFeePerGas = 0,
    paymasterAndData = '0x',
    signature = '0x',
  } = {}) {
    this.sender = sender;
    this.nonce = nonce;
    this.initCode = initCode;
    this.callData = callData;
    this.callGasLimit = callGasLimit;
    this.verificationGasLimit = verificationGasLimit;
    this.preVerificationGas = preVerificationGas;
    this.maxFeePerGas = maxFeePerGas;
    this.maxPriorityFeePerGas = maxPriorityFeePerGas;
    this.paymasterAndData = paymasterAndData;
    this.signature = signature;
  }

  // Convert to bytes array for signing
  toBytes() {
    return ethers.AbiCoder.defaultAbiCoder().encode(
      [
        'address',
        'uint256',
        'bytes32',
        'bytes32',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'uint256',
        'bytes32',
        'bytes32',
      ],
      [
        this.sender,
        this.nonce,
        ethers.keccak256(this.initCode),
        ethers.keccak256(this.callData),
        this.callGasLimit,
        this.verificationGasLimit,
        this.preVerificationGas,
        this.maxFeePerGas,
        this.maxPriorityFeePerGas,
        ethers.keccak256(this.paymasterAndData),
        ethers.keccak256(this.signature),
      ]
    );
  }

  // Get hash for EntryPoint
  hash(entryPointAddress) {
    return ethers.keccak256(
      ethers.concat([
        '0x02',
        ethers.AbiCoder.defaultAbiCoder().encode(
          ['bytes32', 'address', 'uint256'],
          [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            entryPointAddress,
            ethers.keccak256(this.toBytes()),
          ]
        ),
      ])
    );
  }
}

// Account Abstraction service
export class AccountAbstractionService {
  constructor(web3Service) {
    this.web3Service = web3Service;
    this.entryPoint = null;
    this.smartAccountAddress = null;
    this.isInitialized = false;
    this.listeners = new Map();
  }

  // Initialize AA service
  async init() {
    try {
      // Initialize EntryPoint contract with proper tuple ABI
      const entryPointAbi = [
        'function handleOps(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature)[] ops, address payable beneficiary)',
        'function getUserOpHash(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp) view returns (bytes32)',
        'function simulateValidation(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp)',
        'function addStake(uint32 unstakeDelaySec) payable',
        'function getNonce(address sender, uint192 key) view returns (uint256)',
      ];

      this.entryPoint = new ethers.Contract(
        ENTRYPOINT_ADDRESS,
        entryPointAbi,
        this.web3Service.networkManager.provider || this.web3Service.networkManager.signer
      );

      this.isInitialized = true;
      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Account Abstraction service:', error);
      return { success: false, error: error.message };
    }
  }

  // Create or get smart account address
  async getSmartAccountAddress(eoaAddress, salt = 0) {
    try {
      // Simple smart account factory (would need actual implementation)
      const factoryAbi = [
        'function getAddress(address owner, uint256 salt) pure returns (address)',
      ];

      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        factoryAbi,
        this.web3Service.networkManager.provider
      );

      const predictedAddress = await factory.getAddress(eoaAddress, salt);
      this.smartAccountAddress = predictedAddress;
      
      return {
        success: true,
        address: predictedAddress,
        exists: await this.checkAccountExists(predictedAddress),
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Check if account exists on chain
  async checkAccountExists(address) {
    try {
      const code = await this.web3Service.networkManager.provider.getCode(address);
      return code !== '0x';
    } catch (error) {
      console.error('Failed to check account existence:', error);
      return false;
    }
  }

  // Deploy smart account if it doesn't exist
  async deploySmartAccount(eoaAddress, salt = 0) {
    try {
      if (!this.web3Service.networkManager.signer) {
        throw new Error('No signer available');
      }

      const { success, address } = await this.getSmartAccountAddress(eoaAddress, salt);
      if (!success) {
        throw new Error('Failed to get smart account address');
      }

      const exists = await this.checkAccountExists(address);
      if (exists) {
        return { success: true, address, deployed: false };
      }

      // Deploy account using factory
      const factoryAbi = [
        'function createAccount(address owner, uint256 salt) returns (address)',
      ];

      const factory = new ethers.Contract(
        FACTORY_ADDRESS,
        factoryAbi,
        this.web3Service.networkManager.signer
      );

      const tx = await factory.createAccount(eoaAddress, salt);
      const receipt = await tx.wait();

      return {
        success: true,
        address,
        deployed: true,
        transactionHash: receipt.transactionHash,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create UserOperation for invoice creation
  async createInvoiceUserOp(amount, recipient, description, dueDate, eoaAddress) {
    try {
      if (!this.smartAccountAddress) {
        const { success, address } = await this.getSmartAccountAddress(eoaAddress);
        if (!success) {
          throw new Error('Failed to get smart account address');
        }
        this.smartAccountAddress = address;
      }

      // Encode the invoice creation call
      const invoiceFactoryAbi = [
        'function createInvoice(address _client, uint256 _amount, address _token, string memory _description, uint256 _dueDate)',
      ];

      const invoiceFactory = new ethers.Contract(
        FACTORY_ADDRESS,
        invoiceFactoryAbi,
        this.web3Service.networkManager.provider
      );

      // Convert amount to wei (USDC 6 decimals)
      const amountWei = ethers.parseUnits(amount.toString(), 6);
      
      const callData = invoiceFactory.interface.encodeFunctionData('createInvoice', [
        recipient,
        amountWei,
        import.meta.env.VITE_USDC_ADDRESS,
        description,
        dueDate,
      ]);

      // Get current gas prices
      const feeData = await this.web3Service.networkManager.provider.getFeeData();
      const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('20', 'gwei');
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei');

      // Estimate gas limits
      const callGasLimit = 100000;
      const verificationGasLimit = 200000;
      const preVerificationGas = 21000;

      const userOp = new UserOperation({
        sender: this.smartAccountAddress,
        nonce: await this.getNextNonce(),
        callData,
        callGasLimit,
        verificationGasLimit,
        preVerificationGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        paymasterAndData: PAYMASTER_ADDRESS,
      });

      return {
        success: true,
        userOp,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create UserOperation for invoice payment
  async payInvoiceUserOp(invoiceId, eoaAddress) {
    try {
      if (!this.smartAccountAddress) {
        const { success, address } = await this.getSmartAccountAddress(eoaAddress);
        if (!success) {
          throw new Error('Failed to get smart account address');
        }
        this.smartAccountAddress = address;
      }

      // Encode the payment call
      const invoiceFactoryAbi = [
        'function payInvoice(uint256 _invoiceId)',
      ];

      const invoiceFactory = new ethers.Contract(
        FACTORY_ADDRESS,
        invoiceFactoryAbi,
        this.web3Service.networkManager.provider
      );

      const callData = invoiceFactory.interface.encodeFunctionData('payInvoice', [
        invoiceId,
      ]);

      // Get current gas prices
      const feeData = await this.web3Service.networkManager.provider.getFeeData();
      const maxFeePerGas = feeData.maxFeePerGas || ethers.parseUnits('20', 'gwei');
      const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas || ethers.parseUnits('2', 'gwei');

      const userOp = new UserOperation({
        sender: this.smartAccountAddress,
        nonce: await this.getNextNonce(),
        callData,
        callGasLimit: 80000,
        verificationGasLimit: 150000,
        preVerificationGas: 21000,
        maxFeePerGas,
        maxPriorityFeePerGas,
        paymasterAndData: PAYMASTER_ADDRESS,
      });

      return {
        success: true,
        userOp,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get next nonce for the smart account
  async getNextNonce() {
    try {
      if (!this.smartAccountAddress || !this.entryPoint) {
        throw new Error('Account Abstraction service not properly initialized');
      }

      const nonce = await this.entryPoint.getNonce(this.smartAccountAddress, 0);
      return nonce;
    } catch (error) {
      console.error('Failed to get next nonce:', error);
      return 0;
    }
  }

  // Sign UserOperation
  async signUserOp(userOp) {
    try {
      if (!this.web3Service.networkManager.signer) {
        throw new Error('No signer available');
      }

      const message = userOp.hash(ENTRYPOINT_ADDRESS);
      const signature = await this.web3Service.networkManager.signer.signMessage(
        ethers.getBytes(message)
      );

      userOp.signature = signature;
      return {
        success: true,
        userOp,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Submit UserOperation to EntryPoint
  async submitUserOperation(userOp) {
    try {
      if (!this.entryPoint) {
        throw new Error('EntryPoint not initialized');
      }

      // Convert UserOperation to array format expected by EntryPoint
      const ops = [
        [
          userOp.sender,
          userOp.nonce,
          userOp.initCode,
          userOp.callData,
          userOp.callGasLimit,
          userOp.verificationGasLimit,
          userOp.preVerificationGas,
          userOp.maxFeePerGas,
          userOp.maxPriorityFeePerGas,
          userOp.paymasterAndData,
          userOp.signature,
        ],
      ];

      const tx = await this.entryPoint.handleOps(ops, ethers.ZeroAddress);
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        receipt,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Gasless invoice creation
  async createInvoiceGasless(amount, recipient, description, dueDate, eoaAddress) {
    try {
      // Create UserOperation
      const { success: createSuccess, userOp, error: createError } = 
        await this.createInvoiceUserOp(amount, recipient, description, dueDate, eoaAddress);
      
      if (!createSuccess) {
        throw new Error(createError);
      }

      // Sign the UserOperation
      const { success: signSuccess, userOp: signedOp, error: signError } = 
        await this.signUserOp(userOp);
      
      if (!signSuccess) {
        throw new Error(signError);
      }

      // Submit to EntryPoint
      const { success: submitSuccess, transactionHash, error: submitError } = 
        await this.submitUserOperation(signedOp);
      
      if (!submitSuccess) {
        throw new Error(submitError);
      }

      return {
        success: true,
        transactionHash,
        userOp: signedOp,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Gasless invoice payment
  async payInvoiceGasless(invoiceId, eoaAddress) {
    try {
      // Create UserOperation
      const { success: createSuccess, userOp, error: createError } = 
        await this.payInvoiceUserOp(invoiceId, eoaAddress);
      
      if (!createSuccess) {
        throw new Error(createError);
      }

      // Sign the UserOperation
      const { success: signSuccess, userOp: signedOp, error: signError } = 
        await this.signUserOp(userOp);
      
      if (!signSuccess) {
        throw new Error(signError);
      }

      // Submit to EntryPoint
      const { success: submitSuccess, transactionHash, error: submitError } = 
        await this.submitUserOperation(signedOp);
      
      if (!submitSuccess) {
        throw new Error(submitError);
      }

      return {
        success: true,
        transactionHash,
        userOp: signedOp,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Simulate UserOperation (for testing)
  async simulateUserOp(userOp) {
    try {
      if (!this.entryPoint) {
        throw new Error('EntryPoint not initialized');
      }

      const result = await this.entryPoint.simulateValidation(userOp);
      return {
        success: true,
        result,
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Event system
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

  // Get Paymaster information
  async getPaymasterInfo() {
    try {
      // This would need actual Paymaster contract ABI
      const paymasterAbi = [
        'function getPaymasterAndData(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp) view returns (address, bytes)',
        'function validatePaymasterUserOp(tuple(address sender, uint256 nonce, bytes initCode, bytes callData, uint256 callGasLimit, uint256 verificationGasLimit, uint256 preVerificationGas, uint256 maxFeePerGas, uint256 maxPriorityFeePerGas, bytes paymasterAndData, bytes signature) userOp, bytes32 requestId, uint256 maxCost) view returns (bytes)',
      ];

      const paymaster = new ethers.Contract(
        PAYMASTER_ADDRESS,
        paymasterAbi,
        this.web3Service.networkManager.provider
      );

      return {
        success: true,
        address: PAYMASTER_ADDRESS,
        supported: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        supported: false,
      };
    }
  }
}

// Real Google OAuth Integration
export class SocialLoginService {
  constructor(accountAbstractionService) {
    this.aaService = accountAbstractionService;
    this.user = null;
    this.accessToken = null;
    this.googleInitialized = false;
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  }

  // Initialize Google OAuth
  async initializeGoogle() {
    try {
      if (this.googleInitialized) return { success: true };

      // Load Google OAuth script
      if (!window.google) {
        await this.loadGoogleScript();
      }

      if (!this.clientId || this.clientId === 'your_google_client_id_here') {
        console.warn('Google Client ID not found in environment variables, using mock mode');
        this.googleInitialized = true;
        return { success: true, mockMode: true };
      }

      // Initialize Google Identity Services
      await new Promise((resolve, reject) => {
        if (window.google && window.google.accounts) {
          window.google.accounts.id.initialize({
            client_id: this.clientId,
            callback: this.handleGoogleResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: false,
          });
          this.googleInitialized = true;
          resolve();
        } else {
          reject(new Error('Google Identity Services not loaded'));
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to initialize Google OAuth:', error);
      return { success: false, error: error.message };
    }
  }

  // Load Google OAuth script
  loadGoogleScript() {
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="accounts.google.com"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Handle Google OAuth response
  handleGoogleResponse(response) {
    try {
      const idToken = response.credential;
      const userInfo = this.parseJwt(idToken);
      
      const user = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
        provider: 'google',
        verified_email: userInfo.verified_email,
      };

      this.user = user;
      this.accessToken = idToken;
      
      return {
        success: true,
        user,
        eoaAddress: this.generateAddressFromUser(user),
      };
    } catch (error) {
      console.error('Failed to handle Google response:', error);
      return { success: false, error: error.message };
    }
  }

  // Parse JWT token
  parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  // Real Google OAuth login
  async loginWithGoogle() {
    try {
      const initResult = await this.initializeGoogle();
      if (!initResult.success) {
        return initResult;
      }

      // Mock mode for development/testing
      if (initResult.mockMode) {
        return this.mockLogin();
      }

      // Trigger Google OAuth
      return new Promise((resolve, reject) => {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback to manual button click
            this.showManualGoogleButton();
          }
        });

        // For immediate response, we can use the callback
        // This is handled in handleGoogleResponse
        setTimeout(() => {
          if (this.user) {
            resolve({
              success: true,
              user: this.user,
              eoaAddress: this.generateAddressFromUser(this.user),
            });
          } else {
            // If no immediate response, show manual button
            this.showManualGoogleButton();
            resolve({
              success: true,
              needsManualClick: true,
            });
          }
        }, 1000);
      });

    } catch (error) {
      console.error('Google login failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Mock login for development/testing
  mockLogin() {
    try {
      const mockUser = {
        id: 'mock_user_123',
        email: 'test@settle.finance',
        name: 'Test User',
        picture: 'https://via.placeholder.com/40x40?text=TU',
        provider: 'google',
        verified_email: true,
      };

      this.user = mockUser;
      this.accessToken = 'mock_access_token_123';

      return {
        success: true,
        user: mockUser,
        eoaAddress: this.generateAddressFromUser(mockUser),
      };
    } catch (error) {
      console.error('Mock login failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Show manual Google button for fallback
  showManualGoogleButton() {
    // This would typically show a Google Sign-In button
    // The user would click it to initiate OAuth flow
    const button = document.createElement('div');
    button.innerHTML = `
      <div id="google-signin-button" style="display: flex; justify-content: center; margin: 20px 0;">
        <div style="background: white; padding: 8px; border-radius: 4px; cursor: pointer;">
          <span>Sign in with Google</span>
        </div>
      </div>
    `;
    
    document.body.appendChild(button);
    
    // Handle button click
    const signinButton = button.querySelector('#google-signin-button');
    signinButton.onclick = () => {
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'outline', size: 'large' }
      );
      document.body.removeChild(button);
    };
  }

  // Generate EOA address from user (deterministic)
  async generateAddressFromUser(user) {
    try {
      // Use the user's Google ID as seed for deterministic address generation
      const seed = `settle_${user.id}_${user.email}`;
      
      // Create a deterministic private key from user info
      const privateKey = ethers.keccak256(ethers.toUtf8Bytes(seed));
      const wallet = new ethers.Wallet(privateKey);
      
      return wallet.address;
    } catch (error) {
      console.error('Failed to generate address from user:', error);
      // Fallback to random address
      return ethers.Wallet.createRandom().address;
    }
  }

  // Logout
  logout() {
    this.user = null;
    this.accessToken = null;
    
    // Sign out from Google if possible
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  // Get current user
  getUser() {
    return this.user;
  }

  // Get access token
  getAccessToken() {
    return this.accessToken;
  }

  // Verify token with Google
  async verifyTokenWithGoogle(idToken) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${idToken}`);
      const data = await response.json();
      
      return {
        success: data.email_verified === 'true',
        userInfo: data,
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Export singleton instances
export const accountAbstractionService = new AccountAbstractionService(null); // Will be initialized later
export const socialLoginService = new SocialLoginService(accountAbstractionService);
