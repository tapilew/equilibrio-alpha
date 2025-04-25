// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IEquiEvents.sol";

contract PaymentProcessor is AccessControl, ReentrancyGuard {
    bytes32 public constant PROCESSOR_ADMIN_ROLE = keccak256("PROCESSOR_ADMIN_ROLE");
    
    IERC20 public usdc;
    IEquiEvents public eventsEmitter;
    
    mapping(bytes32 => bool) public processedPayments;
    mapping(address => uint256) public totalProcessed;
    
    event PaymentInitiated(
        bytes32 indexed paymentId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        bytes metadata
    );
    
    event PaymentCompleted(
        bytes32 indexed paymentId,
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    
    constructor(address _usdc, address _eventsEmitter) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PROCESSOR_ADMIN_ROLE, msg.sender);
        
        usdc = IERC20(_usdc);
        eventsEmitter = IEquiEvents(_eventsEmitter);
    }
    
    function processPayment(
        address sender,
        address recipient,
        uint256 amount,
        bytes calldata metadata
    ) external nonReentrant returns (bytes32) {
        require(hasRole(PROCESSOR_ADMIN_ROLE, msg.sender), "Not authorized");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        bytes32 paymentId = keccak256(
            abi.encodePacked(
                sender,
                recipient,
                amount,
                block.timestamp,
                metadata
            )
        );
        
        require(!processedPayments[paymentId], "Payment already processed");
        
        processedPayments[paymentId] = true;
        totalProcessed[sender] += amount;
        
        emit PaymentInitiated(paymentId, sender, recipient, amount, metadata);
        
        return paymentId;
    }
    
    function completePayment(bytes32 paymentId) external nonReentrant {
        require(hasRole(PROCESSOR_ADMIN_ROLE, msg.sender), "Not authorized");
        require(processedPayments[paymentId], "Payment not found");
        
        emit PaymentCompleted(
            paymentId,
            msg.sender,
            address(0), // Will be filled by event listener
            0 // Will be filled by event listener
        );
    }
    
    function updateEventsEmitter(address newEmitter) external onlyRole(PROCESSOR_ADMIN_ROLE) {
        eventsEmitter = IEquiEvents(newEmitter);
    }
    
    function getTotalProcessed(address account) external view returns (uint256) {
        return totalProcessed[account];
    }
} 