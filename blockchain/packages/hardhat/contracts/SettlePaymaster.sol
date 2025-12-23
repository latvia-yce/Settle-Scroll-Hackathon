// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

// 1. Define the Struct exactly as the EntryPoint expects it
struct UserOperation {
    address sender;
    uint256 nonce;
    bytes initCode;
    bytes callData;
    uint256 callGasLimit;
    uint256 verificationGasLimit;
    uint256 preVerificationGas;
    uint256 maxFeePerGas;
    uint256 maxPriorityFeePerGas;
    bytes paymasterAndData;
    bytes signature;
}

// 2. Define the Interface
interface IPaymaster {
    function validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
    external returns (bytes memory context, uint256 validationData);

    function postOp(uint8 mode, bytes calldata context, uint256 actualGasCost) external;
}

// 3. The Contract
contract SettlePaymaster is IPaymaster {
    address public immutable entryPoint;
    address public owner;

    // Simple modifier to replace OpenZeppelin's Ownable
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _entryPoint) {
        entryPoint = _entryPoint;
        owner = msg.sender; // Set the deployer as owner
    }

    function validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 /*userOpHash*/,
        uint256 /*maxCost*/
    ) external pure override returns (bytes memory context, uint256 validationData) {
        // We hush the unused variable warning
        userOp;
        // Return 0 to indicate success (Sponsoring the transaction)
        return ("", 0);
    }

    function postOp(uint8 mode, bytes calldata context, uint256 actualGasCost) external pure override {
        // Simple logic to satisfy the interface
        (mode, context, actualGasCost);
    }

    function withdrawTo(address payable withdrawAddress, uint256 amount) external onlyOwner {
        // This calls the EntryPoint to get your deposited ETH back
        (bool success,) = entryPoint.call(
            abi.encodeWithSignature("withdrawTo(address,uint256)", withdrawAddress, amount)
        );
        require(success, "Withdraw failed");
    }

    // Allow the contract to receive ETH (for the gas tank)
 
    receive() external payable {}
}