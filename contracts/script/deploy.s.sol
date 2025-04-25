// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Script.sol";
import "../src/EquiProtocol.sol";
import "../src/core/PaymentProcessor.sol";
import "../src/core/BlockDAGBridge.sol";
import "../src/plugins/EquiPluginManager.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();
        
        // Deploy implementation contracts
        PaymentProcessor paymentProcessor = new PaymentProcessor(address(0), address(0));
        BlockDAGBridge blockDAGBridge = new BlockDAGBridge(address(0), address(0));
        EquiPluginManager pluginManager = new EquiPluginManager(address(0));
        
        // Deploy main protocol contract and store its address
        address protocolAddress = address(new EquiProtocol(
            address(0), // USDC address
            address(paymentProcessor),
            address(blockDAGBridge),
            address(pluginManager),
            address(0)  // Events emitter address
        ));
        
        // Log the deployed address
        console.log("Protocol deployed at:", protocolAddress);
        
        vm.stopBroadcast();
    }
}
