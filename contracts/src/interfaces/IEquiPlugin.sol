// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IEquiPlugin {
    struct PluginMetadata {
        string name;
        string version;
        string description;
        address author;
        bytes configuration;
    }
    
    function getMetadata() external view returns (PluginMetadata memory);
    function initialize(bytes calldata data) external;
    function execute(bytes calldata data) external returns (bytes memory);
    function validate(bytes calldata data) external view returns (bool);
} 