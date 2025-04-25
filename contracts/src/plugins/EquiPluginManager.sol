// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IEquiEvents.sol";

contract EquiPluginManager is AccessControl, ReentrancyGuard {
    bytes32 public constant PLUGIN_ADMIN_ROLE = keccak256("PLUGIN_ADMIN_ROLE");
    
    struct Plugin {
        address implementation;
        string pluginType;
        bytes metadata;
        bool enabled;
    }
    
    mapping(bytes32 => Plugin) public plugins;
    mapping(address => bool) public supportedImplementations;
    
    IEquiEvents public eventsEmitter;
    
    event PluginRegistered(
        bytes32 indexed pluginId,
        address implementation,
        string pluginType
    );
    
    event PluginEnabled(bytes32 indexed pluginId);
    event PluginDisabled(bytes32 indexed pluginId);
    event PluginExecuted(
        bytes32 indexed pluginId,
        address indexed executor,
        bytes data,
        bytes result
    );
    
    constructor(address _eventsEmitter) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PLUGIN_ADMIN_ROLE, msg.sender);
        
        eventsEmitter = IEquiEvents(_eventsEmitter);
    }
    
    function registerPlugin(
        bytes32 pluginId,
        address implementation,
        string calldata pluginType,
        bytes calldata metadata
    ) external onlyRole(PLUGIN_ADMIN_ROLE) {
        require(implementation != address(0), "Invalid implementation");
        require(bytes(pluginType).length > 0, "Invalid plugin type");
        
        plugins[pluginId] = Plugin({
            implementation: implementation,
            pluginType: pluginType,
            metadata: metadata,
            enabled: false
        });
        
        supportedImplementations[implementation] = true;
        
        emit PluginRegistered(pluginId, implementation, pluginType);
    }
    
    function enablePlugin(bytes32 pluginId) external onlyRole(PLUGIN_ADMIN_ROLE) {
        require(plugins[pluginId].implementation != address(0), "Plugin not found");
        plugins[pluginId].enabled = true;
        emit PluginEnabled(pluginId);
    }
    
    function disablePlugin(bytes32 pluginId) external onlyRole(PLUGIN_ADMIN_ROLE) {
        require(plugins[pluginId].implementation != address(0), "Plugin not found");
        plugins[pluginId].enabled = false;
        emit PluginDisabled(pluginId);
    }
    
    function executePlugin(
        bytes32 pluginId,
        bytes calldata data
    ) external nonReentrant returns (bytes memory) {
        Plugin storage plugin = plugins[pluginId];
        require(plugin.implementation != address(0), "Plugin not found");
        require(plugin.enabled, "Plugin not enabled");
        
        (bool success, bytes memory result) = plugin.implementation.call(data);
        require(success, "Plugin execution failed");
        
        emit PluginExecuted(pluginId, msg.sender, data, result);
        
        return result;
    }
    
    function getPluginImplementation(bytes32 pluginId) external view returns (address) {
        return plugins[pluginId].implementation;
    }
    
    function getPluginType(bytes32 pluginId) external view returns (string memory) {
        return plugins[pluginId].pluginType;
    }
    
    function isPluginEnabled(bytes32 pluginId) external view returns (bool) {
        return plugins[pluginId].enabled;
    }
    
    function updateEventsEmitter(address newEmitter) external onlyRole(PLUGIN_ADMIN_ROLE) {
        eventsEmitter = IEquiEvents(newEmitter);
    }
} 