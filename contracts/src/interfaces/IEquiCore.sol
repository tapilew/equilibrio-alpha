// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IEquiCore {
    struct Payment {
        address sender;
        address recipient;
        address token;
        uint256 amount;
        bytes32 paymentId;
        PaymentStatus status;
        uint256 timestamp;
        bytes metadata;
    }
    
    enum PaymentStatus {
        Pending,
        Processing,
        Completed,
        Failed
    }
    
    event PaymentInitiated(
        bytes32 indexed paymentId,
        address indexed sender,
        address indexed recipient,
        address token,
        uint256 amount
    );
    
    event PaymentProcessed(
        bytes32 indexed paymentId,
        PaymentStatus status
    );
    
    function initiatePayment(
        address recipient,
        uint256 amount,
        bytes calldata metadata
    ) external returns (bytes32);
    
    function processPayment(bytes32 paymentId) external;
    
    function addSupportedToken(address token) external;
    function removeSupportedToken(address token) external;
    function updateEventsEmitter(address newEmitter) external;
    
    function getPayment(bytes32 paymentId) external view returns (Payment memory);
    function isTokenSupported(address token) external view returns (bool);
} 