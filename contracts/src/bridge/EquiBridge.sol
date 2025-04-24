// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IEquiEvents.sol";

contract EquiBridge is ReentrancyGuard, AccessControl {
    bytes32 public constant BRIDGE_OPERATOR_ROLE = keccak256("BRIDGE_OPERATOR_ROLE");
    
    IEquiEvents public eventsEmitter;
    
    mapping(uint256 => bool) public supportedChains;
    mapping(bytes32 => BridgeTransaction) public transactions;
    mapping(address => bool) public supportedTokens;
    
    struct BridgeTransaction {
        address sender;
        address recipient;
        address token;
        uint256 amount;
        uint256 sourceChain;
        uint256 targetChain;
        BridgeStatus status;
        uint256 timestamp;
        bytes metadata;
    }
    
    enum BridgeStatus {
        Pending,
        Processing,
        Completed,
        Failed
    }
    
    event BridgeTransactionInitiated(
        bytes32 indexed transactionId,
        address indexed sender,
        address indexed recipient,
        uint256 sourceChain,
        uint256 targetChain,
        address token,
        uint256 amount
    );
    
    event BridgeTransactionCompleted(
        bytes32 indexed transactionId,
        BridgeStatus status
    );
    
    constructor(address _eventsEmitter) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(BRIDGE_OPERATOR_ROLE, msg.sender);
        eventsEmitter = IEquiEvents(_eventsEmitter);
    }
    
    function initiateBridgeTransaction(
        address recipient,
        address token,
        uint256 amount,
        uint256 targetChain,
        bytes calldata metadata
    ) external nonReentrant returns (bytes32) {
        require(supportedTokens[token], "Token not supported");
        require(supportedChains[targetChain], "Target chain not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient");
        
        bytes32 transactionId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                token,
                amount,
                block.chainid,
                targetChain,
                block.timestamp,
                metadata
            )
        );
        
        require(transactions[transactionId].timestamp == 0, "Transaction already exists");
        
        transactions[transactionId] = BridgeTransaction({
            sender: msg.sender,
            recipient: recipient,
            token: token,
            amount: amount,
            sourceChain: block.chainid,
            targetChain: targetChain,
            status: BridgeStatus.Pending,
            timestamp: block.timestamp,
            metadata: metadata
        });
        
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        emit BridgeTransactionInitiated(
            transactionId,
            msg.sender,
            recipient,
            block.chainid,
            targetChain,
            token,
            amount
        );
        
        eventsEmitter.emitBridgeEvent(transactionId, "INITIATED", metadata);
        
        return transactionId;
    }
    
    function completeBridgeTransaction(
        bytes32 transactionId,
        bytes calldata proof
    ) external onlyRole(BRIDGE_OPERATOR_ROLE) nonReentrant {
        BridgeTransaction storage transaction = transactions[transactionId];
        require(transaction.timestamp != 0, "Transaction does not exist");
        require(transaction.status == BridgeStatus.Pending, "Invalid transaction status");
        
        // Here you would verify the proof from the target chain
        // This is a placeholder for the actual verification logic
        require(verifyBridgeProof(transactionId, proof), "Invalid bridge proof");
        
        transaction.status = BridgeStatus.Processing;
        
        require(
            IERC20(transaction.token).transfer(transaction.recipient, transaction.amount),
            "Transfer failed"
        );
        
        transaction.status = BridgeStatus.Completed;
        
        emit BridgeTransactionCompleted(transactionId, BridgeStatus.Completed);
        eventsEmitter.emitBridgeEvent(transactionId, "COMPLETED", transaction.metadata);
    }
    
    function addSupportedChain(uint256 chainId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedChains[chainId] = true;
    }
    
    function removeSupportedChain(uint256 chainId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedChains[chainId] = false;
    }
    
    function addSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[token] = true;
    }
    
    function removeSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[token] = false;
    }
    
    function verifyBridgeProof(
        bytes32 /* transactionId */,
        bytes calldata /* proof */
    ) internal pure returns (bool) {
        // This is a placeholder for the actual proof verification logic
        // In a real implementation, this would verify the proof from the target chain
        return true;
    }
} 