// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IEquiEvents.sol";

contract BlockDAGBridge is AccessControl, ReentrancyGuard {
    bytes32 public constant BRIDGE_ADMIN_ROLE = keccak256("BRIDGE_ADMIN_ROLE");
    
    IERC20 public usdc;
    IEquiEvents public eventsEmitter;
    
    mapping(bytes32 => bool) public processedBridges;
    mapping(address => uint256) public totalBridged;
    
    event BridgeInitiated(
        bytes32 indexed bridgeId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        bytes metadata
    );
    
    event BridgeCompleted(
        bytes32 indexed bridgeId,
        address indexed sender,
        address indexed recipient,
        uint256 amount
    );
    
    constructor(address _usdc, address _eventsEmitter) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(BRIDGE_ADMIN_ROLE, msg.sender);
        
        usdc = IERC20(_usdc);
        eventsEmitter = IEquiEvents(_eventsEmitter);
    }
    
    function bridgeToBlockDAG(
        address sender,
        address recipient,
        uint256 amount,
        bytes calldata metadata
    ) external nonReentrant returns (bytes32) {
        require(hasRole(BRIDGE_ADMIN_ROLE, msg.sender), "Not authorized");
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Invalid amount");
        
        bytes32 bridgeId = keccak256(
            abi.encodePacked(
                sender,
                recipient,
                amount,
                block.timestamp,
                metadata
            )
        );
        
        require(!processedBridges[bridgeId], "Bridge already processed");
        
        processedBridges[bridgeId] = true;
        totalBridged[sender] += amount;
        
        emit BridgeInitiated(bridgeId, sender, recipient, amount, metadata);
        
        return bridgeId;
    }
    
    function completeBridge(bytes32 bridgeId) external nonReentrant {
        require(hasRole(BRIDGE_ADMIN_ROLE, msg.sender), "Not authorized");
        require(processedBridges[bridgeId], "Bridge not found");
        
        emit BridgeCompleted(
            bridgeId,
            msg.sender,
            address(0), // Will be filled by event listener
            0 // Will be filled by event listener
        );
    }
    
    function updateEventsEmitter(address newEmitter) external onlyRole(BRIDGE_ADMIN_ROLE) {
        eventsEmitter = IEquiEvents(newEmitter);
    }
    
    function getTotalBridged(address account) external view returns (uint256) {
        return totalBridged[account];
    }
} 