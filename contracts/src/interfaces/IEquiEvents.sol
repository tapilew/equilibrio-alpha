// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IEquiEvents {
    event PaymentProcessed(
        bytes32 indexed paymentId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        bytes metadata
    );
    
    event BridgeTransactionProcessed(
        bytes32 indexed bridgeId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        bytes metadata
    );
    
    event PluginExecuted(
        bytes32 indexed pluginId,
        address indexed executor,
        bytes data,
        bytes result
    );
    
    event ProtocolEvent(
        string eventType,
        bytes32 indexed eventId,
        address indexed sender,
        bytes data
    );
    
    function emitPaymentEvent(bytes32 paymentId, string calldata status, bytes calldata metadata) external;
    function emitBridgeEvent(bytes32 bridgeId, string calldata status, bytes calldata metadata) external;
} 