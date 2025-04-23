// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {EquiProtocolMVP} from "../src/EquiProtocolMVP.sol";

contract DeployEquiProtocol {
    function deploy(
        address usdcAddress,
        string memory baseURI
    ) public returns (EquiProtocolMVP) {
        return new EquiProtocolMVP(usdcAddress, baseURI); // Solo 2 argumentos
    }
}
