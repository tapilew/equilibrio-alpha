// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../src/EquiProtocolMVP.sol";
import "forge-std/Script.sol";

contract DeployScript is Script {
    function run() external {
        // Load environment variables
        string memory blockdagUri = vm.envString("BLOCKDAG_URI");
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        // Start broadcasting to the BlockDAG network
        vm.startBroadcast(privateKey);

        // Deploy the contract
        address treasury = 0x1234567890123456789012345678901234567890; // Replace with the actual treasury address
        EquiProtocolMVP equiProtocol = new EquiProtocolMVP(treasury);

        // Log the deployed contract address
        console.log("EquiProtocolMVP deployed at:", address(equiProtocol));

        // Stop broadcasting
        vm.stopBroadcast();
    }
}
