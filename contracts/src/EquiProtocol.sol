// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IEquiEvents.sol";
import "./plugins/EquiPluginManager.sol";
import "./core/PaymentProcessor.sol";
import "./core/BlockDAGBridge.sol";

contract EquiProtocol is AccessControl, ReentrancyGuard {
    bytes32 public constant PROTOCOL_ADMIN_ROLE = keccak256("PROTOCOL_ADMIN_ROLE");
    bytes32 public constant PLUGIN_MANAGER_ROLE = keccak256("PLUGIN_MANAGER_ROLE");
    
    IERC20 public usdc;
    PaymentProcessor public paymentProcessor;
    BlockDAGBridge public blockDAGBridge;
    EquiPluginManager public pluginManager;
    IEquiEvents public eventsEmitter;
    
    mapping(address => bool) public supportedPlugins;
    
    event ProtocolInitialized(
        address usdc,
        address paymentProcessor,
        address blockDAGBridge,
        address pluginManager,
        address eventsEmitter
    );
    
    event PluginRegistered(bytes32 indexed pluginId, address implementation);
    event PluginEnabled(bytes32 indexed pluginId);
    event PluginDisabled(bytes32 indexed pluginId);
    event PaymentProcessed(
        bytes32 indexed paymentId,
        address indexed sender,
        address indexed recipient,
        uint256 amount,
        bytes metadata
    );
    
    constructor(
        address _usdc,
        address _paymentProcessor,
        address _blockDAGBridge,
        address _pluginManager,
        address _eventsEmitter
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PROTOCOL_ADMIN_ROLE, msg.sender);
        _setupRole(PLUGIN_MANAGER_ROLE, msg.sender);
        
        usdc = IERC20(_usdc);
        paymentProcessor = PaymentProcessor(_paymentProcessor);
        blockDAGBridge = BlockDAGBridge(_blockDAGBridge);
        pluginManager = EquiPluginManager(_pluginManager);
        eventsEmitter = IEquiEvents(_eventsEmitter);
        
        emit ProtocolInitialized(
            _usdc,
            _paymentProcessor,
            _blockDAGBridge,
            _pluginManager,
            _eventsEmitter
        );
    }
    
    function processPayment(
        address recipient,
        uint256 amount,
        bytes calldata metadata
    ) external nonReentrant returns (bytes32) {
        require(usdc.transferFrom(msg.sender, address(paymentProcessor), amount), "Transfer failed");
        
        bytes32 paymentId = paymentProcessor.processPayment(
            msg.sender,
            recipient,
            amount,
            metadata
        );
        
        emit PaymentProcessed(
            paymentId,
            msg.sender,
            recipient,
            amount,
            metadata
        );
        
        return paymentId;
    }
    
    function bridgeToBlockDAG(
        address recipient,
        uint256 amount,
        bytes calldata metadata
    ) external nonReentrant returns (bytes32) {
        require(usdc.transferFrom(msg.sender, address(blockDAGBridge), amount), "Transfer failed");
        
        bytes32 bridgeId = blockDAGBridge.bridgeToBlockDAG(
            msg.sender,
            recipient,
            amount,
            metadata
        );
        
        return bridgeId;
    }
    
    function registerPlugin(
        bytes32 pluginId,
        address implementation,
        string calldata pluginType,
        bytes calldata metadata
    ) external onlyRole(PLUGIN_MANAGER_ROLE) {
        pluginManager.registerPlugin(pluginId, implementation, pluginType, metadata);
        supportedPlugins[implementation] = true;
        emit PluginRegistered(pluginId, implementation);
    }
    
    function enablePlugin(bytes32 pluginId) external onlyRole(PLUGIN_MANAGER_ROLE) {
        pluginManager.enablePlugin(pluginId);
        emit PluginEnabled(pluginId);
    }
    
    function disablePlugin(bytes32 pluginId) external onlyRole(PLUGIN_MANAGER_ROLE) {
        pluginManager.disablePlugin(pluginId);
        emit PluginDisabled(pluginId);
    }
    
    function executePlugin(
        bytes32 pluginId,
        bytes calldata data
    ) external nonReentrant returns (bytes memory) {
        require(supportedPlugins[pluginManager.getPluginImplementation(pluginId)], "Plugin not supported");
        return pluginManager.executePlugin(pluginId, data);
    }
    
    function updateEventsEmitter(address newEmitter) external onlyRole(PROTOCOL_ADMIN_ROLE) {
        eventsEmitter = IEquiEvents(newEmitter);
    }
} 