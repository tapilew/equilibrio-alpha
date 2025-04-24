// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../src/EquiProtocolMVP.sol";

contract DeployScript {
    function run() external returns (EquiProtocolMVP) {
        address treasury = 0x1234567890123456789012345678901234567890; // Replace with the actual treasury address
        return new EquiProtocolMVP(treasury); // Pass only the treasury argument
    }
}
