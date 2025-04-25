// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IEquiCore.sol";
import "../interfaces/IEquiEvents.sol";

contract EquiCore is IEquiCore, ReentrancyGuard, AccessControl {
    bytes32 public constant PAYMENT_PROCESSOR_ROLE = keccak256("PAYMENT_PROCESSOR_ROLE");
    bytes32 public constant PLUGIN_MANAGER_ROLE = keccak256("PLUGIN_MANAGER_ROLE");
    
    IERC20 public usdc;
    IEquiEvents public eventsEmitter;
    
    mapping(address => bool) public supportedTokens;
    mapping(bytes32 => Payment) public payments;
    
    constructor(address _usdc, address _eventsEmitter) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAYMENT_PROCESSOR_ROLE, msg.sender);
        _setupRole(PLUGIN_MANAGER_ROLE, msg.sender);
        
        usdc = IERC20(_usdc);
        eventsEmitter = IEquiEvents(_eventsEmitter);
        supportedTokens[_usdc] = true;
    }
    
    function initiatePayment(
        address recipient,
        uint256 amount,
        bytes calldata metadata
    ) external nonReentrant returns (bytes32) {
        require(amount > 0, "Amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient");
        
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                msg.sender,
                recipient,
                amount,
                block.timestamp,
                metadata
            )
        );
        
        require(payments[paymentId].paymentId == bytes32(0), "Payment already exists");
        
        payments[paymentId] = Payment({
            sender: msg.sender,
            recipient: recipient,
            token: address(usdc),
            amount: amount,
            paymentId: paymentId,
            status: PaymentStatus.Pending,
            timestamp: block.timestamp,
            metadata: metadata
        });
        
        emit PaymentInitiated(paymentId, msg.sender, recipient, address(usdc), amount);
        
        return paymentId;
    }
    
    function processPayment(bytes32 paymentId) external onlyRole(PAYMENT_PROCESSOR_ROLE) nonReentrant {
        Payment storage payment = payments[paymentId];
        require(payment.paymentId != bytes32(0), "Payment does not exist");
        require(payment.status == PaymentStatus.Pending, "Invalid payment status");
        
        payment.status = PaymentStatus.Processing;
        
        require(
            usdc.transferFrom(payment.sender, payment.recipient, payment.amount),
            "Transfer failed"
        );
        
        payment.status = PaymentStatus.Completed;
        
        emit PaymentProcessed(paymentId, PaymentStatus.Completed);
    }
    
    function addSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[token] = true;
    }
    
    function removeSupportedToken(address token) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedTokens[token] = false;
    }
    
    function updateEventsEmitter(address newEmitter) external onlyRole(DEFAULT_ADMIN_ROLE) {
        eventsEmitter = IEquiEvents(newEmitter);
    }
    
    function getPayment(bytes32 paymentId) external view returns (Payment memory) {
        return payments[paymentId];
    }
    
    function isTokenSupported(address token) external view returns (bool) {
        return supportedTokens[token];
    }
} 